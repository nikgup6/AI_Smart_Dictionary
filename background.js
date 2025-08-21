// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // This return true is crucial. It tells Chrome that you will send a response asynchronously.
    // Without this, the message channel will close immediately.
    sendResponse({ status: 'received' });

    if (request.action === 'getMeaning') {
        // Now you can do your async work (the fetch call)
        fetch('http://127.0.0.1:5000/get-meaning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                word: request.word,
                context: request.context
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // After the fetch is complete, send the result back to the content script.
            // This is a separate message, not a direct response to the original message.
            chrome.tabs.sendMessage(sender.tab.id, {
                action: 'displayMeaning',
                data: {
                    word: request.word,
                    meaning: data.meaning,
                    examples: data.examples
                }
            });
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            // Send an error message back to the content script.
            chrome.tabs.sendMessage(sender.tab.id, {
                action: 'displayError',
                message: 'Could not connect to the server or process the request.'
            });
        });
    }
});