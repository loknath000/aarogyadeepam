"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useLanguage } from "@/hooks/use-language"

export function VitalsChart() {
  const { t } = useLanguage()

  const data = [
    { date: "1/1", heartRate: 72, bloodPressure: 120, temperature: 98.6 },
    { date: "1/2", heartRate: 75, bloodPressure: 118, temperature: 98.4 },
    { date: "1/3", heartRate: 70, bloodPressure: 122, temperature: 98.7 },
    { date: "1/4", heartRate: 73, bloodPressure: 119, temperature: 98.5 },
    { date: "1/5", heartRate: 71, bloodPressure: 121, temperature: 98.6 },
    { date: "1/6", heartRate: 74, bloodPressure: 117, temperature: 98.3 },
    { date: "1/7", heartRate: 72, bloodPressure: 120, temperature: 98.6 },
  ]

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} name={t("heart_rate")} />
          <Line type="monotone" dataKey="bloodPressure" stroke="#3b82f6" strokeWidth={2} name={t("blood_pressure")} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
