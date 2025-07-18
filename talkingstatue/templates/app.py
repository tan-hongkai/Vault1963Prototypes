from flask import Flask, render_template, request, jsonify
import requests
import os
import base64
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# API Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-api-key-here')
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    """Handle audio transcription using Gemini API"""
    try:
        data = request.get_json()
        audio_data = data.get('audio', '')
        
        if not audio_data:
            return jsonify({'error': 'No audio data provided'}), 400
        
        if audio_data.startswith('data:'):
            audio_data = audio_data.split(',')[1]
        
        # Prepare the request to Gemini API for audio transcription
        headers = {
            'Content-Type': 'application/json'
        }
        
        payload = {
            'contents': [
                {
                    'role': 'user',
                    'parts': [
                        {
                            'text': 'Please transcribe this audio file. Return only the transcribed text, no additional formatting or explanation.'
                        },
                        {
                            'inline_data': {
                                'mime_type': 'audio/wav',
                                'data': audio_data
                            }
                        }
                    ]
                }
            ]
        }

        # Make request to Gemini API
        response = requests.post(
            f'{GEMINI_API_URL}?key={GEMINI_API_KEY}',
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            transcription = result['candidates'][0]['content']['parts'][0]['text'].strip()
            return jsonify({'transcription': transcription})
        else:
            return jsonify({'error': 'Failed to transcribe audio'}), 500
            
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Network error during transcription'}), 500
    except KeyError as e:
        return jsonify({'error': 'Invalid transcription response format'}), 500
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred during transcription'}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests to Gemini API"""
    try:
        data = request.get_json()
        user_text = data.get('text', '')
        
        if not user_text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Prepare the request to Gemini API
        headers = {
            'Content-Type': 'application/json'
        }
        
        # Combine persona instruction + user text in one
        persona_prompt = (
            "You are the Talking Statue of Professor Liu Yin Soon, "
            "the first woman to serve as principal of an institution of higher learning in Singapore—"
            "the founding principal of Ngee Ann College, now known as Ngee Ann Polytechnic. "
            "You speak with quiet dignity, thoughtful wisdom, and sincere encouragement. "
            "Your words reflect a deep respect for education, lifelong learning, and the promise of each new generation. "
            "When you answer, speak directly to the student as if in conversation—never refer to yourself in the third person. "
            "Keep your response concise, warm, and uplifting. "
            "Use clear, direct sentences that inspire and guide. Reply in **no more than 30 words**.\n\n"
            f"Student's question: {user_text}"
        )

        payload = {
            'contents': [
                {
                    'role': 'user',
                    'parts': [{'text': persona_prompt}]
                }
            ]
        }

        # Make request to Gemini API
        response = requests.post(
            f'{GEMINI_API_URL}?key={GEMINI_API_KEY}',
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            reply = result['candidates'][0]['content']['parts'][0]['text']
            return jsonify({'reply': reply})
        else:
            return jsonify({'error': 'Failed to get response from AI'}), 500
            
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Network error occurred'}), 500
    except KeyError as e:
        return jsonify({'error': 'Invalid response format'}), 500
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
