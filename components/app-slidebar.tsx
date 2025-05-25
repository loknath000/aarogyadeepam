"use client"

import { Activity, Pill, Dumbbell, Navigation, Users, Heart, Brain, Stethoscope } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AppSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const { t } = useLanguage()

  const menuItems = [
    {
      id: "dashboard",
      title: t("dashboard"),
      icon: Activity,
      badge: null,
    },
    {
      id: "medication",
      title: t("medication"),
      icon: Pill,
      badge: "3",
    },
    {
      id: "therapy",
      title: t("therapy"),
      icon: Dumbbell,
      badge: null,
    },
    {
      id: "navigation",
      title: t("navigation"),
      icon: Navigation,
      badge: null,
    },
    {
      id: "family",
      title: t("family"),
      icon: Users,
      badge: "2",
    },
  ]

  const quickActions = [
    { icon: Heart, label: t("vitals"), color: "text-red-500" },
    { icon: Brain, label: t("mental_health"), color: "text-purple-500" },
    { icon: Stethoscope, label: t("consultation"), color: "text-blue-500" },
  ]

  return (
    <Sidebar className="border-r border-white/20 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              AarogyaDeepa
            </h1>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("main_menu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="w-full justify-start gap-3 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-200"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("quick_actions")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="justify-start gap-3 hover:bg-white/20 dark:hover:bg-gray-800/20"
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground text-center">{t("version")} 2.0.1</div>
      </SidebarFooter>
    </Sidebar>
  )
}
