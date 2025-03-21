function extractTweetData(tweet) {
  const text = tweet.querySelector('[data-testid="tweetText"]')?.textContent || '';
  const timestamp = tweet.querySelector('time')?.getAttribute('datetime') || '';
  const author = tweet.querySelector('[data-testid="User-Name"]')?.textContent || '';

  return { text, timestamp, author };
}

function searchGeminiTweets() {
  const tweets = Array.from(document.querySelectorAll('[data-testid="tweet"]'))
    .map(extractTweetData)
    .filter(tweet => tweet.text.toLowerCase().includes('gemini') && tweet.timestamp && tweet.author)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return tweets.slice(0, 10); // Get latest 10 tweets
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeTweets') {
    try {
      const tweets = searchGeminiTweets();
      sendResponse({ success: true, tweets });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  return true;
});