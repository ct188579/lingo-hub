"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Volume2 } from "lucide-react"
import { Toaster, toast } from "sonner"

export default function Page() {
  const [isShow, setIsShow] = useState(false)
  const [vocabularyList, setVocabularyList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    // Retrieve vocabulary list from local storage
    const storedVocabulary = localStorage.getItem("vocabularyList")
    if (storedVocabulary) {
      setVocabularyList(JSON.parse(storedVocabulary))
    }
  }, [])

  // Add new vocabulary
  const add = async () => {
    if (!inputRef.current?.value.trim()) {
      toast.error("Please enter a word")
      return
    }

    const word = inputRef.current.value.trim()

    // Check if word already exists
    if (vocabularyList.some((item) => item.word.toLowerCase() === word.toLowerCase())) {
      toast.error(`"${word}" is already in your vocabulary list`)
      return
    }

    setIsLoading(true)

    try {
      // Call translation API
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

      if (!response.ok) {
        throw new Error("Word not found")
      }

      const data = await response.json()

      // Extract translation and phonetic
      const translation = data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found"
      const phonetic = data[0]?.phonetic || ""

      // Create new vocabulary item
      const newItem = {
        word,
        translation,
        phonetic,
      }

      // Update state and local storage
      const updatedList = [...vocabularyList, newItem]
      setVocabularyList(updatedList)
      localStorage.setItem("vocabularyList", JSON.stringify(updatedList))

      // Reset and close dialog
      inputRef.current.value = ""
      setIsShow(false)

      toast.success(`"${word}" has been added to your vocabulary list`)
    } catch (error) {
      toast.error("Failed to translate the word. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Play pronunciation
  const playPronunciation = (word) => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = "en-US"
    window.speechSynthesis.speak(utterance)
  }

  // Delete vocabulary item
  const deleteVocabulary = (index) => {
    const updatedList = vocabularyList.filter((_, i) => i !== index)
    setVocabularyList(updatedList)
    localStorage.setItem("vocabularyList", JSON.stringify(updatedList))

    toast.success("The word has been removed from your vocabulary list")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Vocabulary</h1>
        <Button onClick={() => setIsShow(true)}>Add Word</Button>
      </div>

      {vocabularyList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Your vocabulary list is empty. Add some words to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vocabularyList.map((item, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="bg-primary/5 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold">{item.word}</CardTitle>
                    {item.phonetic && (
                      <CardDescription className="flex items-center mt-1">
                        {item.phonetic}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                          onClick={() => playPronunciation(item.word)}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => deleteVocabulary(index)}
                  >
                    Remove
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p>{item.translation}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={isShow}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Vocabulary</AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                ref={inputRef}
                placeholder="Enter your new vocabulary word"
                className="mt-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    add()
                  }
                }}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsShow(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={add} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                "Add"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}
