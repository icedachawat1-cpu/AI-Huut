"use client"

import { useState } from "react"
import { useApp, MODEL_GROUPS } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Plus, Eye, EyeOff, Trash2, Key } from "lucide-react"

export function ApiKeysPage() {
  const { currentUser, getUserApiKeys, createApiKey, revokeApiKey } = useApp()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  
  const userKeys = currentUser ? getUserApiKeys(currentUser.id) : []

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const next = new Set(prev)
      if (next.has(keyId)) {
        next.delete(keyId)
      } else {
        next.add(keyId)
      }
      return next
    })
  }

  const maskKey = (key: string) => {
    return key.substring(0, 10) + "..." + key.substring(key.length - 4)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#143d24]">API Keys</h1>
          <p className="text-[#3d6b4d] mt-1">
            Manage your API keys for accessing AI models
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2b5c3a] text-[#f0f7f2] hover:bg-[#2b5c3a]/90">
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <CreateApiKeyModal 
            onClose={() => setIsCreateOpen(false)} 
            onCreate={createApiKey}
          />
        </Dialog>
      </div>

      {userKeys.length === 0 ? (
        <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
          <CardContent className="py-12">
            <div className="text-center">
              <Key className="w-12 h-12 mx-auto text-[#3d6b4d] mb-4" />
              <h3 className="text-lg font-medium text-[#143d24] mb-2">No API Keys</h3>
              <p className="text-sm text-[#3d6b4d] mb-4">
                Create your first API key to start using AI models
              </p>
              <Button 
                onClick={() => setIsCreateOpen(true)}
                className="bg-[#2b5c3a] text-[#f0f7f2] hover:bg-[#2b5c3a]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create API Key
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
          <Table>
            <TableHeader>
              <TableRow className="border-[#b8d8c6]">
                <TableHead className="text-[#3d6b4d]">Name</TableHead>
                <TableHead className="text-[#3d6b4d]">API Key</TableHead>
                <TableHead className="text-[#3d6b4d]">Allowed Models</TableHead>
                <TableHead className="text-[#3d6b4d]">Created</TableHead>
                <TableHead className="text-[#3d6b4d] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userKeys.map((apiKey) => (
                <TableRow key={apiKey.id} className="border-[#b8d8c6]">
                  <TableCell className="font-medium text-[#143d24]">
                    {apiKey.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-[#c8e0d0] px-2 py-1 rounded text-[#143d24]">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#3d6b4d] hover:bg-[#c8e0d0]"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {apiKey.allowedModels.slice(0, 3).map((model) => (
                        <Badge 
                          key={model} 
                          className="text-xs bg-[#c8e0d0] text-[#143d24]"
                        >
                          {model}
                        </Badge>
                      ))}
                      {apiKey.allowedModels.length > 3 && (
                        <Badge 
                          className="text-xs bg-[#c8e0d0] text-[#143d24]"
                        >
                          +{apiKey.allowedModels.length - 3} more
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
        </Card>
      )}
    </div>
  )
}

interface CreateApiKeyModalProps {
  onClose: () => void
  onCreate: (name: string, allowedModels: string[]) => void
}

function CreateApiKeyModal({ onClose, onCreate }: CreateApiKeyModalProps) {
  const [keyName, setKeyName] = useState("")
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set())

  const toggleModel = (model: string) => {
    setSelectedModels(prev => {
      const next = new Set(prev)
      if (next.has(model)) {
        next.delete(model)
      } else {
        next.add(model)
      }
      return next
    })
  }

  const toggleGroup = (models: string[]) => {
    const allSelected = models.every(m => selectedModels.has(m))
    setSelectedModels(prev => {
      const next = new Set(prev)
      if (allSelected) {
        models.forEach(m => next.delete(m))
      } else {
        models.forEach(m => next.add(m))
      }
      return next
    })
  }

  const handleCreate = () => {
    if (!keyName.trim() || selectedModels.size === 0) return
    onCreate(keyName, Array.from(selectedModels))
    onClose()
  }

  return (
    <DialogContent className="bg-[#e8f3ec] border-[#b8d8c6] max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-[#143d24]">Create API Key</DialogTitle>
        <DialogDescription className="text-[#3d6b4d]">
          Create a new API key with specific model access permissions
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="keyName" className="text-[#143d24]">Key Name</FieldLabel>
            <Input
              id="keyName"
              placeholder="e.g., Production API"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="bg-[#d4e9dc] border-[#b8d8c6] text-[#143d24] placeholder:text-[#3d6b4d]/60"
            />
          </Field>
        </FieldGroup>

        <div className="mt-6">
          <FieldLabel className="text-[#143d24]">Allowed Models</FieldLabel>
          <p className="text-sm text-[#3d6b4d] mb-4">
            Select which models this API key can access
          </p>

          <div className="flex flex-col gap-6">
            {Object.entries(MODEL_GROUPS).map(([groupKey, group]) => {
              const allSelected = group.models.every(m => selectedModels.has(m))
              const someSelected = group.models.some(m => selectedModels.has(m))
              
              return (
                <div key={groupKey} className="rounded-lg border border-[#b8d8c6] bg-[#d4e9dc] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Checkbox
                      id={`group-${groupKey}`}
                      checked={allSelected}
                      className={someSelected && !allSelected ? "data-[state=checked]:bg-[#2b5c3a]/50" : "data-[state=checked]:bg-[#2b5c3a]"}
                      onCheckedChange={() => toggleGroup(group.models)}
                    />
                    <label 
                      htmlFor={`group-${groupKey}`}
                      className="text-sm font-semibold text-[#143d24] cursor-pointer"
                    >
                      {group.name}
                    </label>
                    <span className="text-xs text-[#3d6b4d]">
                      ({group.models.length} models)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 ml-6">
                    {group.models.map((model) => (
                      <div key={model} className="flex items-center gap-2">
                        <Checkbox
                          id={`model-${model}`}
                          checked={selectedModels.has(model)}
                          onCheckedChange={() => toggleModel(model)}
                          className="data-[state=checked]:bg-[#2b5c3a]"
                        />
                        <label 
                          htmlFor={`model-${model}`}
                          className="text-sm text-[#143d24] cursor-pointer truncate"
                          title={model}
                        >
                          {model}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="border-[#b8d8c6] bg-[#e8f3ec] text-[#143d24] hover:bg-[#c8e0d0]">
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!keyName.trim() || selectedModels.size === 0}
            className="bg-[#2b5c3a] text-[#f0f7f2] hover:bg-[#2b5c3a]/90"
          >
            Create Key
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
