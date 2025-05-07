"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileText, Upload, Loader2, CheckCircle2, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function DragDropUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showDialog, setShowDialog] = useState(false)
  const [transactionType, setTransactionType] = useState("sale")
  const [transactionName, setTransactionName] = useState("")
  const [uploadComplete, setUploadComplete] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
    if (acceptedFiles.length > 0) {
      setShowDialog(true)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10485760, // 10MB
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    if (files.length <= 1) {
      setShowDialog(false)
    }
  }

  const handleUpload = async () => {
    if (files.length === 0 || !transactionType || !transactionName) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    clearInterval(interval)
    setUploadProgress(100)
    setIsUploading(false)
    setUploadComplete(true)

    // Reset after showing success
    setTimeout(() => {
      setShowDialog(false)
      setFiles([])
      setTransactionName("")
      setUploadComplete(false)
    }, 2000)
  }

  return (
    <>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${
            isDragActive
              ? "border-purple-500 bg-purple-50"
              : "border-purple-200 hover:border-purple-300 hover:bg-purple-50/50"
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Upload className="h-6 w-6 text-purple-600" />
          </div>
          <div className="mt-4 text-sm font-medium">
            {isDragActive ? "Drop the files here..." : "Drag and drop files here, or click to select files"}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Upload documents to automatically create a new transaction
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Supports PDF, DOCX, JPG, PNG (max 10MB)</div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Transaction</DialogTitle>
            <DialogDescription>
              {uploadComplete
                ? "Transaction created successfully!"
                : "Provide details to create a new transaction from your uploaded document(s)."}
            </DialogDescription>
          </DialogHeader>

          {uploadComplete ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Transaction Created!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your new {transactionType} transaction has been created successfully.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {files.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Documents</Label>
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-md border border-purple-100 bg-purple-50 p-2"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-purple-600" />
                            <div>
                              <div className="text-sm font-medium">{file.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFile(index)
                            }}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="transaction-name">Transaction Name</Label>
                  <Input
                    id="transaction-name"
                    placeholder="e.g., 123 Main St"
                    value={transactionName}
                    onChange={(e) => setTransactionName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <RadioGroup
                    value={transactionType}
                    onValueChange={setTransactionType}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="listing" id="listing" className="text-purple-600" />
                      <Label htmlFor="listing">Listing</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sale" id="sale" className="text-purple-600" />
                      <Label htmlFor="sale">Sale</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" className="text-purple-600" />
                      <Label htmlFor="other">Other (Referral or BPO)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-purple-700">Creating transaction...</Label>
                      <span className="text-xs text-muted-foreground">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!transactionName || isUploading}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                >
                  {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isUploading ? "Creating..." : "Create Transaction"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
