"use client"

import { useApp } from "@/context/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Key, MessageSquare, Cpu, TrendingUp } from "lucide-react"

export function DashboardPage() {
  const { currentUser, getUserApiKeys } = useApp()
  
  const userKeys = currentUser ? getUserApiKeys(currentUser.id) : []
  const usagePercent = currentUser 
    ? (currentUser.tokenUsage / currentUser.tokenLimit) * 100 
    : 0

  const stats = [
    {
      title: "API Keys",
      value: userKeys.length,
      description: "Active keys",
      icon: Key,
    },
    {
      title: "Models Available",
      value: [...new Set(userKeys.flatMap(k => k.allowedModels))].length,
      description: "Across all keys",
      icon: Cpu,
    },
    {
      title: "Token Usage",
      value: `${((currentUser?.tokenUsage || 0) / 1000).toFixed(0)}K`,
      description: "This month",
      icon: TrendingUp,
    },
    {
      title: "Chat Sessions",
      value: 12,
      description: "Last 7 days",
      icon: MessageSquare,
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#143d24]">Dashboard</h1>
        <p className="text-[#3d6b4d] mt-1">
          Welcome back, {currentUser?.displayName}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-[#b8d8c6] bg-[#e8f3ec]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#3d6b4d]">
                  {stat.title}
                </CardTitle>
                <Icon className="w-4 h-4 text-[#3d6b4d]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#143d24]">{stat.value}</div>
                <p className="text-xs text-[#3d6b4d]">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
          <CardHeader>
            <CardTitle className="text-[#143d24]">Token Usage</CardTitle>
            <CardDescription className="text-[#3d6b4d]">
              Your monthly token consumption
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#3d6b4d]">Used</span>
                <span className="font-medium text-[#143d24]">
                  {(currentUser?.tokenUsage || 0).toLocaleString()} / {(currentUser?.tokenLimit || 0).toLocaleString()}
                </span>
              </div>
              <Progress value={usagePercent} className="h-3 bg-[#d4e9dc]" />
            </div>
            <p className="text-sm text-[#3d6b4d]">
              {usagePercent.toFixed(1)}% of your monthly quota used
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
          <CardHeader>
            <CardTitle className="text-[#143d24]">Quick Actions</CardTitle>
            <CardDescription className="text-[#3d6b4d]">
              Get started with common tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 p-3 rounded-lg bg-[#c8e0d0] border border-[#b8d8c6]">
                <Key className="w-5 h-5 text-[#2b5c3a]" />
                <div>
                  <p className="text-sm font-medium text-[#143d24]">Create API Key</p>
                  <p className="text-xs text-[#3d6b4d]">Generate a new key for your applications</p>
                </div>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-[#c8e0d0] border border-[#b8d8c6]">
                <MessageSquare className="w-5 h-5 text-[#2b5c3a]" />
                <div>
                  <p className="text-sm font-medium text-[#143d24]">Start Chat</p>
                  <p className="text-xs text-[#3d6b4d]">Interact with AI models directly</p>
                </div>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-[#c8e0d0] border border-[#b8d8c6]">
                <Cpu className="w-5 h-5 text-[#2b5c3a]" />
                <div>
                  <p className="text-sm font-medium text-[#143d24]">Try Playgrounds</p>
                  <p className="text-xs text-[#3d6b4d]">Experiment with Voice and OCR features</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
