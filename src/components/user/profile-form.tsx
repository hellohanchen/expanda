'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { SafeUser } from "@/lib/types"

const profileSchema = z.object({
  username: z.string()
    .min(1, "Username is required")
    .max(32, "Username must be 32 characters or less")
    .regex(/^[a-zA-Z0-9_\s]+$/, "Username can only contain letters, numbers, spaces, and underscores")
    .transform(username => username.trim()), // Remove leading/trailing whitespace
  handle: z.string()
    .min(6, "Handle must be at least 6 characters")
    .max(18, "Handle must be 18 characters or less")
    .regex(/^[a-zA-Z0-9]+$/, "Handle can only contain letters and numbers"),
  name: z.string().min(1, "Name is required"),
  xUsername: z.string().optional(),
  mediumUsername: z.string().optional(),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUsername: z.string().optional(),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: {
    id: string
    name?: string | null | undefined
    username?: string | null | undefined
    handle?: string | null | undefined
    xUsername?: string | null | undefined
    mediumUsername?: string | null | undefined
    linkedinUrl?: string | null | undefined
    githubUsername?: string | null | undefined
    websiteUrl?: string | null | undefined
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      handle: user.handle || "",
      xUsername: user.xUsername || "",
      mediumUsername: user.mediumUsername || "",
      linkedinUrl: user.linkedinUrl || "",
      githubUsername: user.githubUsername || "",
      websiteUrl: user.websiteUrl || "",
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast.success("Profile updated successfully!")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...register("username")}
          placeholder="Your username"
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="handle">Handle</Label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
            @
          </span>
          <Input
            id="handle"
            {...register("handle")}
            placeholder="your_handle"
            className="rounded-l-none"
          />
        </div>
        {errors.handle && (
          <p className="text-sm text-red-500">{errors.handle.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Your name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="xUsername">X (Twitter) Username</Label>
        <Input
          id="xUsername"
          {...register("xUsername")}
          placeholder="username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mediumUsername">Medium Username</Label>
        <Input
          id="mediumUsername"
          {...register("mediumUsername")}
          placeholder="username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
        <Input
          id="linkedinUrl"
          {...register("linkedinUrl")}
          placeholder="https://linkedin.com/in/username"
          type="url"
        />
        {errors.linkedinUrl && (
          <p className="text-sm text-red-500">{errors.linkedinUrl.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="githubUsername">GitHub Username</Label>
        <Input
          id="githubUsername"
          {...register("githubUsername")}
          placeholder="username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Website URL</Label>
        <Input
          id="websiteUrl"
          {...register("websiteUrl")}
          placeholder="https://example.com"
          type="url"
        />
        {errors.websiteUrl && (
          <p className="text-sm text-red-500">{errors.websiteUrl.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
} 