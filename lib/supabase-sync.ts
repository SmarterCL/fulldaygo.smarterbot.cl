import { SignInResultPayload } from "@/templates/login/UnifiedLogin"

export async function syncToSupabase(payload: SignInResultPayload) {
  try {
    await fetch("/api/mcp/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.error("Failed to sync user session", error)
  }
}
