"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    medication: "Medication",
    therapy: "Therapy",
    navigation: "Navigation",
    family: "Family",

    // Common
    welcome_back: "Welcome back",
    dashboard_subtitle: "Your health overview at a glance",
    tagline: "Your Health Companion",
    main_menu: "Main Menu",
    quick_actions: "Quick Actions",
    version: "Version",

    // Vitals
    heart_rate: "Heart Rate",
    blood_pressure: "Blood Pressure",
    temperature: "Temperature",
    oxygen_saturation: "Oxygen Saturation",
    normal: "Normal",

    // Health Goals
    daily_steps: "Daily Steps",
    water_intake: "Water Intake",
    sleep_hours: "Sleep Hours",
    meditation: "Meditation",
    completed: "Completed",

    // Appointments
    schedule_appointment: "Schedule Appointment",
    ai_consultation: "AI Consultation",
    upcoming_appointments: "Upcoming Appointments",
    your_scheduled_visits: "Your scheduled visits",
    cardiology_checkup: "Cardiology Checkup",
    therapy_session: "Therapy Session",
    lab_results_review: "Lab Results Review",

    // Medication
    medication_manager: "Medication Manager",
    manage_medications_safely: "Manage your medications safely",
    scan_pill: "Scan Pill",
    add_medication: "Add Medication",
    active_medications: "Active Medications",
    due_today: "Due Today",
    low_stock: "Low Stock",
    interactions: "Interactions",

    // AI Assistant
    ai_assistant: "AI Assistant",
    ai_greeting: "Hello! I'm your AI health assistant. How can I help you today?",
    online: "Online",
    send_message: "Send Message",

    // Emergency
    emergency_detected: "Emergency Detected",
    fall_detected_message: "A fall has been detected. Emergency services will be called automatically.",
    calling_emergency_in_seconds: "Calling emergency services in seconds...",
    cancel: "Cancel",
    call_now: "Call Now",

    // Search
    search_placeholder: "Search health records, medications...",

    // Profile
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",

    // Therapy
    therapy_portal: "Therapy Portal",
    ai_guided_rehabilitation: "AI-guided rehabilitation exercises",

    // Navigation
    ar_navigation: "AR Navigation",
    indoor_wayfinding_system: "Indoor wayfinding system",

    // Family
    family_portal: "Family Portal",
    coordinate_care_with_family: "Coordinate care with your family",
  },

  hi: {
    // Navigation
    dashboard: "डैशबोर्ड",
    medication: "दवाई",
    therapy: "चिकित्सा",
    navigation: "नेवीगेशन",
    family: "परिवार",

    // Common
    welcome_back: "वापसी पर स्वागत",
    dashboard_subtitle: "आपके स्वास्थ्य का एक नज़र में अवलोकन",
    tagline: "आपका स्वास्थ्य साथी",
    main_menu: "मुख्य मेनू",
    quick_actions: "त्वरित कार्य",
    version: "संस्करण",

    // Vitals
    heart_rate: "हृदय गति",
    blood_pressure: "रक्तचाप",
    temperature: "तापमान",
    oxygen_saturation: "ऑक्सीजन संतृप्ति",
    normal: "सामान्य",

    // Health Goals
    daily_steps: "दैनिक कदम",
    water_intake: "पानी का सेवन",
    sleep_hours: "नींद के घंटे",
    meditation: "ध्यान",
    completed: "पूर्ण",

    // Medication
    medication_manager: "दवा प्रबंधक",
    manage_medications_safely: "अपनी दवाओं को सुरक्षित रूप से प्रबंधित करें",
    scan_pill: "गोली स्कैन करें",
    add_medication: "दवा जोड़ें",

    // AI Assistant
    ai_assistant: "AI सहायक",
    ai_greeting: "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
    online: "ऑनलाइन",

    // Emergency
    emergency_detected: "आपातकाल का पता चला",
    fall_detected_message: "गिरने का पता चला है। आपातकालीन सेवाओं को स्वचालित रूप से कॉल किया जाएगा।",
    cancel: "रद्द करें",
    call_now: "अभी कॉल करें",
  },

  kn: {
    // Navigation
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    medication: "ಔಷಧಿ",
    therapy: "ಚಿಕಿತ್ಸೆ",
    navigation: "ನ್ಯಾವಿಗೇಶನ್",
    family: "ಕುಟುಂಬ",

    // Common
    welcome_back: "ಮರಳಿ ಸ್ವಾಗತ",
    dashboard_subtitle: "ನಿಮ್ಮ ಆರೋಗ್ಯದ ಒಂದು ನೋಟದಲ್ಲಿ ಅವಲೋಕನ",
    tagline: "ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಹಚರ",
    main_menu: "ಮುಖ್ಯ ಮೆನು",
    quick_actions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    version: "ಆವೃತ್ತಿ",

    // Vitals
    heart_rate: "ಹೃದಯ ಬಡಿತ",
    blood_pressure: "ರಕ್ತದೊತ್ತಡ",
    temperature: "ತಾಪಮಾನ",
    oxygen_saturation: "ಆಮ್ಲಜನಕ ಸಂತೃಪ್ತಿ",
    normal: "ಸಾಮಾನ್ಯ",

    // AI Assistant
    ai_assistant: "AI ಸಹಾಯಕ",
    ai_greeting: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಆರೋಗ್ಯ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    online: "ಆನ್‌ಲೈನ್",
  },

  te: {
    // Navigation
    dashboard: "డాష్‌బోర్డ్",
    medication: "మందులు",
    therapy: "చికిత్స",
    navigation: "నావిగేషన్",
    family: "కుటుంబం",

    // Common
    welcome_back: "తిరిగి స్వాగతం",
    dashboard_subtitle: "మీ ఆరోగ్యం ఒక చూపులో",
    tagline: "మీ ఆరోగ్య సహచరుడు",
    main_menu: "ప్రధాన మెను",
    quick_actions: "త్వరిత చర్యలు",
    version: "వెర్షన్",

    // AI Assistant
    ai_assistant: "AI సహాయకుడు",
    ai_greeting: "నమస్కారం! నేను మీ AI ఆరోగ్య సహాయకుడను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
    online: "ఆన్‌లైన్",
  },

  ta: {
    // Navigation
    dashboard: "டாஷ்போர்டு",
    medication: "மருந்து",
    therapy: "சிகிச்சை",
    navigation: "வழிசெலுத்தல்",
    family: "குடும்பம்",

    // Common
    welcome_back: "மீண்டும் வரவேற்கிறோம்",
    dashboard_subtitle: "உங்கள் ஆரோக்கியத்தின் ஒரு பார்வையில் கண்ணோட்டம்",
    tagline: "உங்கள் ஆரோக்கிய துணை",
    main_menu: "முதன்மை மெனு",
    quick_actions: "விரைவு செயல்கள்",
    version: "பதிப்பு",

    // AI Assistant
    ai_assistant: "AI உதவியாளர்",
    ai_greeting: "வணக்கம்! நான் உங்கள் AI ஆரோக்கிய உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    online: "ஆன்லைன்",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    // Auto-detect browser language
    const browserLang = navigator.language.split("-")[0]
    if (translations[browserLang as keyof typeof translations]) {
      setLanguage(browserLang)
    }
  }, [])

  const t = (key: string): string => {
    const translation = translations[language as keyof typeof translations]
    return translation?.[key as keyof typeof translation] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
