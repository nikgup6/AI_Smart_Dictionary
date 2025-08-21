📘 Smart Dictionary: AI-Powered Chrome Extension
About the Project
Smart Dictionary is a Chrome extension that uses the power of AI to provide context-aware meanings and translations of words. Unlike a standard dictionary, this tool analyzes the surrounding text to give you the most accurate and relevant definition for any word you encounter while browsing the web. Simply highlight a word, and a small bar will appear with its meaning and usage examples.

🌟 Features
Contextual Definitions: By analyzing the sentences before and after a highlighted word, the extension provides a meaning that is precise and relevant to the text.

Example Sentences: The extension gives two example sentences that demonstrate how the word is used, further enhancing your understanding.

Minimalist UI: A clean, non-intrusive floating bar appears only when you need it, ensuring a seamless browsing experience.

Efficient Back-end: The core logic is powered by a Python back-end that communicates with a powerful AI model.

🛠️ Tech Stack
Front-end (Chrome Extension): HTML, CSS, and JavaScript

Back-end (AI Server): Python with Flask

AI Model: Google's Gemini API

🚀 Getting Started
Prerequisites
Python 3.x installed on your system.

A Google Gemini API Key. You can get a free one from Google AI Studio.

Google Chrome browser.

Installation
Follow these steps to set up and run the project locally.

1. Clone the repository:
   If you're using a version control system, you can clone the project. Otherwise, just download and unzip the folder.

2. Set up the back-end server:

Navigate to the server/ directory.

Install the required Python packages:

Bash

pip install -r requirements.txt
Set your Gemini API key as an environment variable.

Windows (Command Prompt): set GEMINI_API_KEY=YOUR_API_KEY_HERE

macOS/Linux: export GEMINI_API_KEY="YOUR_API_KEY_HERE"

Run the server:

Bash

python app.py
The server will run on http://127.0.0.1:5000. Keep this terminal window open.

3. Load the Chrome extension:

Open Google Chrome and go to chrome://extensions.

Enable Developer mode in the top-right corner.

Click "Load unpacked" and select the main project folder (Smart-Dictionary-Extension).

The extension icon will appear in your toolbar.

🔧 Usage
Navigate to any webpage with text.

Highlight a word you want to look up.

A small, floating bar will appear near the highlighted text, displaying the word's meaning and two example sentences.
