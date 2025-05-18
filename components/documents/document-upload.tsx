"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Loader2 } from "lucide-react"

export function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<Record<string, string> | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setExtractedData(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsUploading(false)
    setIsProcessing(true)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Empty extracted data
    setExtractedData({})

    setIsProcessing(false)
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-500"></div>
      <CardHeader>
        <CardTitle className="text-xl font-poppins text-purple-700">Upload Document</CardTitle>
        <CardDescription>Upload transaction documents for AI-powered data extraction</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="transaction">Transaction</Label>
            <Select>
              <SelectTrigger className="border-purple-200">
                <SelectValue placeholder="Select transaction" />
              </SelectTrigger>
              <SelectContent>
                {/* Transaction options will be populated from API */}
                <SelectItem value="select">Select a transaction</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select>
              <SelectTrigger className="border-purple-200">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase-agreement">Purchase Agreement</SelectItem>
                <SelectItem value="seller-disclosure">Seller Disclosure</SelectItem>
                <SelectItem value="inspection-report">Inspection Report</SelectItem>
                <SelectItem value="loan-approval">Loan Approval</SelectItem>
                <SelectItem value="earnest-money">Earnest Money Receipt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="file">Document File</Label>
            <div className="grid gap-4">
              {!file ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-purple-200 p-12">
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
                      <Upload className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-sm font-medium">Drag and drop or click to upload</div>
                    <div className="text-xs text-muted-foreground">Supports PDF, DOCX, JPG, PNG (max 10MB)</div>
                  </div>
                  <Input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg border border-purple-200 p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                    className="text-purple-700 hover:bg-purple-50 hover:text-purple-700"
                  >
                    Remove
                  </Button>
                </div>
              )}
              <div className="flex justify-end">
                <Button
                  onClick={handleUpload}
                  disabled={!file || isUploading || isProcessing}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                >
                  {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isUploading ? "Uploading..." : isProcessing ? "Processing with AI..." : "Upload & Process"}
                </Button>
              </div>
            </div>
          </div>

          {extractedData && (
            <div className="rounded-lg border border-purple-200 bg-purple-50/30 p-4">
              <div className="mb-2 font-medium text-purple-700">AI-Extracted Data</div>
              <div className="grid gap-2">
                {Object.entries(extractedData).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data extracted. Please try again.</p>
                ) : (
                  Object.entries(extractedData).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">{key}:</div>
                      <div>{value}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
                >
                  Edit Data
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                >
                  Confirm & Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
