"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Types
export type UserRole = "ADMIN" | "USER"

export interface User {
  id: string
  email: string
  displayName: string
  role: UserRole
  status: "active" | "suspended"
  tokenUsage: number
  tokenLimit: number
}

export interface ApiKey {
  id: string
  userId: string
  name: string
  key: string
  allowedModels: string[]
  createdAt: Date
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  fileName?: string
}

// Model definitions
export const MODEL_GROUPS = {
  openai: {
    name: "OpenAI",
    models: ["gpt-4o", "o1", "gpt-4o-mini", "o4-mini", "gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano"]
  },
  local: {
    name: "Local",
    models: [
      "macha-coder",
      "ict-ollama/gpt-oss:120b",
      "ict-ollama/qwen2.5:72b-instruct-q4_K_M",
      "ict-ollama/seallms-v3-7b:latest",
      "ict-ollama/deepseek-coder-v2:16b",
      "ict-ollama/codellama:34b",
      "ict-ollama/qwen2.5-coder:32b",
      "rnd-vllm/gpt-oss-120b"
    ]
  },
  embedding: {
    name: "Embedding & Specialty",
    models: [
      "text-embedding-3-large",
      "text-embedding-3-small",
      "Qwen3-Embedding-4B",
      "ict-vllm/typhoon-ocr-1-5"
    ]
  }
}

export const ALL_MODELS = [
  ...MODEL_GROUPS.openai.models,
  ...MODEL_GROUPS.local.models,
  ...MODEL_GROUPS.embedding.models
]

// Initial mock data
const initialUsers: User[] = [
  {
    id: "user-1",
    email: "admin@admin.com",
    displayName: "Admin",
    role: "ADMIN",
    status: "active",
    tokenUsage: 1250000,
    tokenLimit: 10000000
  },
  {
    id: "user-2",
    email: "nm@nm.com",
    displayName: "General User",
    role: "USER",
    status: "active",
    tokenUsage: 450000,
    tokenLimit: 1000000
  },
  {
    id: "user-4",
    email: "dev@dev.com",
    displayName: "AI Developer",
    role: "USER",
    status: "active",
    tokenUsage: 2100000,
    tokenLimit: 3000000
  }
]

const initialApiKeys: ApiKey[] = [
  {
    id: "key-1",
    userId: "user-1",
    name: "Production API",
    key: "mch_sk_prod_a1b2c3d4e5f6g7h8i9j0",
    allowedModels: ["gpt-4o", "gpt-4o-mini", "macha-coder"],
    createdAt: new Date("2024-01-15")
  },
  {
    id: "key-2",
    userId: "user-1",
    name: "Development API",
    key: "mch_sk_dev_z9y8x7w6v5u4t3s2r1q0",
    allowedModels: ["gpt-4o-mini", "ict-ollama/qwen2.5-coder:32b", "text-embedding-3-small"],
    createdAt: new Date("2024-02-20")
  },
  {
    id: "key-3",
    userId: "user-2",
    name: "My First Key",
    key: "mch_sk_usr2_p1o2i3u4y5t6r7e8w9q0",
    allowedModels: ["gpt-4o-mini", "gpt-4.1-nano"],
    createdAt: new Date("2024-03-10")
  }
]

// Context interface
interface AppContextType {
  // Auth state
  currentUser: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  register: (email: string, password: string, displayName: string) => boolean
  
  // Users
  users: User[]
  updateUser: (userId: string, updates: Partial<User>) => void
  suspendUser: (userId: string) => void
  
  // API Keys
  apiKeys: ApiKey[]
  getUserApiKeys: (userId: string) => ApiKey[]
  createApiKey: (name: string, allowedModels: string[]) => void
  revokeApiKey: (keyId: string) => void
  
  // Chat
  chatMessages: ChatMessage[]
  addChatMessage: (message: Omit<ChatMessage, "id">) => void
  clearChat: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  const login = useCallback((email: string, password: string): boolean => {
    // Mock authentication
    if (email === "admin@admin.com" && password === "admin") {
      const adminUser = users.find(u => u.email === "admin@admin.com")
      if (adminUser && adminUser.status === "active") {
        setCurrentUser(adminUser)
        return true
      }
    } else {
      // Any other credentials create/find a USER role
      const existingUser = users.find(u => u.email === email)
      if (existingUser && existingUser.status === "active") {
        setCurrentUser(existingUser)
        return true
      }
    }
    return false
  }, [users])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setChatMessages([])
  }, [])

  const register = useCallback((email: string, password: string, displayName: string): boolean => {
    if (users.some(u => u.email === email)) {
      return false
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      displayName,
      role: "USER",
      status: "active",
      tokenUsage: 0,
      tokenLimit: 100000
    }
    
    setUsers(prev => [...prev, newUser])
    setCurrentUser(newUser)
    return true
  }, [users])

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u))
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null)
    }
  }, [currentUser])

  const suspendUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
    ))
  }, [])

  const getUserApiKeys = useCallback((userId: string) => {
    return apiKeys.filter(k => k.userId === userId)
  }, [apiKeys])

  const createApiKey = useCallback((name: string, allowedModels: string[]) => {
    if (!currentUser) return
    
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      userId: currentUser.id,
      name,
      key: `mch_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      allowedModels,
      createdAt: new Date()
    }
    
    setApiKeys(prev => [...prev, newKey])
  }, [currentUser])

  const revokeApiKey = useCallback((keyId: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== keyId))
  }, [])

  const addChatMessage = useCallback((message: Omit<ChatMessage, "id">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}`
    }
    setChatMessages(prev => [...prev, newMessage])
  }, [])

  const clearChat = useCallback(() => {
    setChatMessages([])
  }, [])

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        register,
        users,
        updateUser,
        suspendUser,
        apiKeys,
        getUserApiKeys,
        createApiKey,
        revokeApiKey,
        chatMessages,
        addChatMessage,
        clearChat
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
