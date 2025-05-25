"use client"

import { Bell, Search, Settings, User, Globe, Moon, Sun, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/hooks/use-language"
import { useTheme } from "next-themes"
import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function Header() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [isListening, setIsListening] = useState(false)

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  ]

  const toggleVoiceListening = () => {
    setIsListening(!isListening)
    // Voice interaction logic would go here
  }

  return (
    <header className="h-16 border-b border-white/20 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("search_placeholder")}
            className="pl-10 w-80 bg-white/20 dark:bg-gray-800/20 border-white/30 dark:border-gray-700/30"
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleVoiceListening}
          className={`${isListening ? "bg-red-500/20 text-red-500" : "hover:bg-white/20"}`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Globe className="w-4 h-4" />
              {languages.find((l) => l.code === language)?.flag}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={language === lang.code ? "bg-accent" : ""}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500">3</Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              {t("profile")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              {t("settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">{t("logout")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
