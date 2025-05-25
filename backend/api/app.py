from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
import sys
from pathlib import Path

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent.parent))

from backend.models.models import db, User, Patient, Medication, Appointment, VitalSigns, EmergencyContact
from services.ai.ai_service import AIService
from services.notification.notification_service import NotificationService

# Load environment variables
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '../../config/env/.env'))

app = Flask(__name__, 
           template_folder='../../frontend/templates',
           static_folder='../../frontend/static')

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///../../database/aarogyadeepa.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
db.init_app(app)
CORS(app)
jwt = JWTManager(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Initialize services
ai_service = AIService()
notification_service = NotificationService()

# Root route to serve index.html
@app.route('/')
def index():
    return render_template('index.html')

# Authentication Routes
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.form
        user = User.query.filter_by(email=data['email']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password')
            return redirect(url_for('login'))
    
    return render_template('auth/login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.form
        
        if User.query.filter_by(email=data['email']).first():
            flash('Email already registered')
            return redirect(url_for('register'))
        
        user = User(
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone'),
            preferred_language=data.get('preferred_language', 'en')
        )
        
        db.session.add(user)
        db.session.commit()
        
        login_user(user)
        return redirect(url_for('dashboard'))
    
    return render_template('auth/register.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

# Patient Management Routes
@app.route('/api/patients', methods=['GET'])
@jwt_required()
def get_patients():
    try:
        user_id = get_jwt_identity()
        patients = Patient.query.filter_by(user_id=user_id).all()
        
        return jsonify([{
            'id': p.id,
            'first_name': p.first_name,
            'last_name': p.last_name,
            'date_of_birth': p.date_of_birth.isoformat() if p.date_of_birth else None,
            'gender': p.gender,
            'blood_type': p.blood_type,
            'allergies': p.allergies,
            'medical_conditions': p.medical_conditions,
            'emergency_contact': p.emergency_contact
        } for p in patients]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients', methods=['POST'])
@jwt_required()
def create_patient():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        patient = Patient(
            user_id=user_id,
            first_name=data['first_name'],
            last_name=data['last_name'],
            date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date() if data.get('date_of_birth') else None,
            gender=data.get('gender'),
            blood_type=data.get('blood_type'),
            allergies=data.get('allergies'),
            medical_conditions=data.get('medical_conditions'),
            emergency_contact=data.get('emergency_contact')
        )
        
        db.session.add(patient)
        db.session.commit()
        
        return jsonify({
            'message': 'Patient created successfully',
            'patient_id': patient.id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Medication Management Routes
@app.route('/api/medications', methods=['GET'])
@jwt_required()
def get_medications():
    try:
        user_id = get_jwt_identity()
        medications = Medication.query.join(Patient).filter(Patient.user_id == user_id).all()
        
        return jsonify([{
            'id': m.id,
            'name': m.name,
            'dosage': m.dosage,
            'frequency': m.frequency,
            'start_date': m.start_date.isoformat() if m.start_date else None,
            'end_date': m.end_date.isoformat() if m.end_date else None,
            'instructions': m.instructions,
            'side_effects': m.side_effects,
            'is_active': m.is_active,
            'patient_id': m.patient_id
        } for m in medications]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/medications', methods=['POST'])
@jwt_required()
def add_medication():
    try:
        data = request.get_json()
        
        medication = Medication(
            patient_id=data['patient_id'],
            name=data['name'],
            dosage=data['dosage'],
            frequency=data['frequency'],
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date() if data.get('start_date') else None,
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None,
            instructions=data.get('instructions'),
            side_effects=data.get('side_effects'),
            is_active=data.get('is_active', True)
        )
        
        db.session.add(medication)
        db.session.commit()
        
        return jsonify({
            'message': 'Medication added successfully',
            'medication_id': medication.id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Vital Signs Routes
@app.route('/api/vitals', methods=['GET'])
@jwt_required()
def get_vitals():
    try:
        patient_id = request.args.get('patient_id')
        days = int(request.args.get('days', 30))
        
        start_date = datetime.now() - timedelta(days=days)
        vitals = VitalSigns.query.filter(
            VitalSigns.patient_id == patient_id,
            VitalSigns.recorded_at >= start_date
        ).order_by(VitalSigns.recorded_at.desc()).all()
        
        return jsonify([{
            'id': v.id,
            'blood_pressure_systolic': v.blood_pressure_systolic,
            'blood_pressure_diastolic': v.blood_pressure_diastolic,
            'heart_rate': v.heart_rate,
            'temperature': float(v.temperature) if v.temperature else None,
            'oxygen_saturation': v.oxygen_saturation,
            'weight': float(v.weight) if v.weight else None,
            'height': float(v.height) if v.height else None,
            'recorded_at': v.recorded_at.isoformat()
        } for v in vitals]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/vitals', methods=['POST'])
@jwt_required()
def record_vitals():
    try:
        data = request.get_json()
        
        vitals = VitalSigns(
            patient_id=data['patient_id'],
            blood_pressure_systolic=data.get('blood_pressure_systolic'),
            blood_pressure_diastolic=data.get('blood_pressure_diastolic'),
            heart_rate=data.get('heart_rate'),
            temperature=data.get('temperature'),
            oxygen_saturation=data.get('oxygen_saturation'),
            weight=data.get('weight'),
            height=data.get('height'),
            recorded_at=datetime.now()
        )
        
        db.session.add(vitals)
        db.session.commit()
        
        # Check for abnormal readings and send alerts
        ai_analysis = ai_service.analyze_vitals(vitals)
        if ai_analysis.get('alert_required'):
            notification_service.send_health_alert(vitals.patient_id, ai_analysis)
        
        return jsonify({
            'message': 'Vitals recorded successfully',
            'vitals_id': vitals.id,
            'ai_analysis': ai_analysis
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Appointment Routes
@app.route('/api/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    try:
        user_id = get_jwt_identity()
        appointments = Appointment.query.join(Patient).filter(Patient.user_id == user_id).all()
        
        return jsonify([{
            'id': a.id,
            'doctor_name': a.doctor_name,
            'specialty': a.specialty,
            'appointment_date': a.appointment_date.isoformat(),
            'duration': a.duration,
            'location': a.location,
            'notes': a.notes,
            'status': a.status,
            'patient_id': a.patient_id
        } for a in appointments]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    try:
        data = request.get_json()
        
        appointment = Appointment(
            patient_id=data['patient_id'],
            doctor_name=data['doctor_name'],
            specialty=data.get('specialty'),
            appointment_date=datetime.strptime(data['appointment_date'], '%Y-%m-%d %H:%M'),
            duration=data.get('duration', 30),
            location=data.get('location'),
            notes=data.get('notes'),
            status='scheduled'
        )
        
        db.session.add(appointment)
        db.session.commit()
        
        return jsonify({
            'message': 'Appointment scheduled successfully',
            'appointment_id': appointment.id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# AI Assistant Routes
@app.route('/api/ai/chat', methods=['POST'])
@jwt_required()
def ai_chat():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        message = data['message']
        language = data.get('language', 'en')
        
        # Get user context
        user = User.query.get(user_id)
        patients = Patient.query.filter_by(user_id=user_id).all()
        
        # Process message with AI
        response = ai_service.process_message(message, user, patients, language)
        
        # Convert to speech if requested
        if data.get('voice_response'):
            audio_url = dwani_service.text_to_speech(response['text'], language)
            response['audio_url'] = audio_url
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/voice', methods=['POST'])
@jwt_required()
def process_voice():
    try:
        audio_file = request.files['audio']
        language = request.form.get('language', 'en')
        
        # Convert speech to text
        text = dwani_service.speech_to_text(audio_file, language)
        
        # Process with AI
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        patients = Patient.query.filter_by(user_id=user_id).all()
        
        response = ai_service.process_message(text, user, patients, language)
        
        # Convert response back to speech
        audio_url = dwani_service.text_to_speech(response['text'], language)
        
        return jsonify({
            'transcribed_text': text,
            'response_text': response['text'],
            'audio_url': audio_url,
            'actions': response.get('actions', [])
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Emergency Routes
@app.route('/api/emergency/alert', methods=['POST'])
@jwt_required()
def emergency_alert():
    try:
        data = request.get_json()
        patient_id = data['patient_id']
        alert_type = data['alert_type']
        location = data.get('location')
        
        # Get patient and emergency contacts
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        # Send emergency notifications
        notification_service.send_emergency_alert(patient, alert_type, location)
        
        return jsonify({
            'message': 'Emergency alert sent successfully',
            'alert_id': f"EMRG_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health Analytics Routes
@app.route('/api/analytics/health-trends', methods=['GET'])
@jwt_required()
def get_health_trends():
    try:
        patient_id = request.args.get('patient_id')
        days = int(request.args.get('days', 30))
        
        trends = ai_service.analyze_health_trends(patient_id, days)
        
        return jsonify(trends), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/medication-adherence', methods=['GET'])
@jwt_required()
def get_medication_adherence():
    try:
        patient_id = request.args.get('patient_id')
        
        adherence = ai_service.calculate_medication_adherence(patient_id)
        
        return jsonify(adherence), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Drug Interaction Checker
@app.route('/api/medications/check-interactions', methods=['POST'])
@jwt_required()
def check_drug_interactions():
    try:
        data = request.get_json()
        medications = data['medications']
        
        interactions = ai_service.check_drug_interactions(medications)
        
        return jsonify({
            'interactions': interactions,
            'severity_levels': {
                'high': [i for i in interactions if i['severity'] == 'high'],
                'medium': [i for i in interactions if i['severity'] == 'medium'],
                'low': [i for i in interactions if i['severity'] == 'low']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Pill Scanner Route
@app.route('/api/medications/scan-pill', methods=['POST'])
@jwt_required()
def scan_pill():
    try:
        image_file = request.files['image']
        
        # Process image with AI
        pill_info = ai_service.identify_pill(image_file)
        
        return jsonify(pill_info), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Family Portal Routes
@app.route('/api/family/members', methods=['GET'])
@jwt_required()
def get_family_members():
    try:
        user_id = get_jwt_identity()
        # Implementation for family member management
        return jsonify({'message': 'Family members retrieved'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database
with app.app_context():
    db.create_all()

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5010)
