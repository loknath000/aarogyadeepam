"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pill, Clock, AlertTriangle, Plus, Search, Scan } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { PillScanner } from "@/components/pill-scanner"
import { MedicationReminders } from "@/components/medication-reminders"
import { DrugInteractionChecker } from "@/components/drug-interaction-checker"

export function MedicationManager() {
  const { t } = useLanguage()
  const [showScanner, setShowScanner] = useState(false)

  const medications = [
    {
      id: 1,
      name: "Metformin",
      dosage: "500mg",
      frequency: t("twice_daily"),
      nextDose: "2:00 PM",
      remaining: 28,
      status: "active",
      interactions: 0,
    },
    {
      id: 2,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: t("once_daily"),
      nextDose: "8:00 AM",
      remaining: 15,
      status: "low",
      interactions: 1,
    },
    {
      id: 3,
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: t("once_daily"),
      nextDose: "9:00 AM",
      remaining: 45,
      status: "active",
      interactions: 0,
    },
  ]

  const upcomingDoses = [
    { medication: "Metformin", time: "2:00 PM", dosage: "500mg" },
    { medication: "Vitamin D3", time: "9:00 AM", dosage: "1000 IU" },
    { medication: "Lisinopril", time: "8:00 AM", dosage: "10mg" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {t("medication_manager")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("manage_medications_safely")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowScanner(true)}>
            <Scan className="w-4 h-4 mr-2" />
            {t("scan_pill")}
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {t("add_medication")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="reminders">{t("reminders")}</TabsTrigger>
          <TabsTrigger value="interactions">{t("interactions")}</TabsTrigger>
          <TabsTrigger value="history">{t("history")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <Pill className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-muted-foreground">{t("active_medications")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <Clock className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-muted-foreground">{t("due_today")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-orange-500/10">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">1</div>
                    <div className="text-sm text-muted-foreground">{t("low_stock")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <AlertTriangle className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">1</div>
                    <div className="text-sm text-muted-foreground">{t("interactions")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Medications */}
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("current_medications")}</CardTitle>
                  <CardDescription>{t("manage_your_prescriptions")}</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder={t("search_medications")} className="pl-10 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-white/20 dark:border-gray-700/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <Pill className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{med.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage} • {med.frequency}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("next_dose")}: {med.nextDose}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {med.remaining} {t("pills_left")}
                        </div>
                        {med.interactions > 0 && (
                          <Badge variant="destructive" className="mt-1">
                            {med.interactions} {t("interaction")}
                          </Badge>
                        )}
                      </div>
                      <Badge variant={med.status === "low" ? "destructive" : "default"}>{t(med.status)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Doses */}
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
            <CardHeader>
              <CardTitle>{t("upcoming_doses")}</CardTitle>
              <CardDescription>{t("next_24_hours")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDoses.map((dose, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-gray-800/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <div className="font-medium">{dose.medication}</div>
                        <div className="text-sm text-muted-foreground">{dose.dosage}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">{dose.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders">
          <MedicationReminders />
        </TabsContent>

        <TabsContent value="interactions">
          <DrugInteractionChecker />
        </TabsContent>

        <TabsContent value="history">
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
            <CardHeader>
              <CardTitle>{t("medication_history")}</CardTitle>
              <CardDescription>{t("track_adherence_patterns")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">{t("medication_history_coming_soon")}</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pill Scanner Modal */}
      {showScanner && <PillScanner onClose={() => setShowScanner(false)} />}
    </div>
  )
}
