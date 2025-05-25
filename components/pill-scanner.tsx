"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, X, Scan, AlertTriangle, CheckCircle } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface PillScannerProps {
  onClose: () => void
}

export function PillScanner({ onClose }: PillScannerProps) {
  const { t } = useLanguage()
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)

  const handleScan = () => {
    setIsScanning(true)
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false)
      setScanResult({
        name: "Metformin",
        dosage: "500mg",
        manufacturer: "Generic Pharma",
        confidence: 95,
        warnings: [t("take_with_food")],
        interactions: [t("alcohol_warning")],
      })
    }, 3000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5" />
              {t("pill_scanner")}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!scanResult ? (
            <>
              {/* Camera View */}
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                {isScanning ? (
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white">{t("scanning_pill")}</p>
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>{t("position_pill_in_frame")}</p>
                  </div>
                )}

                {/* Scanning overlay */}
                <div className="absolute inset-4 border-2 border-blue-500 rounded-lg opacity-50"></div>
              </div>

              <Button onClick={handleScan} disabled={isScanning} className="w-full">
                <Scan className="w-4 h-4 mr-2" />
                {isScanning ? t("scanning") : t("scan_pill")}
              </Button>
            </>
          ) : (
            <>
              {/* Scan Results */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">{t("pill_identified")}</span>
                  <Badge variant="secondary">
                    {scanResult.confidence}% {t("confidence")}
                  </Badge>
                </div>

                <div className="p-4 rounded-lg bg-white/5 dark:bg-gray-800/5">
                  <h3 className="font-semibold text-lg">{scanResult.name}</h3>
                  <p className="text-muted-foreground">{scanResult.dosage}</p>
                  <p className="text-sm text-muted-foreground">{scanResult.manufacturer}</p>
                </div>

                {scanResult.warnings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      {t("warnings")}
                    </h4>
                    {scanResult.warnings.map((warning: string, index: number) => (
                      <div key={index} className="text-sm p-2 rounded bg-orange-500/10 text-orange-600">
                        {warning}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={() => setScanResult(null)} variant="outline" className="flex-1">
                    {t("scan_another")}
                  </Button>
                  <Button className="flex-1">{t("add_to_medications")}</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
