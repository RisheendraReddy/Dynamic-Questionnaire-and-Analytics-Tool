
export const fallbackToast = {
    success: (message: string) => {
      if (typeof window !== "undefined") {
        alert(`Success: ${message}`)
      }
      console.log(`Success: ${message}`)
    },
    error: (message: string) => {
      if (typeof window !== "undefined") {
        alert(`Error: ${message}`)
      }
      console.error(`Error: ${message}`)
    },
  }
  