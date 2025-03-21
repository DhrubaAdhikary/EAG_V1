const keywords = [
  "Generative AI",
  "Language Model",
  "LLM",
  "ChatGPT",
  "GPT-4",
  "AI Model",
  "Claude",
  "Gemini"
];

function scanTweets() {
  const tweets = document.querySelectorAll('[data-testid="tweet"]');
  const results = [];

  tweets.forEach(tweet => {
      const tweetText = tweet.textContent.toLowerCase();
      const matchedKeywords = keywords.filter(keyword => 
          tweetText.includes(keyword.toLowerCase())
      );

      if (matchedKeywords.length > 0) {
          results.push({
              text: tweet.textContent,
              keywords: matchedKeywords
          });
      }
  });

  return results;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scanTweets") {
      const results = scanTweets();
      sendResponse({ results });
  }
});