// We'll create a UI element that we can show and hide
let floatingBar = null;

function createFloatingBar() {
    // Check if the bar already exists
    if (floatingBar) {
        return;
    }

    floatingBar = document.createElement('div');
    floatingBar.id = 'smart-dictionary-bar';
    floatingBar.style.cssText = `
        position: absolute;
        z-index: 99999;
        background-color: #f9f9f9; /* Light gray background */
        border: 1px solid #ddd;         /* Light gray border */
        border-radius: 8px;             /* More rounded corners */
        padding: 15px;                  /* More padding */
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); /* Softer shadow */
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Modern font */
        color: #333;                     /* Dark text color */
        display: none;
        max-width: 380px;                /* Slightly wider max-width */
        word-wrap: break-word;
    `;

    floatingBar.innerHTML = `
        <div id="sd-loading" style="color: #555; font-style: italic;">Loading...</div>
        <div id="sd-content" style="display:none;">
            <h4 style="margin-top: 0; color: #2c3e50;">Meaning:</h4>
            <p id="sd-meaning" style="margin-bottom: 10px; line-height: 1.6;"></p>
            <h4 style="color: #2c3e50; margin-bottom: 8px;">Examples:</h4>
            <ol id="sd-examples" style="padding-left: 20px; margin-bottom: 0;"></ol>
        </div>
        <div id="sd-error" style="display:none; color: #c0392b;"></div>
    `;

    document.body.appendChild(floatingBar);
}

document.addEventListener('mouseup', function(event) {
    const selection = window.getSelection().toString().trim();

    // If no text is selected, or if the selection is from the floating bar itself, hide the bar
    if (selection.length === 0 || floatingBar?.contains(event.target)) {
        if (floatingBar) {
            floatingBar.style.display = 'none';
        }
        return;
    }

    // Create the bar if it doesn't exist
    createFloatingBar();

    // Position the bar near the mouse cursor
    floatingBar.style.top = `${event.pageY + 10}px`;
    floatingBar.style.left = `${event.pageX}px`;
    floatingBar.style.display = 'block';

    // Show the loading state
    document.getElementById('sd-loading').style.display = 'block';
    document.getElementById('sd-content').style.display = 'none';
    document.getElementById('sd-error').style.display = 'none';

    // Get the surrounding sentences
    const selectionRange = window.getSelection().getRangeAt(0);
    const context = getContextFromRange(selectionRange);

    // Send the message to the background script
    chrome.runtime.sendMessage({
        action: 'getMeaning',
        word: selection,
        context: context
    });
});

// Listen for the response from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'displayMeaning') {
        document.getElementById('sd-loading').style.display = 'none';
        if (request.data && request.data.meaning) {
            const sdContent = document.getElementById('sd-content');
            sdContent.style.display = 'block';
            document.getElementById('sd-meaning').textContent = request.data.meaning;

            const examplesList = document.getElementById('sd-examples');
            examplesList.innerHTML = ''; // Clear previous examples
            request.data.examples.forEach((example, index) => {
                const li = document.createElement('li');
                li.textContent = example;
                li.style.marginBottom = '6px'; // Add a little spacing between list items
                examplesList.appendChild(li);
            });
        } else {
            document.getElementById('sd-error').style.display = 'block';
            document.getElementById('sd-error').textContent = 'Could not find a meaning for this word.';
        }
    }

    if (request.action === 'displayError') {
        document.getElementById('sd-loading').style.display = 'none';
        document.getElementById('sd-content').style.display = 'none';
        document.getElementById('sd-error').style.display = 'block';
        document.getElementById('sd-error').textContent = request.message;
    }
});

// A helper function to get text before and after the selection
function getContextFromRange(range) {
    const preText = range.startContainer.textContent.slice(0, range.startOffset);
    const postText = range.endContainer.textContent.slice(range.endOffset);
    return preText.slice(-200) + ' ' + range.toString() + ' ' + postText.slice(0, 200);
}