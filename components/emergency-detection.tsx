"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Phone, X } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function EmergencyDetection() {
  const { t } = useLanguage()
  const [emergencyDetected, setEmergencyDetected] = useState(false)
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    // Simulate emergency detection (in real app, this would use device sensors)
    const timer = setTimeout(() => {
      // Uncomment to test emergency detection
      // setEmergencyDetected(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (emergencyDetected && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (emergencyDetected && countdown === 0) {
      // Auto-call emergency services
      console.log("Calling emergency services...")
    }
  }, [emergencyDetected, countdown])

  if (!emergencyDetected) return null

  return (
    <div className="fixed inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-red-500/90 border-red-600 text-white">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold mb-2">{t("emergency_detected")}</h2>
          <p className="mb-4">{t("fall_detected_message")}</p>

          <div className="text-4xl font-bold mb-4">{countdown}</div>
          <p className="text-sm mb-6">{t("calling_emergency_in_seconds")}</p>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setEmergencyDetected(false)}>
              <X className="w-4 h-4 mr-2" />
              {t("cancel")}
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-white text-red-600 hover:bg-gray-100"
              onClick={() => {
                setEmergencyDetected(false)
                // Call emergency services immediately
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              {t("call_now")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
