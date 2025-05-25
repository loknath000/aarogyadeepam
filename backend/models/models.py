from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    preferred_language = db.Column(db.String(10), default='en')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    patients = db.relationship('Patient', backref='user', lazy=True)

class Patient(db.Model):
    __tablename__ = 'patients'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(10))
    blood_type = db.Column(db.String(5))
    allergies = db.Column(db.Text)
    medical_conditions = db.Column(db.Text)
    emergency_contact = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    medications = db.relationship('Medication', backref='patient', lazy=True)
    vital_signs = db.relationship('VitalSigns', backref='patient', lazy=True)
    appointments = db.relationship('Appointment', backref='patient', lazy=True)

class Medication(db.Model):
    __tablename__ = 'medications'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    dosage = db.Column(db.String(50))
    frequency = db.Column(db.String(50))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    instructions = db.Column(db.Text)
    side_effects = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VitalSigns(db.Model):
    __tablename__ = 'vital_signs'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    blood_pressure_systolic = db.Column(db.Integer)
    blood_pressure_diastolic = db.Column(db.Integer)
    heart_rate = db.Column(db.Integer)
    temperature = db.Column(db.Numeric(4, 1))
    oxygen_saturation = db.Column(db.Integer)
    weight = db.Column(db.Numeric(5, 2))
    height = db.Column(db.Numeric(5, 2))
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    doctor_name = db.Column(db.String(100), nullable=False)
    specialty = db.Column(db.String(50))
    appointment_date = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer, default=30)  # in minutes
    location = db.Column(db.String(200))
    notes = db.Column(db.Text)
    status = db.Column(db.String(20), default='scheduled')  # scheduled, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class EmergencyContact(db.Model):
    __tablename__ = 'emergency_contacts'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    relationship = db.Column(db.String(50))
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120))
    is_primary = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class MedicationReminder(db.Model):
    __tablename__ = 'medication_reminders'
    
    id = db.Column(db.Integer, primary_key=True)
    medication_id = db.Column(db.Integer, db.ForeignKey('medications.id'), nullable=False)
    reminder_time = db.Column(db.Time, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    last_taken = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class HealthGoal(db.Model):
    __tablename__ = 'health_goals'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    goal_type = db.Column(db.String(50), nullable=False)  # weight_loss, exercise, medication_adherence
    target_value = db.Column(db.String(50))
    current_value = db.Column(db.String(50))
    target_date = db.Column(db.Date)
    is_achieved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
