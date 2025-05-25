"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Video } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function UpcomingAppointments() {
  const { t } = useLanguage()

  const appointments = [
    {
      id: 1,
      title: t("cardiology_checkup"),
      doctor: "Dr. Sarah Johnson",
      date: "Tomorrow",
      time: "10:30 AM",
      type: "in-person",
      location: "Room 205, Cardiology Wing",
    },
    {
      id: 2,
      title: t("therapy_session"),
      doctor: "Dr. Mike Chen",
      date: "Friday",
      time: "2:00 PM",
      type: "virtual",
      location: "Video Call",
    },
    {
      id: 3,
      title: t("lab_results_review"),
      doctor: "Dr. Sarah Johnson",
      date: "Next Monday",
      time: "9:00 AM",
      type: "in-person",
      location: "Room 205, Cardiology Wing",
    },
  ]

  return (
    <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {t("upcoming_appointments")}
        </CardTitle>
        <CardDescription>{t("your_scheduled_visits")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 rounded-lg border border-white/20 dark:border-gray-700/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  {appointment.type === "virtual" ? (
                    <Video className="w-6 h-6 text-white" />
                  ) : (
                    <Calendar className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{appointment.title}</h3>
                  <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {appointment.date} at {appointment.time}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {appointment.location}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={appointment.type === "virtual" ? "default" : "secondary"}>{t(appointment.type)}</Badge>
                <Button size="sm">{appointment.type === "virtual" ? t("join_call") : t("view_details")}</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
