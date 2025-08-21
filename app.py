import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json

# Configure the Gemini API key from environment variables
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

app = Flask(__name__)
CORS(app)  # Enables CORS to allow communication from the Chrome extension


@app.route("/get-meaning", methods=["POST"])
def get_meaning():
    data = request.get_json()
    word = data.get("word")
    context = data.get("context")

    # Craft the prompt for the AI model
    prompt = f"""
    You are a helpful assistant for defining words based on context. 
    A user has selected the word "{word}" in the following text:
    "{context}"
    
    1. Provide the most accurate meaning of the word "{word}" as it is used in the context.
    2. Give two example sentences that use the word in a similar way.
    
    Format your response as a JSON object with the following keys:
    - "meaning": The meaning of the word.
    - "examples": A list of two example sentences.
    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    # Assuming the response is well-formatted JSON
    try:
        ai_response = response.text.strip().replace("```json", "").replace("```", "")
        meaning_data = json.loads(ai_response)
        return jsonify(meaning_data)
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to parse AI response."}), 500


if __name__ == "__main__":
    # Make sure to set your GEMINI_API_KEY as an environment variable
    app.run(debug=True, port=5000)
