"use client"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Dashboard } from "@/components/dashboard"
import { MedicationManager } from "@/components/medication-manager"
import { TherapyPortal } from "@/components/therapy-portal"
import { ARNavigation } from "@/components/ar-navigation"
import { FamilyPortal } from "@/components/family-portal"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { AIAssistant } from "@/components/ai-assistant"
import { EmergencyDetection } from "@/components/emergency-detection"
import { Toaster } from "@/components/ui/toaster"

export default function AarogyaDeepaApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { language, setLanguage } = useLanguage()

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "medication":
        return <MedicationManager />
      case "therapy":
        return <TherapyPortal />
      case "navigation":
        return <ARNavigation />
      case "family":
        return <FamilyPortal />
      default:
        return <Dashboard />
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">{renderContent()}</div>
          </main>
        </div>

        {/* AI Assistant */}
        <AIAssistant />

        {/* Emergency Detection */}
        <EmergencyDetection />

        <Toaster />
      </div>
    </SidebarProvider>
  )
}
