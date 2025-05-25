"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageCircle, Bell, Calendar, Heart, Activity, Phone, Video } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function FamilyPortal() {
  const { t } = useLanguage()

  const familyMembers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: t("primary_physician"),
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastContact: "2 hours ago",
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: t("daughter"),
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastContact: "30 minutes ago",
    },
    {
      id: 3,
      name: "Raj Sharma",
      role: t("son"),
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastContact: "1 day ago",
    },
    {
      id: 4,
      name: "Nurse Maya",
      role: t("care_coordinator"),
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastContact: "1 hour ago",
    },
  ]

  const recentUpdates = [
    {
      type: "medication",
      message: t("medication_taken_on_time"),
      time: "10:30 AM",
      icon: Heart,
      color: "text-green-500",
    },
    {
      type: "vitals",
      message: t("blood_pressure_recorded"),
      time: "9:15 AM",
      icon: Activity,
      color: "text-blue-500",
    },
    {
      type: "appointment",
      message: t("appointment_scheduled"),
      time: "Yesterday",
      icon: Calendar,
      color: "text-purple-500",
    },
  ]

  const emergencyContacts = [
    { name: t("emergency_services"), number: "911", type: "emergency" },
    { name: t("family_doctor"), number: "+1-555-0123", type: "doctor" },
    { name: t("hospital_main"), number: "+1-555-0456", type: "hospital" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {t("family_portal")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("coordinate_care_with_family")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            {t("notifications")}
          </Button>
          <Button>
            <Video className="w-4 h-4 mr-2" />
            {t("family_meeting")}
          </Button>
        </div>
      </div>

      {/* Care Team */}
      <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t("care_team")}
          </CardTitle>
          <CardDescription>{t("family_and_healthcare_providers")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg border border-white/20 dark:border-gray-700/20"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        member.status === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("last_active")}: {member.lastContact}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Updates */}
      <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
        <CardHeader>
          <CardTitle>{t("recent_updates")}</CardTitle>
          <CardDescription>{t("latest_health_activities")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUpdates.map((update, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 dark:bg-gray-800/5">
                <div className={`p-2 rounded-lg bg-white/10 ${update.color}`}>
                  <update.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{update.message}</p>
                  <p className="text-xs text-muted-foreground">{update.time}</p>
                </div>
                <Badge variant="secondary">{t(update.type)}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Phone className="w-5 h-5" />
            {t("emergency_contacts")}
          </CardTitle>
          <CardDescription>{t("quick_access_emergency_numbers")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emergencyContacts.map((contact, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:bg-red-500/10 border-red-200 dark:border-red-800"
              >
                <Phone className="w-5 h-5 text-red-500" />
                <div className="text-center">
                  <div className="text-sm font-medium">{contact.name}</div>
                  <div className="text-xs text-muted-foreground">{contact.number}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
