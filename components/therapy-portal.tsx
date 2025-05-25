"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, Target, Trophy, Calendar, Clock } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function TherapyPortal() {
  const { t } = useLanguage()
  const [isExercising, setIsExercising] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(0)

  const exercises = [
    {
      id: 1,
      name: t("shoulder_rolls"),
      duration: "2 minutes",
      difficulty: "Easy",
      completed: true,
      description: t("shoulder_rolls_desc"),
    },
    {
      id: 2,
      name: t("neck_stretches"),
      duration: "3 minutes",
      difficulty: "Easy",
      completed: true,
      description: t("neck_stretches_desc"),
    },
    {
      id: 3,
      name: t("arm_raises"),
      duration: "5 minutes",
      difficulty: "Medium",
      completed: false,
      description: t("arm_raises_desc"),
    },
    {
      id: 4,
      name: t("leg_extensions"),
      duration: "4 minutes",
      difficulty: "Medium",
      completed: false,
      description: t("leg_extensions_desc"),
    },
  ]

  const weeklyProgress = [
    { day: t("monday"), completed: 3, total: 4 },
    { day: t("tuesday"), completed: 4, total: 4 },
    { day: t("wednesday"), completed: 2, total: 4 },
    { day: t("thursday"), completed: 4, total: 4 },
    { day: t("friday"), completed: 1, total: 4 },
    { day: t("saturday"), completed: 0, total: 4 },
    { day: t("sunday"), completed: 0, total: 4 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {t("therapy_portal")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("ai_guided_rehabilitation")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            {t("schedule_session")}
          </Button>
          <Button>
            <Play className="w-4 h-4 mr-2" />
            {t("start_session")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="exercises" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="exercises">{t("exercises")}</TabsTrigger>
          <TabsTrigger value="progress">{t("progress")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("analytics")}</TabsTrigger>
          <TabsTrigger value="sessions">{t("sessions")}</TabsTrigger>
        </TabsList>

        <TabsContent value="exercises" className="space-y-6">
          {/* Today's Session */}
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {t("todays_session")}
              </CardTitle>
              <CardDescription>{t("upper_body_rehabilitation")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className={`p-4 rounded-lg border transition-all ${
                      currentExercise === index
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/20 dark:border-gray-700/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            exercise.completed ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          {exercise.completed ? (
                            <Trophy className="w-4 h-4 text-white" />
                          ) : (
                            <span className="text-sm font-medium text-white">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{exercise.name}</h3>
                          <p className="text-sm text-muted-foreground">{exercise.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">{exercise.duration}</div>
                          <Badge variant={exercise.difficulty === "Easy" ? "default" : "secondary"}>
                            {exercise.difficulty}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant={currentExercise === index ? "default" : "outline"}
                          onClick={() => setCurrentExercise(index)}
                        >
                          {exercise.completed ? t("review") : t("start")}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exercise Player */}
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
            <CardHeader>
              <CardTitle>{exercises[currentExercise]?.name}</CardTitle>
              <CardDescription>{t("ai_motion_tracking_active")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Video/Animation Area */}
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium">{t("exercise_animation")}</p>
                    <p className="text-sm text-muted-foreground">{t("ai_pose_detection")}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t("restart")}
                  </Button>
                  <Button size="lg" onClick={() => setIsExercising(!isExercising)}>
                    {isExercising ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        {t("pause")}
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        {t("start")}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock className="w-4 h-4 mr-2" />
                    2:30
                  </Button>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("progress")}</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Weekly Overview */}
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
            <CardHeader>
              <CardTitle>{t("weekly_progress")}</CardTitle>
              <CardDescription>{t("exercise_completion_rate")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium w-20">{day.day}</span>
                    <div className="flex-1 mx-4">
                      <Progress value={(day.completed / day.total) * 100} className="h-2" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {day.completed}/{day.total}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                {t("achievements")}
              </CardTitle>
              <CardDescription>{t("milestones_reached")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h3 className="font-semibold">{t("consistency_champion")}</h3>
                  <p className="text-sm text-muted-foreground">{t("7_days_streak")}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                    <Target className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold">{t("perfect_form")}</h3>
                  <p className="text-sm text-muted-foreground">{t("95_accuracy")}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold">{t("time_master")}</h3>
                  <p className="text-sm text-muted-foreground">{t("50_hours_completed")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
            <CardHeader>
              <CardTitle>{t("recovery_analytics")}</CardTitle>
              <CardDescription>{t("ai_powered_insights")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">{t("analytics_coming_soon")}</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-white/20">
            <CardHeader>
              <CardTitle>{t("session_history")}</CardTitle>
              <CardDescription>{t("past_therapy_sessions")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">{t("session_history_coming_soon")}</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
