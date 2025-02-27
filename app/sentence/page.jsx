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
import { Trash2 } from "lucide-react"
import { Toaster, toast } from "sonner"

export default function Page() {
  const [isShow, setIsShow] = useState(false)
  const [haveSentence, setHaveSentence] = useState(false)
  const [sentences, setSentences] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteIndex, setDeleteIndex] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    // 从本地存储里查询句子
    const sentence = localStorage.getItem("sentence")
    if (sentence) {
      const parsedSentences = JSON.parse(sentence)
      setSentences(parsedSentences)
      setHaveSentence(parsedSentences.length > 0)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div></div>
  }

  // 添加句子功能
  const add = () => {
    const newSentence = inputRef.current?.value.trim()
    if (!newSentence) {
      toast.error("Please enter a sentence")
      return
    }

    const newSentences = [...sentences, newSentence]
    setSentences(newSentences)
    localStorage.setItem("sentence", JSON.stringify(newSentences))
    setHaveSentence(true)
    setIsShow(false)
    inputRef.current.value = ""

    toast.success("Sentence added successfully")
  }

  // 删除句子功能
  const deleteSentence = (index) => {
    const newSentences = sentences.filter((_, i) => i !== index)
    setSentences(newSentences)
    localStorage.setItem("sentence", JSON.stringify(newSentences))
    setHaveSentence(newSentences.length > 0)
    setDeleteIndex(null)

    toast.success("Sentence deleted successfully")
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header with Add Button */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex justify-between items-center h-14 px-4">
          <h1 className="text-xl font-semibold">My Sentences</h1>
          <Button onClick={() => setIsShow(true)}>Add</Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 mt-8">
        {!haveSentence ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300">You don't have any sentences currently</p>
          </div>
        ) : (
          <div className="flex flex-col items-start justify-start w-full text-left space-y-4">
            {sentences.map((sentence, index) => (
              <div
                key={index}
                className="group w-full pb-4 text-black dark:text-white border-b border-neutral-200 dark:border-slate-800 flex items-start justify-between gap-4"
              >
                <span className="font-thin flex-1">{sentence}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => setDeleteIndex(index)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete sentence</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Sentence Dialog */}
      <AlertDialog open={isShow}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Sentence</AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                ref={inputRef}
                placeholder="Enter your new sentence"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    add()
                  }
                }}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsShow(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={add}>Add</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sentence.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteIndex !== null && deleteSentence(deleteIndex)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}
