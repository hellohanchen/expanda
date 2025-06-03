'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPostSchema, createCommentSchema, createQuoteSchema, type CreatePostInput, type CreateCommentInput, type CreateQuoteInput } from "@/lib/validators/post"
import { createPost, createComment, createQuote } from "@/lib/actions/post"
import { generateContent } from "@/lib/actions/ai"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { PencilLine, FileText, BookOpen, Wand2 } from "lucide-react"
import { Label } from "@/components/ui/label"

type EditorMode = "post" | "comment" | "quote"

interface ContentEditorProps {
  mode: EditorMode
  targetId?: string // postId for comments and quotes
  onSuccess?: () => void
}

type FormData = {
  content: string
  headliner?: string
  shortContent?: string
  postId?: string
  quotePostId?: string
}

type DraftingMode = "headliner" | "short" | "full"

export function ContentEditor({ mode, targetId, onSuccess }: ContentEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [draftingMode, setDraftingMode] = useState<DraftingMode>("headliner")
  const [showHeadliner, setShowHeadliner] = useState(false)
  const [showShortContent, setShowShortContent] = useState(false)

  // Select the appropriate schema based on the mode
  const schema = {
    post: createPostSchema,
    comment: createCommentSchema,
    quote: createQuoteSchema,
  }[mode]

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
      headliner: "",
      shortContent: "",
      ...(mode === "comment" && { postId: targetId }),
      ...(mode === "quote" && { quotePostId: targetId }),
    },
  })

  const content = form.watch("content")
  const headliner = form.watch("headliner")
  const shortContent = form.watch("shortContent")

  useEffect(() => {
    const contentLength = content?.length || 0
    
    // Update drafting mode based on content length
    if (contentLength <= 50) {
      setDraftingMode("headliner")
      setShowHeadliner(false)
      setShowShortContent(false)
    } else if (contentLength <= 280) {
      setDraftingMode("short")
      setShowHeadliner(true)
      setShowShortContent(false)
      // Auto-populate headliner preview if not manually set
      if (!form.getValues("headliner")) {
        form.setValue("headliner", content.slice(0, 50))
      }
    } else {
      setDraftingMode("full")
      setShowHeadliner(true)
      setShowShortContent(true)
      // Auto-populate previews if not manually set
      if (!form.getValues("headliner")) {
        form.setValue("headliner", content.slice(0, 50))
      }
      if (!form.getValues("shortContent")) {
        form.setValue("shortContent", content.slice(0, 280))
      }
    }
  }, [content, form])

  const getDraftingModeInfo = () => {
    const modeConfig = {
      post: {
        headliner: {
          message: "You are drafting a headliner",
          description: "Keep it short and catchy (max 50 characters)",
        },
        short: {
          message: "You are drafting a short post",
          description: "Perfect for concise thoughts (50-280 characters)",
        },
        full: {
          message: "You are drafting a full article",
          description: "Express your thoughts in detail (280+ characters)",
        },
      },
      comment: {
        headliner: {
          message: "You are writing a quick comment",
          description: "Keep it short and sweet (max 50 characters)",
        },
        short: {
          message: "You are writing a detailed comment",
          description: "Perfect for a thoughtful response (50-280 characters)",
        },
        full: {
          message: "You are writing an in-depth response",
          description: "Express your thoughts in detail (280+ characters)",
        },
      },
      quote: {
        headliner: {
          message: "You are writing a quick quote",
          description: "Keep it short and sweet (max 50 characters)",
        },
        short: {
          message: "You are writing a detailed quote",
          description: "Perfect for a thoughtful response (50-280 characters)",
        },
        full: {
          message: "You are writing an in-depth quote",
          description: "Express your thoughts in detail (280+ characters)",
        },
      },
    }

    const config = modeConfig[mode][draftingMode]
    const colorConfig = {
      headliner: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300",
      short: "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950 dark:border-purple-900 dark:text-purple-300",
      full: "bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-900 dark:text-green-300",
    }

    return {
      icon: {
        headliner: PencilLine,
        short: FileText,
        full: BookOpen,
      }[draftingMode],
      message: config.message,
      description: config.description,
      className: colorConfig[draftingMode],
    }
  }

  const modeInfo = getDraftingModeInfo()
  const Icon = modeInfo.icon

  const placeholders = {
    post: "Write your post...",
    comment: "Write your comment...",
    quote: "Add your thoughts...",
  }

  const handleAIGenerate = async () => {
    try {
      const content = form.getValues("content")
      if (!content) {
        toast.error("Please write some content first")
        return
      }

      if (content.length <= 50) {
        toast.error("Content must be longer than 50 characters to use AI generation")
        return
      }

      setIsGenerating(true)
      const result = await generateContent({ 
        content,
        mode: content.length > 280 ? "both" : "headliner"
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      if (result.headliner) {
        form.setValue("headliner", result.headliner)
      }
      if (result.shortContent) {
        form.setValue("shortContent", result.shortContent)
      }

      toast.success("AI content generated successfully!")
    } catch (error) {
      toast.error("Failed to generate AI content")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <form 
      onSubmit={form.handleSubmit(async (formData) => {
        try {
          setIsSubmitting(true)
          console.log('Form data:', formData)

          // Prepare the submission data based on content length
          const contentLength = formData.content.length
          const submissionData = {
            ...formData,
            headliner: "",
            shortContent: "",
            fullContent: "",
          }

          if (contentLength <= 50) {
            submissionData.headliner = formData.content
          } else if (contentLength <= 280) {
            submissionData.headliner = formData.headliner || formData.content.slice(0, 50)
            submissionData.shortContent = formData.content
          } else {
            submissionData.headliner = formData.headliner || formData.content.slice(0, 50)
            submissionData.shortContent = formData.shortContent || formData.content.slice(0, 280)
            submissionData.fullContent = formData.content
          }

          console.log('Prepared submission data:', submissionData)

          let result
          switch (mode) {
            case "post":
              result = await createPost(submissionData as CreatePostInput)
              break
            case "comment":
              result = await createComment(submissionData as CreateCommentInput)
              break
            case "quote":
              result = await createQuote(submissionData as CreateQuoteInput)
              break
          }

          console.log('Submission result:', result)

          if (result.error) {
            toast.error(result.error)
            return
          }

          if (result.data) {
            const successMessages = {
              post: "Post created successfully!",
              comment: "Comment added!",
              quote: "Quote posted!",
            }
            toast.success(successMessages[mode])
            form.reset()
            
            if (onSuccess) {
              onSuccess()
            } else {
              // Default navigation behavior
              if (mode === "post") {
                router.push("/")
              } else if (mode === "quote") {
                router.push(`/post/${result.data.id}`)
              } else {
                router.refresh()
              }
            }
          }
        } catch (error) {
          toast.error("Something went wrong")
          console.error('Submission error:', error)
        } finally {
          setIsSubmitting(false)
        }
      })} 
      className="space-y-6"
    >
      <Card className={`border ${modeInfo.className} transition-colors duration-300`}>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <div>
              <p className="font-medium text-m leading-tight">{modeInfo.message}</p>
              <p className="text-m opacity-90 leading-tight">{modeInfo.description}</p>
            </div>
          </div>
          <div className="text-l font-medium">
            {content.length} chars
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content" className="text-base font-semibold">
            {mode === "post" ? "Post content" : mode === "comment" ? "Comment" : "Your Quote"}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAIGenerate}
            disabled={isGenerating || !content || content.length <= 50}
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate {content?.length > 280 ? "Summaries" : "Headliner"} with AI
              </>
            )}
          </Button>
        </div>
        <Textarea
          id="content"
          placeholder={placeholders[mode]}
          {...form.register("content")}
          className="min-h-[150px] resize-none focus-visible:ring-2 focus-visible:ring-offset-2"
        />
        {form.formState.errors.content && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.content.message}</p>
        )}
      </div>

      {showHeadliner && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <Label htmlFor="headliner" className="text-base">
              Headliner Preview
            </Label>
            <span className="text-sm text-muted-foreground">
              {(form.watch("headliner")?.length || 0)}/50
            </span>
          </div>
          <Textarea
            id="headliner"
            placeholder="Write a catchy headliner (max 50 characters)"
            {...form.register("headliner")}
            className="min-h-[60px] resize-none"
          />
          {form.formState.errors.headliner && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.headliner.message}</p>
          )}
        </div>
      )}

      {showShortContent && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <Label htmlFor="shortContent" className="text-base">
              Short Content Preview
            </Label>
            <span className="text-sm text-muted-foreground">
              {(shortContent?.length || 0)}/280
            </span>
          </div>
          <Textarea
            id="shortContent"
            placeholder="Write a concise summary (50-280 characters)"
            {...form.register("shortContent")}
            className="min-h-[80px] resize-none"
          />
          {form.formState.errors.shortContent && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.shortContent.message}</p>
          )}
        </div>
      )}

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full"
          onClick={() => console.log('Button clicked')}
        >
          {isSubmitting ? "Posting..." : `${mode.toUpperCase()}`}
        </Button>
      </div>
    </form>
  )
} 