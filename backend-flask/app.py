from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
from dotenv import load_dotenv
import os
import tempfile
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

# 🔐 Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# 🧠 Load Whisper + GPT model
model = whisper.load_model("medium")  # Use "base" or "small" for faster startup on Render
llm = ChatOpenAI(model="gpt-4o", temperature=0)

# 🎙️ Speech-to-Text + GPT-4o formatting
@app.route("/speech-to-text", methods=["POST"])
def speech_to_text():
    if 'audio' not in request.files:
        print("❌ No audio file in request")
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]
    print(f"🎤 Audio received: {audio_file.filename}")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        audio_file.save(temp_audio.name)
        temp_path = temp_audio.name

    try:
        # Transcribe
        result = model.transcribe(temp_path)
        transcription = result["text"]
        print("📝 Transcribed:", transcription)

        # Format via GPT
        prompt = (
            "You are a food ordering assistant. "
            "Convert this into a food order like '2 Paneer Tikka, 1 Cold Coffee'\n"
            f"Text: {transcription}"
        )
        response = llm([HumanMessage(content=prompt)])
        formatted_order = response.content.strip()

        print("🤖 GPT Output:", formatted_order)
        return jsonify({"order": formatted_order})

    except Exception as e:
        print("❌ Processing error:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        os.remove(temp_path)
        print("🧹 Temp file deleted")

# 🌍 Translation Endpoint
@app.route("/api/translate", methods=["POST"])
def translate():
    data = request.json
    text = data.get("text")
    target_lang = data.get("targetLang")

    if not text or not target_lang:
        return jsonify({"error": "Missing text or targetLang"}), 400

    try:
        prompt = f"Translate the following into {target_lang}:\n{text}"
        print(f"🌐 Translating → {target_lang}: {text}")

        response = llm([HumanMessage(content=prompt)])
        translated_text = response.content.strip()

        print("✅ Translation:", translated_text)
        return jsonify({"translatedText": translated_text})

    except Exception as e:
        print("❌ Translation error:", str(e))
        return jsonify({"error": str(e)}), 500

# ✅ Health check route
@app.route("/", methods=["GET"])
def health():
    return "Sarva Flask Backend is Running ✅"

# 🚀 Start server
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    app.run(host="0.0.0.0", port=port, debug=False)
