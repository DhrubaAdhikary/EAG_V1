document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "scanTweets"}, function(response) {
            const statusDiv = document.getElementById('status');
            const resultsDiv = document.getElementById('results');

            if (response && response.results) {
                statusDiv.textContent = `Found ${response.results.length} relevant tweets`;
                
                response.results.forEach(tweet => {
                    const tweetDiv = document.createElement('div');
                    tweetDiv.className = 'tweet';
                    tweetDiv.textContent = tweet.text;
                    resultsDiv.appendChild(tweetDiv);
                });
            } else {
                statusDiv.textContent = 'No AI-related tweets found';
            }
        });
    });
});