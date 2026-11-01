"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, Image, Upload, X, Play, FileAudio, FileImage } from "lucide-react"
import { cn } from "@/lib/utils"

export function PlaygroundsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#143d24]">Playgrounds</h1>
        <p className="text-[#3d6b4d] mt-1">
          Experiment with Voice and OCR capabilities
        </p>
      </div>

      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="bg-[#d4e9dc] mb-6">
          <TabsTrigger value="voice" className="data-[state=active]:bg-[#2b5c3a] data-[state=active]:text-[#f0f7f2] text-[#143d24]">
            <Mic className="w-4 h-4 mr-2" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="ocr" className="data-[state=active]:bg-[#2b5c3a] data-[state=active]:text-[#f0f7f2] text-[#143d24]">
            <Image className="w-4 h-4 mr-2" />
            OCR
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voice">
          <VoicePlayground />
        </TabsContent>

        <TabsContent value="ocr">
          <OcrPlayground />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VoicePlayground() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && (file.type.startsWith("audio/") || file.name.endsWith(".mp3") || file.name.endsWith(".wav"))) {
      setAudioFile(file)
      setResult(null)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      setResult(null)
    }
  }

  const handleProcess = () => {
    if (!audioFile) return
    setProcessing(true)
    
    // Simulate processing
    setTimeout(() => {
      setResult(`Transcription Result:\n\n"This is a simulated transcription of the audio file: ${audioFile.name}. The actual Voice-to-Text processing would convert your audio content to text using our AI models."`)
      setProcessing(false)
    }, 2000)
  }

  const clearFile = () => {
    setAudioFile(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
        <CardHeader>
          <CardTitle className="text-[#143d24]">Voice to Text</CardTitle>
          <CardDescription className="text-[#3d6b4d]">
            Upload an audio file to transcribe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.ogg"
            className="hidden"
            onChange={handleFileSelect}
          />
          
          {!audioFile ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                isDragging 
                  ? "border-[#2b5c3a] bg-[#2b5c3a]/5" 
                  : "border-[#b8d8c6] hover:border-[#2b5c3a]/50 bg-[#d4e9dc]"
              )}
            >
              <Upload className="w-12 h-12 mx-auto text-[#3d6b4d] mb-4" />
              <p className="text-sm text-[#143d24] font-medium mb-1">
                Drag and drop audio file here
              </p>
              <p className="text-xs text-[#3d6b4d]">
                or click to browse (MP3, WAV, M4A, OGG)
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-[#b8d8c6] p-4 bg-[#c8e0d0]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#2b5c3a]/20 flex items-center justify-center">
                  <FileAudio className="w-6 h-6 text-[#2b5c3a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#143d24] truncate">
                    {audioFile.name}
                  </p>
                  <p className="text-xs text-[#3d6b4d]">
                    {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  className="shrink-0 text-[#3d6b4d] hover:bg-[#d4e9dc]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                onClick={handleProcess}
                disabled={processing}
                className="w-full mt-4 bg-[#2b5c3a] text-[#f0f7f2] hover:bg-[#2b5c3a]/90"
              >
                {processing ? (
                  "Processing..."
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Transcribe Audio
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
        <CardHeader>
          <CardTitle className="text-[#143d24]">Result</CardTitle>
          <CardDescription className="text-[#3d6b4d]">
            Transcription output will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="rounded-lg bg-[#c8e0d0] border border-[#b8d8c6] p-4">
              <pre className="text-sm text-[#143d24] whitespace-pre-wrap font-sans">
                {result}
              </pre>
            </div>
          ) : (
            <div className="rounded-lg bg-[#d4e9dc] border border-[#b8d8c6] p-12 text-center">
              <Mic className="w-12 h-12 mx-auto text-[#3d6b4d] mb-4" />
              <p className="text-sm text-[#3d6b4d]">
                Upload an audio file to see the transcription
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function OcrPlayground() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setResult(null)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setResult(null)
    }
  }

  const handleProcess = () => {
    if (!imageFile) return
    setProcessing(true)
    
    // Simulate processing
    setTimeout(() => {
      setResult(`OCR Result:\n\nExtracted text from "${imageFile.name}":\n\n"This is simulated OCR output. The actual OCR processing would extract all visible text from your uploaded image using our typhoon-ocr model. This includes printed text, handwritten content, and text from documents, receipts, signs, etc."`)
      setProcessing(false)
    }, 2000)
  }

  const clearFile = () => {
    setImageFile(null)
    setImagePreview(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
        <CardHeader>
          <CardTitle className="text-[#143d24]">Image to Text (OCR)</CardTitle>
          <CardDescription className="text-[#3d6b4d]">
            Upload an image to extract text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.png,.jpg,.jpeg,.gif,.webp"
            className="hidden"
            onChange={handleFileSelect}
          />
          
          {!imageFile ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                isDragging 
                  ? "border-[#2b5c3a] bg-[#2b5c3a]/5" 
                  : "border-[#b8d8c6] hover:border-[#2b5c3a]/50 bg-[#d4e9dc]"
              )}
            >
              <Upload className="w-12 h-12 mx-auto text-[#3d6b4d] mb-4" />
              <p className="text-sm text-[#143d24] font-medium mb-1">
                Drag and drop image here
              </p>
              <p className="text-xs text-[#3d6b4d]">
                or click to browse (PNG, JPG, GIF, WebP)
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-[#b8d8c6] p-4 bg-[#c8e0d0]">
              <div className="flex items-start gap-3">
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-lg border border-[#b8d8c6]"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#143d24] truncate">
                    {imageFile.name}
                  </p>
                  <p className="text-xs text-[#3d6b4d]">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  className="shrink-0 text-[#3d6b4d] hover:bg-[#d4e9dc]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                onClick={handleProcess}
                disabled={processing}
                className="w-full mt-4 bg-[#2b5c3a] text-[#f0f7f2] hover:bg-[#2b5c3a]/90"
              >
                {processing ? (
                  "Processing..."
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Extract Text
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#b8d8c6] bg-[#e8f3ec]">
        <CardHeader>
          <CardTitle className="text-[#143d24]">Result</CardTitle>
          <CardDescription className="text-[#3d6b4d]">
            Extracted text will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="rounded-lg bg-[#c8e0d0] border border-[#b8d8c6] p-4">
              <pre className="text-sm text-[#143d24] whitespace-pre-wrap font-sans">
                {result}
              </pre>
            </div>
          ) : (
            <div className="rounded-lg bg-[#d4e9dc] border border-[#b8d8c6] p-12 text-center">
              <FileImage className="w-12 h-12 mx-auto text-[#3d6b4d] mb-4" />
              <p className="text-sm text-[#3d6b4d]">
                Upload an image to see the extracted text
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
