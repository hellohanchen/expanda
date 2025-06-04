export type ActionResponse<T = any> = {
  success: boolean
  error: string | null
  data: T | null
} 