document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const content = document.getElementById('content');
  const error = document.getElementById('error');
  const wordElem = document.getElementById('word');
  const meaningElem = document.getElementById('meaning');
  const examplesList = document.getElementById('examples');

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startLoading') {
        content.classList.add('hidden');
        error.classList.add('hidden');
        loader.classList.remove('hidden');
    }
    else if (request.action === 'displayMeaning') {
        loader.classList.add('hidden');
        if (request.data && request.data.meaning) {
            content.classList.remove('hidden');
            wordElem.textContent = request.data.word;
            meaningElem.textContent = request.data.meaning;
            
            examplesList.innerHTML = '';
            request.data.examples.forEach(example => {
                const li = document.createElement('li');
                li.textContent = example;
                examplesList.appendChild(li);
            });
        } else {
            error.classList.remove('hidden');
        }
    }
    else if (request.action === 'displayError') {
        loader.classList.add('hidden');
        content.classList.add('hidden');
        error.classList.remove('hidden');
        error.textContent = request.message;
    }
  });
});