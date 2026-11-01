"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Key, BarChart3, UserX, UserCheck, Trash2, Settings2 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

export function AdminPage() {
  const { currentUser } = useApp()

  // Only render for admin users
  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="p-8 flex items-center justify-center h-full bg-[#edf5f0]">
        <Card className="border-[#b8d8c6] bg-[#e8f3ec] max-w-md">
          <CardContent className="py-12 text-center">
            <UserX className="w-16 h-16 mx-auto text-[#c53030] mb-4" />
            <h2 className="text-xl font-bold text-[#143d24] mb-2">Access Denied</h2>
            <p className="text-[#3d6b4d]">
              You do not have permission to access the Admin Control Center.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#143d24]">Admin Control Center</h1>
        <p className="text-[#3d6b4d] mt-1">
          Manage users, API keys, and token allocations
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-[#d4e9dc] mb-6">
          <TabsTrigger value="users" className="data-[state=active]:bg-[#2b5c3a] data-[state=active]:text-[#f0f7f2] text-[#143d24]">
            <Users className="w-4 h-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="data-[state=active]:bg-[#2b5c3a] data-[state=active]:text-[#f0f7f2] text-[#143d24]">
            <Key className="w-4 h-4 mr-2" />
            API Management
          </TabsTrigger>
          <TabsTrigger value="tokens" className="data-[state=active]:bg-[#2b5c3a] data-[state=active]:text-[#f0f7f2] text-[#143d24]">
            <BarChart3 className="w-4 h-4 mr-2" />
            Token Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagementTab />
        </TabsContent>

        <TabsContent value="api-keys">
          <ApiManagementTab />
        </TabsContent>

        <TabsContent value="tokens">
          <TokenManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function UserManagementTab() {
  const { users, suspendUser } = useApp()

  return (
    <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
      <CardHeader>
        <CardTitle className="text-[#143d24]">All Users</CardTitle>
        <CardDescription className="text-[#3d6b4d]">
          Manage user accounts and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-[#b8d8c6]">
              <TableHead className="text-[#3d6b4d]">User ID</TableHead>
              <TableHead className="text-[#3d6b4d]">Email</TableHead>
              <TableHead className="text-[#3d6b4d]">Display Name</TableHead>
              <TableHead className="text-[#3d6b4d]">Role</TableHead>
              <TableHead className="text-[#3d6b4d]">Status</TableHead>
              <TableHead className="text-[#3d6b4d] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-[#b8d8c6]">
                <TableCell className="font-mono text-xs text-[#3d6b4d]">
                  {user.id}
                </TableCell>
                <TableCell className="text-[#143d24]">{user.email}</TableCell>
                <TableCell className="text-[#143d24]">{user.displayName}</TableCell>
                <TableCell>
                  <Badge 
                    className={user.role === "ADMIN" 
                      ? "bg-[#2b5c3a] text-[#f0f7f2]" 
                      : "bg-[#d4e9dc] text-[#143d24]"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={user.status === "active" 
                      ? "bg-[#2b5c3a]/20 text-[#2b5c3a]" 
                      : "bg-[#c53030]/20 text-[#c53030]"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => suspendUser(user.id)}
                    className={user.status === "active" 
                      ? "text-[#c53030] hover:text-[#c53030] hover:bg-[#c53030]/10"
                      : "text-[#2b5c3a] hover:text-[#2b5c3a] hover:bg-[#2b5c3a]/10"
                    }
                  >
                    {user.status === "active" ? (
                      <>
                        <UserX className="w-4 h-4 mr-1" />
                        Suspend
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function ApiManagementTab() {
  const { apiKeys, users, revokeApiKey } = useApp()

  const getUserEmail = (userId: string) => {
    return users.find(u => u.id === userId)?.email || "Unknown"
  }

  return (
    <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
      <CardHeader>
        <CardTitle className="text-[#143d24]">All API Keys</CardTitle>
        <CardDescription className="text-[#3d6b4d]">
          View and manage API keys across all users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-[#b8d8c6]">
              <TableHead className="text-[#3d6b4d]">Key ID</TableHead>
              <TableHead className="text-[#3d6b4d]">Name</TableHead>
              <TableHead className="text-[#3d6b4d]">Owner</TableHead>
              <TableHead className="text-[#3d6b4d]">Models</TableHead>
              <TableHead className="text-[#3d6b4d]">Created</TableHead>
              <TableHead className="text-[#3d6b4d] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id} className="border-[#b8d8c6]">
                <TableCell className="font-mono text-xs text-[#3d6b4d]">
                  {apiKey.id}
                </TableCell>
                <TableCell className="font-medium text-[#143d24]">{apiKey.name}</TableCell>
                <TableCell className="text-[#143d24]">{getUserEmail(apiKey.userId)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {apiKey.allowedModels.slice(0, 2).map((model) => (
                      <Badge 
                        key={model} 
                        className="text-xs bg-[#c8e0d0] text-[#143d24]"
                      >
                        {model}
                      </Badge>
                    ))}
                    {apiKey.allowedModels.length > 2 && (
                      <Badge 
                        className="text-xs bg-[#c8e0d0] text-[#143d24]"
                      >
                        +{apiKey.allowedModels.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-[#3d6b4d]">
                  {apiKey.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => revokeApiKey(apiKey.id)}
                    className="text-[#c53030] hover:text-[#c53030] hover:bg-[#c53030]/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function TokenManagementTab() {
  const { users, updateUser } = useApp()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [newLimit, setNewLimit] = useState("")

  // Token usage data for charts
  const usageData = users.map(user => ({
    name: user.displayName.split(" ")[0],
    usage: user.tokenUsage / 1000,
    limit: user.tokenLimit / 1000
  }))

  const pieData = users.map(user => ({
    name: user.displayName,
    value: user.tokenUsage
  }))

  const COLORS = ["#2b5c3a", "#4a8a5c", "#6ba87a", "#8fc4a0"]

  const totalTokens = users.reduce((acc, u) => acc + u.tokenUsage, 0)
  const totalLimit = users.reduce((acc, u) => acc + u.tokenLimit, 0)

  const handleUpdateLimit = () => {
    if (selectedUserId && newLimit) {
      updateUser(selectedUserId, { tokenLimit: parseInt(newLimit) })
      setSelectedUserId(null)
      setNewLimit("")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#3d6b4d]">
              Total Token Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#143d24]">
              {(totalTokens / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-[#3d6b4d]">
              of {(totalLimit / 1000).toFixed(0)}K allocated
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#3d6b4d]">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#143d24]">
              {users.filter(u => u.status === "active").length}
            </div>
            <p className="text-xs text-[#3d6b4d]">
              of {users.length} total
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#3d6b4d]">
              Usage Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#143d24]">
              {((totalTokens / totalLimit) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-[#3d6b4d]">
              of total capacity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
          <CardHeader>
            <CardTitle className="text-[#143d24]">Token Usage by User</CardTitle>
            <CardDescription className="text-[#3d6b4d]">
              Monthly token consumption (in thousands)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "#3d6b4d", fontSize: 12 }}
                    axisLine={{ stroke: "#b8d8c6" }}
                  />
                  <YAxis 
                    tick={{ fill: "#3d6b4d", fontSize: 12 }}
                    axisLine={{ stroke: "#b8d8c6" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#e8f3ec", 
                      border: "1px solid #b8d8c6",
                      borderRadius: "8px"
                    }}
                    labelStyle={{ color: "#143d24" }}
                  />
                  <Bar dataKey="usage" fill="#2b5c3a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="limit" fill="#d4e9dc" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
          <CardHeader>
            <CardTitle className="text-[#143d24]">Usage Distribution</CardTitle>
            <CardDescription className="text-[#3d6b4d]">
              Token usage share by user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name.split(" ")[0]} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#e8f3ec", 
                      border: "1px solid #b8d8c6",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number) => [`${(value / 1000).toFixed(1)}K tokens`, "Usage"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Token Limits */}
      <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
        <CardHeader>
          <CardTitle className="text-[#143d24]">User Token Limits</CardTitle>
          <CardDescription className="text-[#3d6b4d]">
            Set monthly token limits per user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#b8d8c6]">
                <TableHead className="text-[#3d6b4d]">User</TableHead>
                <TableHead className="text-[#3d6b4d]">Current Usage</TableHead>
                <TableHead className="text-[#3d6b4d]">Monthly Limit</TableHead>
                <TableHead className="text-[#3d6b4d]">Progress</TableHead>
                <TableHead className="text-[#3d6b4d] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const usagePercent = (user.tokenUsage / user.tokenLimit) * 100
                return (
                  <TableRow key={user.id} className="border-[#b8d8c6]">
                    <TableCell>
                      <div>
                        <p className="font-medium text-[#143d24]">{user.displayName}</p>
                        <p className="text-xs text-[#3d6b4d]">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#143d24]">
                      {(user.tokenUsage / 1000).toFixed(1)}K
                    </TableCell>
                    <TableCell className="text-[#143d24]">
                      {selectedUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={newLimit}
                            onChange={(e) => setNewLimit(e.target.value)}
                            placeholder={(user.tokenLimit / 1000).toString()}
                            className="w-24 h-8 bg-[#d4e9dc] border-[#b8d8c6] text-[#143d24]"
                          />
                          <span className="text-xs text-[#3d6b4d]">K</span>
                        </div>
                      ) : (
                        `${(user.tokenLimit / 1000).toFixed(0)}K`
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="w-32">
                        <Progress value={usagePercent} className="h-2 bg-[#d4e9dc]" />
                        <p className="text-xs text-[#3d6b4d] mt-1">
                          {usagePercent.toFixed(0)}%
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {selectedUserId === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUserId(null)}
                            className="text-[#3d6b4d] hover:bg-[#c8e0d0]"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleUpdateLimit}
                            className="bg-[#2b5c3a] text-[#f0f7f2] hover:bg-[#2b5c3a]/90"
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUserId(user.id)
                            setNewLimit((user.tokenLimit / 1000).toString())
                          }}
                          className="text-[#3d6b4d] hover:bg-[#c8e0d0]"
                        >
                          <Settings2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
