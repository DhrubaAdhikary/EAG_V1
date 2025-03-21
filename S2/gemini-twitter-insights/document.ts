document.addEventListener('DOMContentLoaded', () => {
  const scanButton = document.getElementById('scanButton');
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  const summaryContent = document.getElementById('summaryContent');
  const lastUpdate = document.getElementById('lastUpdate');

  scanButton.addEventListener('click', async () => {
    try {
      loading.classList.remove('hidden');
      results.classList.add('hidden');

      // Get tweets from content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'scrapeTweets' });

      if (!response || !response.success || !response.tweets.length) {
        throw new Error('No tweets found or failed to scrape tweets.');
      }

      // Prepare prompt for Gemini
      const tweets = response.tweets.slice(0, 5); // Limit to top 5 tweets
      const prompt = `Analyze these recent tweets about Google Gemini and provide a concise summary of the key updates and trends:
        ${tweets.map(t => `[${t.timestamp}] ${t.author}: ${t.text}`).join('\n')}`;

      // Get analysis from Gemini
      const { data } = await chrome.runtime.sendMessage({
        action: 'analyzeTweets',
        prompt
      });

      if (!data || !data.candidates || !data.candidates[0].content.parts[0].text) {
        throw new Error('Failed to get analysis from Gemini.');
      }

      // Update UI
      summaryContent.textContent = data.candidates[0].content.parts[0].text;
      lastUpdate.textContent = new Date().toLocaleString();
      results.classList.remove('hidden');
    } catch (error) {
      summaryContent.textContent = `Error: ${error.message}`;
    } finally {
      loading.classList.add('hidden');
    }
  });
});