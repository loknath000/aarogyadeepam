"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, MessageCircle, X } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import type * as THREE from "three"

function AnimatedAssistant() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1)
    }
  })

  return (
    <group>
      <Sphere
        ref={meshRef}
        args={[1, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? "#3b82f6" : "#10b981"}
          emissive={hovered ? "#1e40af" : "#059669"}
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.02]}
          position={[(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4]}
        >
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
        </Sphere>
      ))}

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </group>
  )
}

export function AIAssistant() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [messages, setMessages] = useState([{ type: "assistant", content: t("ai_greeting") }])

  const toggleListening = () => {
    setIsListening(!isListening)
    // Voice recognition logic would go here
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg z-50"
        size="lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20 z-50">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Canvas>
                <AnimatedAssistant />
              </Canvas>
            </div>
            <div>
              <h3 className="font-semibold">{t("ai_assistant")}</h3>
              <p className="text-xs text-muted-foreground">{t("online")}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user" ? "bg-blue-500 text-white" : "bg-white/20 dark:bg-gray-800/20"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/20">
          <div className="flex gap-2">
            <Button variant={isListening ? "destructive" : "outline"} size="sm" onClick={toggleListening}>
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button size="sm" className="flex-1">
              {t("send_message")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
