"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"

export function MoodTracker() {
  const { t } = useLanguage()
  const [selectedMood, setSelectedMood] = useState("")

  const moods = [
    { emoji: "😊", label: t("happy"), value: "happy", color: "bg-green-500" },
    { emoji: "😌", label: t("calm"), value: "calm", color: "bg-blue-500" },
    { emoji: "😐", label: t("neutral"), value: "neutral", color: "bg-gray-500" },
    { emoji: "😔", label: t("sad"), value: "sad", color: "bg-blue-600" },
    { emoji: "😰", label: t("anxious"), value: "anxious", color: "bg-orange-500" },
    { emoji: "😴", label: t("tired"), value: "tired", color: "bg-purple-500" },
  ]

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{t("how_are_you_feeling")}</h3>
        <p className="text-sm text-muted-foreground">{t("track_emotional_wellbeing")}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {moods.map((mood) => (
          <Button
            key={mood.value}
            variant={selectedMood === mood.value ? "default" : "outline"}
            className="h-20 flex flex-col gap-2"
            onClick={() => setSelectedMood(mood.value)}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs">{mood.label}</span>
          </Button>
        ))}
      </div>

      {selectedMood && (
        <div className="text-center p-4 rounded-lg bg-white/5 dark:bg-gray-800/5">
          <p className="text-sm text-muted-foreground">
            {t("mood_recorded")}: {moods.find((m) => m.value === selectedMood)?.label}
          </p>
        </div>
      )}
    </div>
  )
}
