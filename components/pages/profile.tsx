"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Save } from "lucide-react"

export function ProfilePage() {
  const { currentUser, updateUser } = useApp()
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "")
  const [saved, setSaved] = useState(false)

  const usagePercent = currentUser 
    ? (currentUser.tokenUsage / currentUser.tokenLimit) * 100 
    : 0

  const handleSave = () => {
    if (currentUser) {
      updateUser(currentUser.id, { displayName })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#143d24]">Profile Settings</h1>
        <p className="text-[#3d6b4d] mt-1">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Personal Information */}
        <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
          <CardHeader>
            <CardTitle className="text-[#143d24]">Personal Information</CardTitle>
            <CardDescription className="text-[#3d6b4d]">
              Update your profile details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="displayName" className="text-[#143d24]">Display Name</FieldLabel>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-[#d4e9dc] border-[#b8d8c6] text-[#143d24]"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email" className="text-[#143d24]">Email</FieldLabel>
                <Input
                  id="email"
                  value={currentUser?.email || ""}
                  disabled
                  className="bg-[#c8e0d0] border-[#b8d8c6] text-[#3d6b4d] cursor-not-allowed"
                />
              </Field>
              <Field>
                <FieldLabel className="text-[#143d24]">Role</FieldLabel>
                <div className="pt-1">
                  <Badge 
                    className={currentUser?.role === "ADMIN" 
                      ? "bg-[#2b5c3a] text-[#f0f7f2]" 
                      : "bg-[#d4e9dc] text-[#143d24]"
                    }
                  >
                    {currentUser?.role}
                  </Badge>
                </div>
              </Field>
            </FieldGroup>
            
            <div className="mt-6 flex items-center gap-3">
              <Button 
                onClick={handleSave}
                className="bg-[#2b5c3a] text-[#f0f7f2] hover:bg-[#2b5c3a]/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              {saved && (
                <span className="text-sm text-[#2b5c3a]">Changes saved!</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quota Overview */}
        <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
          <CardHeader>
            <CardTitle className="text-[#143d24]">Quota Overview</CardTitle>
            <CardDescription className="text-[#3d6b4d]">
              Your current monthly token usage and limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#3d6b4d]">Monthly Token Usage</span>
                <span className="font-medium text-[#143d24]">
                  {(currentUser?.tokenUsage || 0).toLocaleString()} / {(currentUser?.tokenLimit || 0).toLocaleString()}
                </span>
              </div>
              <Progress value={usagePercent} className="h-4 bg-[#d4e9dc]" />
              <p className="text-xs text-[#3d6b4d] mt-2">
                {usagePercent.toFixed(1)}% of your monthly quota used
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#c8e0d0] border border-[#b8d8c6]">
                <p className="text-sm text-[#3d6b4d]">Tokens Used</p>
                <p className="text-2xl font-bold text-[#143d24]">
                  {((currentUser?.tokenUsage || 0) / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[#c8e0d0] border border-[#b8d8c6]">
                <p className="text-sm text-[#3d6b4d]">Tokens Remaining</p>
                <p className="text-2xl font-bold text-[#143d24]">
                  {(((currentUser?.tokenLimit || 0) - (currentUser?.tokenUsage || 0)) / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
