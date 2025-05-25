"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation, MapPin, Accessibility, Volume2, Search, Camera } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function ARNavigation() {
  const { t } = useLanguage()
  const [isARActive, setIsARActive] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState("")

  const departments = [
    { name: t("emergency"), floor: "Ground Floor", distance: "50m", accessible: true },
    { name: t("cardiology"), floor: "2nd Floor", distance: "120m", accessible: true },
    { name: t("neurology"), floor: "3rd Floor", distance: "180m", accessible: true },
    { name: t("pediatrics"), floor: "1st Floor", distance: "90m", accessible: true },
    { name: t("radiology"), floor: "Basement", distance: "200m", accessible: false },
    { name: t("pharmacy"), floor: "Ground Floor", distance: "30m", accessible: true },
  ]

  const quickDestinations = [
    { name: t("restroom"), icon: "🚻", distance: "25m" },
    { name: t("cafeteria"), icon: "🍽️", distance: "80m" },
    { name: t("parking"), icon: "🚗", distance: "150m" },
    { name: t("information"), icon: "ℹ️", distance: "10m" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {t("ar_navigation")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("indoor_wayfinding_system")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Volume2 className="w-4 h-4 mr-2" />
            {t("voice_guidance")}
          </Button>
          <Button onClick={() => setIsARActive(!isARActive)}>
            <Camera className="w-4 h-4 mr-2" />
            {isARActive ? t("stop_ar") : t("start_ar")}
          </Button>
        </div>
      </div>

      {/* AR Camera View */}
      <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
        <CardContent className="p-0">
          <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-lg flex items-center justify-center relative overflow-hidden">
            {isARActive ? (
              <div className="relative w-full h-full">
                {/* Simulated AR Camera View */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50"></div>

                {/* AR Overlays */}
                <div className="absolute top-4 left-4 bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm">
                  {t("ar_active")}
                </div>

                {/* Direction Arrow */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 border-4 border-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <Navigation className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                {/* Distance Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">45m</div>
                    <div className="text-sm">{t("to_destination")}</div>
                  </div>
                </div>

                {/* Accessibility Route */}
                <div className="absolute top-4 right-4 bg-green-500/80 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <Accessibility className="w-4 h-4" />
                  {t("accessible_route")}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium">{t("ar_camera_view")}</p>
                <p className="text-sm text-muted-foreground">{t("tap_start_ar_navigation")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search and Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Search */}
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              {t("find_department")}
            </CardTitle>
            <CardDescription>{t("search_hospital_departments")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("search_departments")}
                className="pl-10"
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {departments
                .filter((dept) => dept.name.toLowerCase().includes(selectedDestination.toLowerCase()))
                .map((dept, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-white/20 dark:border-gray-700/20 hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={() => setSelectedDestination(dept.name)}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-sm text-muted-foreground">{dept.floor}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{dept.distance}</span>
                      {dept.accessible && (
                        <Badge variant="secondary" className="text-xs">
                          <Accessibility className="w-3 h-3 mr-1" />
                          {t("accessible")}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Destinations */}
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
          <CardHeader>
            <CardTitle>{t("quick_destinations")}</CardTitle>
            <CardDescription>{t("common_hospital_locations")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickDestinations.map((dest, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col gap-2 hover:bg-white/20"
                  onClick={() => setSelectedDestination(dest.name)}
                >
                  <span className="text-2xl">{dest.icon}</span>
                  <div className="text-center">
                    <div className="text-sm font-medium">{dest.name}</div>
                    <div className="text-xs text-muted-foreground">{dest.distance}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Instructions */}
      {selectedDestination && (
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              {t("navigation_to")} {selectedDestination}
            </CardTitle>
            <CardDescription>{t("step_by_step_directions")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-blue-500/10">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <div className="font-medium">{t("head_straight")}</div>
                  <div className="text-sm text-muted-foreground">{t("continue_for_30_meters")}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <div className="font-medium">{t("turn_right")}</div>
                  <div className="text-sm text-muted-foreground">{t("at_the_information_desk")}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <div className="font-medium">{t("take_elevator")}</div>
                  <div className="text-sm text-muted-foreground">{t("to_second_floor")}</div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button className="flex-1">
                  <Navigation className="w-4 h-4 mr-2" />
                  {t("start_navigation")}
                </Button>
                <Button variant="outline">
                  <Volume2 className="w-4 h-4 mr-2" />
                  {t("voice_directions")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
