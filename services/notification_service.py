import smtplib
import requests
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from models import EmergencyContact, Patient
from datetime import datetime

class NotificationService:
    def __init__(self):
        self.smtp_server = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('MAIL_PORT', 587))
        self.email_user = os.environ.get('MAIL_USERNAME')
        self.email_password = os.environ.get('MAIL_PASSWORD')
        self.sms_api_key = os.environ.get('SMS_API_KEY')
        
        if not all([self.email_user, self.email_password]):
            print("Warning: Email configuration incomplete. Email notifications will be disabled.")
        if not self.sms_api_key:
            print("Warning: SMS_API_KEY not set. SMS notifications will be disabled.")

    def send_health_alert(self, patient_id, analysis):
        """Send health alert notifications"""
        try:
            patient = Patient.query.get(patient_id)
            if not patient:
                print(f"Error: Patient {patient_id} not found")
                return False
            
            # Get emergency contacts
            contacts = EmergencyContact.query.filter_by(patient_id=patient_id).all()
            
            alert_message = f"""
            Health Alert for {patient.first_name} {patient.last_name}
            
            Alerts: {', '.join(analysis.get('alerts', []))}
            Recommendations: {', '.join(analysis.get('recommendations', []))}
            
            Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            
            Please check on the patient and consult healthcare provider if necessary.
            """
            
            # Send notifications to emergency contacts
            notification_sent = False
            for contact in contacts:
                if contact.email and self.email_user and self.email_password:
                    if self.send_email(contact.email, "Health Alert", alert_message):
                        notification_sent = True
                if contact.phone and self.sms_api_key:
                    if self.send_sms(contact.phone, alert_message[:160]):  # SMS limit
                        notification_sent = True
            
            return notification_sent
            
        except Exception as e:
            print(f"Health Alert Error: {str(e)}")
            return False
    
    def send_emergency_alert(self, patient, alert_type, location=None):
        """Send emergency alert notifications"""
        try:
            emergency_message = f"""
            EMERGENCY ALERT
            
            Patient: {patient.first_name} {patient.last_name}
            Alert Type: {alert_type}
            Location: {location or 'Unknown'}
            Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            
            IMMEDIATE ATTENTION REQUIRED
            """
            
            # Get emergency contacts
            contacts = EmergencyContact.query.filter_by(patient_id=patient.id).all()
            
            # Send to all emergency contacts
            for contact in contacts:
                if contact.email:
                    self.send_email(contact.email, "EMERGENCY ALERT", emergency_message)
                if contact.phone:
                    self.send_sms(contact.phone, emergency_message[:160])
            
            # Also send to emergency services if configured
            if alert_type in ['fall_detected', 'heart_emergency']:
                self.notify_emergency_services(patient, alert_type, location)
            
            return True
            
        except Exception as e:
            print(f"Emergency Alert Error: {str(e)}")
            return False
    
    def send_email(self, to_email, subject, message):
        """Send email notification"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email_user
            msg['To'] = to_email
            msg['Subject'] = subject
            
            msg.attach(MIMEText(message, 'plain'))
            
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email_user, self.email_password)
            text = msg.as_string()
            server.sendmail(self.email_user, to_email, text)
            server.quit()
            
            return True
            
        except Exception as e:
            print(f"Email Error: {str(e)}")
            return False
    
    def send_sms(self, phone_number, message):
        """Send SMS notification"""
        try:
            # Using a generic SMS API (replace with your preferred provider)
            payload = {
                'to': phone_number,
                'message': message,
                'api_key': self.sms_api_key
            }
            
            response = requests.post(
                'https://api.sms-provider.com/send',
                json=payload
            )
            
            return response.status_code == 200
            
        except Exception as e:
            print(f"SMS Error: {str(e)}")
            return False
    
    def notify_emergency_services(self, patient, alert_type, location):
        """Notify emergency services for critical alerts"""
        try:
            # This would integrate with local emergency services API
            # For demo purposes, just logging
            print(f"Emergency Services Notified: {patient.first_name} {patient.last_name}, {alert_type}, {location}")
            return True
            
        except Exception as e:
            print(f"Emergency Services Error: {str(e)}")
            return False
    
    def send_medication_reminder(self, patient_id, medication_name):
        """Send medication reminder"""
        try:
            patient = Patient.query.get(patient_id)
            if not patient:
                return False
            
            message = f"Reminder: Time to take your {medication_name}"
            
            # Send to patient's phone if available
            if patient.user.phone:
                self.send_sms(patient.user.phone, message)
            
            return True
            
        except Exception as e:
            print(f"Medication Reminder Error: {str(e)}")
            return False
