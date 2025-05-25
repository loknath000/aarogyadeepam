import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

class NotificationService:
    def __init__(self):
        # Email configuration
        self.email_host = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
        self.email_port = int(os.environ.get('EMAIL_PORT', 587))
        self.email_username = os.environ.get('EMAIL_USERNAME')
        self.email_password = os.environ.get('EMAIL_PASSWORD')
        
        # SMS configuration
        self.sms_api_key = os.environ.get('SMS_API_KEY')
        
        if not all([self.email_username, self.email_password]):
            print("Warning: Email configuration incomplete. Email notifications will be disabled.")
        
        if not self.sms_api_key:
            print("Warning: SMS_API_KEY not set. SMS notifications will be disabled.")
    
    def send_email(self, to_email, subject, body, is_html=False):
        """Send email notification"""
        try:
            if not all([self.email_username, self.email_password]):
                return {'error': 'Email configuration incomplete'}
            
            msg = MIMEMultipart()
            msg['From'] = self.email_username
            msg['To'] = to_email
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'html' if is_html else 'plain'))
            
            server = smtplib.SMTP(self.email_host, self.email_port)
            server.starttls()
            server.login(self.email_username, self.email_password)
            server.send_message(msg)
            server.quit()
            
            return {'status': 'success'}
            
        except Exception as e:
            return {'error': str(e)}
    
    def send_sms(self, phone_number, message):
        """Send SMS notification"""
        try:
            if not self.sms_api_key:
                return {'error': 'SMS configuration incomplete'}
            
            # Implement SMS sending logic here
            # This is a placeholder for actual SMS API integration
            print(f"SMS to {phone_number}: {message}")
            
            return {'status': 'success'}
            
        except Exception as e:
            return {'error': str(e)}
    
    def send_health_alert(self, patient_id, analysis):
        """Send health alert based on vital signs analysis"""
        try:
            from backend.models.models import Patient, User
            
            patient = Patient.query.get(patient_id)
            if not patient:
                return {'error': 'Patient not found'}
            
            user = User.query.get(patient.user_id)
            if not user:
                return {'error': 'User not found'}
            
            # Prepare alert message
            subject = "Health Alert - Action Required"
            message = f"""
            Dear {user.first_name},
            
            We've detected some concerning health indicators that require your attention:
            
            {chr(10).join(analysis.get('alerts', []))}
            
            Recommendations:
            {chr(10).join(analysis.get('recommendations', []))}
            
            Please consult with your healthcare provider if concerns persist.
            
            Best regards,
            AarogyaDeepa Health Team
            """
            
            # Send notifications
            email_status = self.send_email(user.email, subject, message)
            sms_status = self.send_sms(user.phone, f"Health Alert: {analysis['alerts'][0] if analysis.get('alerts') else 'Check your health indicators'}")
            
            return {
                'email_status': email_status,
                'sms_status': sms_status
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def send_medication_reminder(self, reminder_id):
        """Send medication reminder notification"""
        try:
            from backend.models.models import MedicationReminder, Medication, Patient, User
            
            reminder = MedicationReminder.query.get(reminder_id)
            if not reminder:
                return {'error': 'Reminder not found'}
            
            medication = Medication.query.get(reminder.medication_id)
            if not medication:
                return {'error': 'Medication not found'}
            
            patient = Patient.query.get(medication.patient_id)
            if not patient:
                return {'error': 'Patient not found'}
            
            user = User.query.get(patient.user_id)
            if not user:
                return {'error': 'User not found'}
            
            # Prepare reminder message
            subject = "Medication Reminder"
            message = f"""
            Dear {user.first_name},
            
            This is a reminder to take your medication:
            
            Medication: {medication.name}
            Dosage: {medication.dosage}
            Time: {reminder.reminder_time.strftime('%I:%M %p')}
            
            Instructions: {medication.instructions}
            
            Best regards,
            AarogyaDeepa Health Team
            """
            
            # Send notifications
            email_status = self.send_email(user.email, subject, message)
            sms_status = self.send_sms(user.phone, f"Medication Reminder: Time to take {medication.name} ({medication.dosage})")
            
            return {
                'email_status': email_status,
                'sms_status': sms_status
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def send_appointment_reminder(self, appointment_id):
        """Send appointment reminder notification"""
        try:
            from backend.models.models import Appointment, Patient, User
            
            appointment = Appointment.query.get(appointment_id)
            if not appointment:
                return {'error': 'Appointment not found'}
            
            patient = Patient.query.get(appointment.patient_id)
            if not patient:
                return {'error': 'Patient not found'}
            
            user = User.query.get(patient.user_id)
            if not user:
                return {'error': 'User not found'}
            
            # Prepare reminder message
            subject = "Upcoming Appointment Reminder"
            message = f"""
            Dear {user.first_name},
            
            This is a reminder about your upcoming appointment:
            
            Doctor: {appointment.doctor_name}
            Specialty: {appointment.specialty}
            Date: {appointment.appointment_date.strftime('%B %d, %Y')}
            Time: {appointment.appointment_date.strftime('%I:%M %p')}
            Location: {appointment.location}
            
            Notes: {appointment.notes}
            
            Please arrive 15 minutes early for registration.
            
            Best regards,
            AarogyaDeepa Health Team
            """
            
            # Send notifications
            email_status = self.send_email(user.email, subject, message)
            sms_status = self.send_sms(user.phone, 
                f"Appointment Reminder: {appointment.doctor_name} on {appointment.appointment_date.strftime('%B %d')} at {appointment.appointment_date.strftime('%I:%M %p')}")
            
            return {
                'email_status': email_status,
                'sms_status': sms_status
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def send_emergency_alert(self, patient, alert_type, location=None):
        """Send emergency alert to contacts"""
        try:
            from backend.models.models import EmergencyContact, User
            
            # Get emergency contacts
            contacts = EmergencyContact.query.filter_by(patient_id=patient.id).all()
            if not contacts:
                return {'error': 'No emergency contacts found'}
            
            user = User.query.get(patient.user_id)
            if not user:
                return {'error': 'User not found'}
            
            # Prepare emergency message
            subject = "EMERGENCY ALERT"
            message = f"""
            EMERGENCY ALERT
            
            Patient: {patient.first_name} {patient.last_name}
            Type: {alert_type}
            Time: {datetime.now().strftime('%I:%M %p, %B %d, %Y')}
            {"Location: " + location if location else ""}
            
            Please take immediate action.
            
            Contact Information:
            Phone: {user.phone}
            Email: {user.email}
            
            This is an automated emergency alert from AarogyaDeepa Health System.
            """
            
            # Send notifications to all emergency contacts
            notifications = []
            for contact in contacts:
                email_status = self.send_email(contact.email, subject, message) if contact.email else None
                sms_status = self.send_sms(contact.phone, 
                    f"EMERGENCY: {patient.first_name} {patient.last_name} needs immediate assistance. Type: {alert_type}")
                
                notifications.append({
                    'contact': contact.name,
                    'email_status': email_status,
                    'sms_status': sms_status
                })
            
            return {
                'status': 'success',
                'notifications': notifications
            }
            
        except Exception as e:
            return {'error': str(e)} 