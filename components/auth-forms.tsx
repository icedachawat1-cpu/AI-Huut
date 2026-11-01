"use client"

import { useState } from "react"
import Image from "next/image"
import { useApp } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

export function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const { login } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    
    const success = login(email, password)
    if (!success) {
      setError("Invalid credentials or account suspended")
    }
  }

  return (
    <Card className="w-full max-w-md border-[#b8d8c6] bg-[#e8f3ec]">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="Macha AI Hub" width={80} height={80} />
        </div>
        <CardTitle className="text-2xl font-bold text-[#143d24]">Welcome Back</CardTitle>
        <CardDescription className="text-[#3d6b4d]">
          Sign in to Macha AI Hub
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email" className="text-[#143d24]">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="admin@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#d4e9dc] border-[#b8d8c6] text-[#143d24] placeholder:text-[#3d6b4d]/60"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password" className="text-[#143d24]">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#d4e9dc] border-[#b8d8c6] text-[#143d24] placeholder:text-[#3d6b4d]/60"
              />
            </Field>
          </FieldGroup>
          
          {error && (
            <p className="text-[#c53030] text-sm mt-2">{error}</p>
          )}
          
          <Button type="submit" className="w-full mt-6 bg-[#2b5c3a] text-[#f0f7f2] hover:bg-[#2b5c3a]/90">
            Sign In
          </Button>
          
          <p className="text-center text-sm text-[#3d6b4d] mt-4">
            {"Don't have an account? "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-[#2b5c3a] hover:underline font-medium"
            >
              Register
            </button>
          </p>
          
          <div className="mt-4 p-3 rounded-lg bg-[#c8e0d0] border border-[#b8d8c6]">
            <p className="text-xs text-[#3d6b4d] text-center">
              <strong className="text-[#143d24]">Demo:</strong> Use admin@admin.com / admin for ADMIN role
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { register } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !password || !displayName) {
      setError("Please fill in all fields")
      return
    }
    
    const success = register(email, password, displayName)
    if (!success) {
      setError("Email already exists")
    }
  }

  return (
    <Card className="w-full max-w-md border-[#b8d8c6] bg-[#e8f3ec]">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="Macha AI Hub" width={80} height={80} />
        </div>
        <CardTitle className="text-2xl font-bold text-[#143d24]">Create Account</CardTitle>
        <CardDescription className="text-[#3d6b4d]">
          Join Macha AI Hub today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="displayName" className="text-[#143d24]">Display Name</FieldLabel>
              <Input
                id="displayName"
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-[#d4e9dc] border-[#b8d8c6] text-[#143d24] placeholder:text-[#3d6b4d]/60"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="regEmail" className="text-[#143d24]">Email</FieldLabel>
              <Input
                id="regEmail"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#d4e9dc] border-[#b8d8c6] text-[#143d24] placeholder:text-[#3d6b4d]/60"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="regPassword" className="text-[#143d24]">Password</FieldLabel>
              <Input
                id="regPassword"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#d4e9dc] border-[#b8d8c6] text-[#143d24] placeholder:text-[#3d6b4d]/60"
              />
            </Field>
          </FieldGroup>
          
          {error && (
            <p className="text-[#c53030] text-sm mt-2">{error}</p>
          )}
          
          <Button type="submit" className="w-full mt-6 bg-[#2b5c3a] text-[#f0f7f2] hover:bg-[#2b5c3a]/90">
            Create Account
          </Button>
          
          <p className="text-center text-sm text-[#3d6b4d] mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#2b5c3a] hover:underline font-medium"
            >
              Sign In
            </button>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
