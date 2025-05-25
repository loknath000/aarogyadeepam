"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Clock, Bell, Plus } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function MedicationReminders() {
  const { t } = useLanguage()

  const reminders = [
    {
      id: 1,
      medication: "Metformin",
      times: ["8:00 AM", "8:00 PM"],
      enabled: true,
      nextDue: "8:00 PM",
    },
    {
      id: 2,
      medication: "Lisinopril",
      times: ["8:00 AM"],
      enabled: true,
      nextDue: "Tomorrow 8:00 AM",
    },
    {
      id: 3,
      medication: "Vitamin D3",
      times: ["9:00 AM"],
      enabled: false,
      nextDue: "Disabled",
    },
  ]

  return (
    <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {t("medication_reminders")}
            </CardTitle>
            <CardDescription>{t("never_miss_a_dose")}</CardDescription>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {t("add_reminder")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between p-4 rounded-lg border border-white/20 dark:border-gray-700/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{reminder.medication}</h3>
                  <div className="flex gap-2 mt-1">
                    {reminder.times.map((time, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("next_due")}: {reminder.nextDue}
                  </p>
                </div>
              </div>
              <Switch checked={reminder.enabled} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
