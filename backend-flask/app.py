from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
from dotenv import load_dotenv
import os
import tempfile
from langchain_openai import ChatOpenAI  # ✅ Updated import
from langchain_core.messages import HumanMessage

# 🔐 Load .env variables (must include OPENAI_API_KEY)
load_dotenv()

app = Flask(__name__)
CORS(app)

# 🧠 Load Whisper model + GPT-4o model
model = whisper.load_model("medium")
llm = ChatOpenAI(model="gpt-4o", temperature=0)  # ✅ Updated usage

# 🎙️ Speech-to-Text + GPT Order Formatting
@app.route("/speech-to-text", methods=["POST"])
def speech_to_text():
    if 'audio' not in request.files:
        print("❌ No audio file found in request")
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]
    print(f"🎤 Received audio: {audio_file.filename}")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        audio_file.save(temp_audio.name)
        temp_path = temp_audio.name

    try:
        # 1. Transcribe using Whisper
        result = model.transcribe(temp_path)
        transcription = result["text"]
        print("📝 Transcription:", transcription)

        # 2. Format using GPT
        prompt = (
            "You are a food ordering assistant. "
            "Convert the following text into a structured food order in format like: "
            "'2 Paneer Tikka, 1 Cold Coffee'\n"
            f"Text: {transcription}"
        )
        response = llm([HumanMessage(content=prompt)])
        formatted_order = response.content.strip()
        print("🤖 GPT Output:", formatted_order)

        return jsonify({"order": formatted_order})

    except Exception as e:
        print("❌ Error occurred:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        os.remove(temp_path)
        print("🧹 Temp file deleted:", temp_path)

# 🌍 AI Translation Route
@app.route("/api/translate", methods=["POST"])
def translate():
    data = request.json
    text = data.get("text")
    target_lang = data.get("targetLang")

    if not text or not target_lang:
        return jsonify({"error": "Missing text or targetLang"}), 400

    try:
        prompt = f"Translate the following into {target_lang}:\n{text}"
        print(f"🌐 Translating: '{text}' → {target_lang}")

        response = llm([HumanMessage(content=prompt)])
        translated_text = response.content.strip()

        print("✅ Translation:", translated_text)
        return jsonify({"translatedText": translated_text})

    except Exception as e:
        print("❌ Error in translation:", str(e))
        return jsonify({"error": str(e)}), 500

# 🚀 Start Flask server
if __name__ == "__main__":
    app.run(debug=True, port=5050)
