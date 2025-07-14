import axios from "axios";

export const translateText = async (text, targetLang) => {
  try {
    const res = await axios.post("http://localhost:5050/api/translate", {
      text,
      targetLang,
    });
    return res.data.translatedText;
  } catch (err) {
    console.error("Translation error:", err);
    return text;
  }
};
