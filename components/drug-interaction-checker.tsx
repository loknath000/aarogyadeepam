"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Info } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function DrugInteractionChecker() {
  const { t } = useLanguage()

  const interactions = [
    {
      id: 1,
      drug1: "Metformin",
      drug2: "Alcohol",
      severity: "moderate",
      description: t("metformin_alcohol_interaction"),
      recommendation: t("limit_alcohol_consumption"),
    },
    {
      id: 2,
      drug1: "Lisinopril",
      drug2: "Ibuprofen",
      severity: "minor",
      description: t("lisinopril_ibuprofen_interaction"),
      recommendation: t("monitor_blood_pressure"),
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "text-red-500 bg-red-500/10"
      case "moderate":
        return "text-orange-500 bg-orange-500/10"
      case "minor":
        return "text-yellow-500 bg-yellow-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "severe":
        return AlertTriangle
      case "moderate":
        return AlertTriangle
      case "minor":
        return Info
      default:
        return Shield
    }
  }

  return (
    <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {t("drug_interactions")}
        </CardTitle>
        <CardDescription>{t("potential_medication_conflicts")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interactions.length > 0 ? (
            interactions.map((interaction) => {
              const SeverityIcon = getSeverityIcon(interaction.severity)
              return (
                <div key={interaction.id} className="p-4 rounded-lg border border-white/20 dark:border-gray-700/20">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getSeverityColor(interaction.severity)}`}>
                      <SeverityIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">
                          {interaction.drug1} + {interaction.drug2}
                        </h3>
                        <Badge variant={interaction.severity === "severe" ? "destructive" : "secondary"}>
                          {t(interaction.severity)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{interaction.description}</p>
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {t("recommendation")}: {interaction.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-green-600 mb-2">{t("no_interactions_found")}</h3>
              <p className="text-sm text-muted-foreground">{t("medications_appear_safe")}</p>
            </div>
          )}

          <Button variant="outline" className="w-full">
            {t("check_new_medication")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
