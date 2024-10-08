from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import speech_recognition as sr
from pydub import AudioSegment
import io
from googletrans import Translator

app = Flask(__name__)

# Enable CORS for your frontend (localhost:5173)
CORS(app, resources={r"/record": {"origins": "http://localhost:5173"}})

r = sr.Recognizer()
translator = Translator()

@app.route('/record', methods=['POST'])
def record_text():
    try:
        # Get the audio file and the selected language from the request
        audio_file = request.files['audio']
        language = request.form['language']

        # Convert the audio file to wav format
        audio_data = AudioSegment.from_file(audio_file)
        audio_data = audio_data.set_channels(1).set_frame_rate(16000)
        audio_wav = io.BytesIO()
        audio_data.export(audio_wav, format="wav")
        audio_wav.seek(0)

        # Use speech recognition with the specified language
        with sr.AudioFile(audio_wav) as source:
            audio = r.record(source)
            text = r.recognize_google(audio, language=language)  # Recognize speech in the selected language
            
            # Translate recognized text to English
            translated_text = translator.translate(text, dest='en').text
            
            return jsonify({'text': translated_text}), 200

    except sr.UnknownValueError:
        return jsonify({'error': 'Could not understand audio'}), 400
    except sr.RequestError:
        return jsonify({'error': 'Could not request results'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
