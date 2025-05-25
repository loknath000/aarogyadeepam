"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Activity, Thermometer, Droplets, Brain, TrendingUp, Calendar } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { VitalsChart } from "@/components/vitals-chart"
import { MoodTracker } from "@/components/mood-tracker"
import { UpcomingAppointments } from "@/components/upcoming-appointments"

export function Dashboard() {
  const { t } = useLanguage()

  const vitals = [
    {
      icon: Heart,
      label: t("heart_rate"),
      value: "72",
      unit: "bpm",
      status: "normal",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Activity,
      label: t("blood_pressure"),
      value: "120/80",
      unit: "mmHg",
      status: "normal",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Thermometer,
      label: t("temperature"),
      value: "98.6",
      unit: "°F",
      status: "normal",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Droplets,
      label: t("oxygen_saturation"),
      value: "98",
      unit: "%",
      status: "normal",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ]

  const healthGoals = [
    { name: t("daily_steps"), current: 8500, target: 10000, unit: "steps" },
    { name: t("water_intake"), current: 6, target: 8, unit: "glasses" },
    { name: t("sleep_hours"), current: 7.5, target: 8, unit: "hours" },
    { name: t("meditation"), current: 15, target: 20, unit: "minutes" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {t("welcome_back")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("dashboard_subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            {t("schedule_appointment")}
          </Button>
          <Button size="sm">
            <Brain className="w-4 h-4 mr-2" />
            {t("ai_consultation")}
          </Button>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map((vital, index) => (
          <Card
            key={index}
            className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${vital.bgColor}`}>
                  <vital.icon className={`w-6 h-6 ${vital.color}`} />
                </div>
                <Badge variant={vital.status === "normal" ? "default" : "destructive"}>{t(vital.status)}</Badge>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{vital.value}</span>
                  <span className="text-sm text-muted-foreground">{vital.unit}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{vital.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t("health_trends")}
            </CardTitle>
            <CardDescription>{t("last_30_days")}</CardDescription>
          </CardHeader>
          <CardContent>
            <VitalsChart />
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              {t("mood_wellness")}
            </CardTitle>
            <CardDescription>{t("emotional_health_tracking")}</CardDescription>
          </CardHeader>
          <CardContent>
            <MoodTracker />
          </CardContent>
        </Card>
      </div>

      {/* Health Goals */}
      <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
        <CardHeader>
          <CardTitle>{t("daily_goals")}</CardTitle>
          <CardDescription>{t("track_your_progress")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthGoals.map((goal, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{goal.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {Math.round((goal.current / goal.target) * 100)}% {t("completed")}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <UpcomingAppointments />
    </div>
  )
}
