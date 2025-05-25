import requests
import json
from werkzeug.utils import secure_filename
import os

class DwaniService:
    def __init__(self):
        self.api_key = os.environ.get('DWANI_API_KEY')
        self.base_url = "https://api.dwani.ai/v1"
        
        if not self.api_key:
            print("Warning: DWANI_API_KEY not set. Voice features will be disabled.")

    def text_to_speech(self, text, language='en'):
        """Convert text to speech using Dwani API"""
        try:
            if not self.api_key:
                print("Error: Dwani API key not configured")
                return None

            # Language mapping for Dwani API
            language_map = {
                'en': 'en-US',
                'hi': 'hi-IN',
                'kn': 'kn-IN',
                'te': 'te-IN',
                'ta': 'ta-IN',
                'ur': 'ur-IN'
            }
            
            payload = {
                'text': text,
                'language': language_map.get(language, 'en-US'),
                'voice': 'female',
                'speed': 1.0,
                'pitch': 1.0
            }
            
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                f'{self.base_url}/tts',
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('audio_url')
            else:
                print(f"TTS Error: API returned status code {response.status_code}")
                return None
                
        except Exception as e:
            print(f"TTS Error: {str(e)}")
            return None
    
    def speech_to_text(self, audio_file, language='en'):
        """Convert speech to text using Dwani API"""
        try:
            if not self.api_key:
                print("Error: Dwani API key not configured")
                return ''

            # Language mapping for Dwani API
            language_map = {
                'en': 'en-US',
                'hi': 'hi-IN',
                'kn': 'kn-IN',
                'te': 'te-IN',
                'ta': 'ta-IN',
                'ur': 'ur-IN'
            }
            
            files = {
                'audio': audio_file,
                'language': (None, language_map.get(language, 'en-US')),
                'model': (None, 'general')
            }
            
            headers = {
                'Authorization': f'Bearer {self.api_key}'
            }
            
            response = requests.post(
                f'{self.base_url}/stt',
                files=files,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('transcription', '')
            else:
                print(f"STT Error: API returned status code {response.status_code}")
                return ''
                
        except Exception as e:
            print(f"STT Error: {str(e)}")
            return ''
    
    def translate_text(self, text, source_lang, target_lang):
        """Translate text between languages"""
        try:
            payload = {
                'text': text,
                'source_language': source_lang,
                'target_language': target_lang
            }
            
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                f'{self.base_url}/translate',
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('translated_text', text)
            else:
                return text
                
        except Exception as e:
            print(f"Translation Error: {str(e)}")
            return text
