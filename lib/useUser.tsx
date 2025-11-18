"use client"

import { useUser as useClerkUser } from "@clerk/nextjs"
import { clerkEnabled } from "@/lib/clerk-config"

export function useUser() {
  // If Clerk is not enabled, return empty state
  if (!clerkEnabled) {
    return {
      isSignedIn: false,
      user: null,
      isLoaded: true,
    }
  }
  
  // Otherwise, use the actual Clerk hook
  return useClerkUser()
}
