# AarogyaDeepa - Your Healthcare Companion

AarogyaDeepa is a comprehensive healthcare management system that helps users track their medications, monitor recovery progress, and get instant health guidance through an AI-powered nurse assistant.

## Features

- **AI Nurse Assistant**: Get instant health guidance and answers to medical queries
- **Medication Management**: Track medications, set reminders, and manage prescriptions
- **Recovery Tracking**: Monitor recovery progress with detailed analytics and symptom logging
- **User Dashboard**: Comprehensive overview of health metrics and activities
- **Appointment Management**: Schedule and manage medical appointments
- **Health Records**: Secure storage and access to medical records

## Tech Stack

- **Backend**: Flask (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **Responsive Design**: Mobile-first approach

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/arogyadeepa.git
   cd arogyadeepa
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the database:
   ```bash
   python
   >>> from app import app, db
   >>> with app.app_context():
   ...     db.create_all()
   >>> exit()
   ```

5. Run the application:
   ```bash
   python app.py
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Project Structure

```
arogyadeepa/
├── app.py                 # Main application file
├── requirements.txt       # Python dependencies
├── README.md             # Documentation
├── static/               # Static files (CSS, JS, images)
└── templates/            # HTML templates
    ├── index.html        # Homepage
    ├── dashboard.html    # User dashboard
    ├── ai_nurse.html     # AI Nurse interface
    ├── medication_assist.html  # Medication management
    └── recovery_tracking.html  # Recovery tracking
```

## Usage

1. **Registration/Login**:
   - Create a new account or login with existing credentials
   - All features require authentication

2. **AI Nurse**:
   - Access the AI Nurse through the dashboard or navigation menu
   - Type your health-related questions
   - Get instant guidance and recommendations

3. **Medication Management**:
   - Add new medications with dosage and schedule
   - Set up reminders
   - Track medication adherence

4. **Recovery Tracking**:
   - Log daily symptoms and pain levels
   - Track recovery progress through charts
   - Maintain a health journal

## Security Features

- Secure password hashing using Werkzeug
- Session-based authentication
- CSRF protection
- SQL injection prevention through SQLAlchemy
- Secure database configuration

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@arogyadeepa.com or open an issue in the GitHub repository. #
