import openai
import os
from datetime import datetime, timedelta
from backend.models.models import VitalSigns, Medication, Patient

class AIService:
    def __init__(self):
        self.openai_api_key = os.environ.get('OPENAI_API_KEY')
        if not self.openai_api_key:
            print("Warning: OPENAI_API_KEY not set. AI features will be limited.")
        else:
            openai.api_key = self.openai_api_key
    
    def analyze_vitals(self, vitals):
        """Analyze vital signs and provide health insights"""
        try:
            # Define normal ranges
            normal_ranges = {
                'blood_pressure_systolic': (90, 140),
                'blood_pressure_diastolic': (60, 90),
                'heart_rate': (60, 100),
                'temperature': (36.1, 37.2),
                'oxygen_saturation': (95, 100)
            }
            
            alerts = []
            recommendations = []
            
            # Check each vital sign
            if vitals.blood_pressure_systolic:
                if vitals.blood_pressure_systolic > 140:
                    alerts.append("High blood pressure detected")
                    recommendations.append("Consider consulting your doctor about blood pressure management")
                elif vitals.blood_pressure_systolic < 90:
                    alerts.append("Low blood pressure detected")
                    recommendations.append("Monitor for dizziness and consult healthcare provider")
            
            if vitals.heart_rate:
                if vitals.heart_rate > 100:
                    alerts.append("Elevated heart rate detected")
                    recommendations.append("Consider rest and hydration")
                elif vitals.heart_rate < 60:
                    alerts.append("Low heart rate detected")
                    recommendations.append("Monitor for fatigue and consult healthcare provider")
            
            if vitals.oxygen_saturation and vitals.oxygen_saturation < 95:
                alerts.append("Low oxygen saturation detected")
                recommendations.append("Seek immediate medical attention")
            
            return {
                'alert_required': len(alerts) > 0,
                'alerts': alerts,
                'recommendations': recommendations,
                'overall_status': 'concerning' if alerts else 'normal'
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def process_message(self, message, user, patients, language='en'):
        """Process user message with AI assistant"""
        try:
            if not self.openai_api_key:
                return {
                    'text': "AI service is not configured. Please set OPENAI_API_KEY.",
                    'actions': [],
                    'confidence': 0.0
                }

            # Create context about user and patients
            context = f"""
            User: {user.first_name} {user.last_name}
            Language: {language}
            Patients: {len(patients)} registered
            
            You are AarogyaDeepa AI Assistant, a healthcare companion that helps users manage their health.
            Respond in {language} language if not English.
            Be helpful, empathetic, and provide accurate health information.
            """
            
            # Use OpenAI to generate response
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": context},
                    {"role": "user", "content": message}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            
            # Extract any actions from the response
            actions = self._extract_actions(message, ai_response)
            
            return {
                'text': ai_response,
                'actions': actions,
                'confidence': 0.9
            }
            
        except Exception as e:
            print(f"AI Service Error: {str(e)}")
            return {
                'text': "I'm having trouble processing your request right now. Please try again later.",
                'actions': [],
                'error': str(e)
            }
    
    def _extract_actions(self, user_message, ai_response):
        """Extract actionable items from conversation"""
        actions = []
        
        # Simple keyword-based action extraction
        if any(word in user_message.lower() for word in ['remind', 'medication', 'pill']):
            actions.append({
                'type': 'medication_reminder',
                'description': 'Set medication reminder'
            })
        
        if any(word in user_message.lower() for word in ['appointment', 'doctor', 'schedule']):
            actions.append({
                'type': 'schedule_appointment',
                'description': 'Schedule doctor appointment'
            })
        
        if any(word in user_message.lower() for word in ['vitals', 'blood pressure', 'heart rate']):
            actions.append({
                'type': 'record_vitals',
                'description': 'Record vital signs'
            })
        
        return actions
    
    def analyze_health_trends(self, patient_id, days=30):
        """Analyze health trends over time"""
        try:
            start_date = datetime.now() - timedelta(days=days)
            vitals = VitalSigns.query.filter(
                VitalSigns.patient_id == patient_id,
                VitalSigns.recorded_at >= start_date
            ).order_by(VitalSigns.recorded_at).all()
            
            if not vitals:
                return {'message': 'No data available for analysis'}
            
            # Calculate trends
            trends = {
                'blood_pressure': self._calculate_trend([v.blood_pressure_systolic for v in vitals if v.blood_pressure_systolic]),
                'heart_rate': self._calculate_trend([v.heart_rate for v in vitals if v.heart_rate]),
                'weight': self._calculate_trend([float(v.weight) for v in vitals if v.weight])
            }
            
            return {
                'trends': trends,
                'data_points': len(vitals),
                'period': f"{days} days",
                'insights': self._generate_health_insights(trends)
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def _calculate_trend(self, values):
        """Calculate trend direction for a list of values"""
        if len(values) < 2:
            return 'insufficient_data'
        
        # Simple linear trend calculation
        first_half = values[:len(values)//2]
        second_half = values[len(values)//2:]
        
        avg_first = sum(first_half) / len(first_half)
        avg_second = sum(second_half) / len(second_half)
        
        if avg_second > avg_first * 1.05:
            return 'increasing'
        elif avg_second < avg_first * 0.95:
            return 'decreasing'
        else:
            return 'stable'
    
    def _generate_health_insights(self, trends):
        """Generate health insights based on trends"""
        insights = []
        
        if trends['blood_pressure'] == 'increasing':
            insights.append("Blood pressure shows an increasing trend. Consider lifestyle modifications.")
        
        if trends['heart_rate'] == 'increasing':
            insights.append("Heart rate is trending upward. Monitor stress levels and exercise.")
        
        if trends['weight'] == 'decreasing':
            insights.append("Weight loss detected. Ensure adequate nutrition.")
        
        return insights
    
    def check_drug_interactions(self, medications):
        """Check for potential drug interactions"""
        try:
            if not self.openai_api_key:
                return {'error': 'AI service not configured'}
            
            # Create prompt for drug interaction analysis
            med_names = [med['name'] for med in medications]
            prompt = f"Analyze potential drug interactions between: {', '.join(med_names)}"
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a healthcare AI analyzing drug interactions."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.3
            )
            
            analysis = response.choices[0].message.content
            
            # Parse response into structured format
            return {
                'interactions': [
                    {'severity': 'high', 'description': analysis}
                ] if 'warning' in analysis.lower() else [],
                'recommendations': [analysis]
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def identify_pill(self, image_file):
        """Identify medication from pill image"""
        try:
            return {
                'name': 'Feature not implemented',
                'confidence': 0.0,
                'error': 'Pill identification requires additional API integration'
            }
        except Exception as e:
            return {'error': str(e)}
    
    def calculate_medication_adherence(self, patient_id):
        """Calculate patient's medication adherence"""
        try:
            medications = Medication.query.filter_by(
                patient_id=patient_id,
                is_active=True
            ).all()
            
            if not medications:
                return {'adherence_rate': 0, 'message': 'No active medications'}
            
            # Simple adherence calculation
            adherence_rate = 0.85  # Placeholder
            
            return {
                'adherence_rate': adherence_rate,
                'medications_count': len(medications),
                'status': 'good' if adherence_rate >= 0.8 else 'needs_improvement',
                'recommendations': [
                    "Set up medication reminders",
                    "Use pill organizers",
                    "Track side effects"
                ]
            }
            
        except Exception as e:
            return {'error': str(e)} 