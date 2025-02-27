"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Moon, Sun, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Toaster, toast } from "sonner"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  if (typeof window === undefined) {
    return null;
  }

  const clearAllData = () => {
    try {
      // Clear all local storage data
      localStorage.removeItem("essay")
      localStorage.removeItem("sentence")
      localStorage.removeItem("vocabularyList")

      toast.success("All data cleared successfully. Please refresh the page.", {
        duration: 5000,
        action: {
          label: "Refresh",
          onClick: () => window.location.reload(),
        },
      })
    } catch (error) {
      toast.error("Failed to clear data. Please try again.")
    }
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and account settings.</p>
      </div>

      <Separator />

      <div className="grid gap-6">
        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks on your device.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span>Theme Mode</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? "Light" : "Dark"}
            </Button>
          </CardContent>
        </Card>

        {/* Links Section */}
        <Card>
          <CardHeader>
            <CardTitle>External Links</CardTitle>
            <CardDescription>Quick access to related resources.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => window.open("https://www.nextdaddy.cn/", "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit My Blog
            </Button>
          </CardContent>
        </Card>

        {/* Data Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Manage your app data and preferences. Be careful with these actions as they cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your saved vocabulary words, essays,
                    and sentences.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearAllData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}
