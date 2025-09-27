"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { router } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Crop, Download, Loader2 } from "lucide-react"
import { ImageCropper } from "@/components/image-cropper"
import { Toaster } from "@/components/ui/sonner"

export default function ReceiptUploadForm( ) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [croppedImage, setCroppedImage] = useState<string | null>(null)
    const [showCropper, setShowCropper] = useState(false)
    const [jsonResult, setJsonResult] = useState<any>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string)
                setShowCropper(true)
                setCroppedImage(null)
                setJsonResult(null)
            }
            reader.readAsDataURL(file)
        }
    }, [])

    const handleCropComplete = useCallback((croppedImageUrl: string) => {
        setCroppedImage(croppedImageUrl)
        setShowCropper(false)
    }, [])

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }


    const handleProcessImage = async () => {
        if (!croppedImage) return

        setIsProcessing(true)
        try {

            router.post(`/upload`, {
                _method: 'post',
                receipt_image: croppedImage,
            })

        } catch (error) {
            console.error("Error processing image:", error)
            setJsonResult({ error: "Failed to process image" })
        } finally {
            setIsProcessing(false)
        }
    }

    const resetForm = () => {
        setSelectedImage(null)
        setCroppedImage(null)
        setShowCropper(false)
        setJsonResult(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Pirkuma čeka analīzes rīks</h1>
                    <p className="text-muted-foreground">
                        Augšupielādējiet pirkuma čeku, apgrieziet to un saņemiet AI analīzes rezultātus JSON formātā
                    </p>
                </div>

                <div className="gap-8">
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                Pirkuma čeka augšupielāde
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

                            {!selectedImage ? (
                                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground mb-4">Izvēlieties pirkuma čeka attēlu augšupielādei</p>
                                    <Button onClick={handleUploadClick}>Izvēlēties attēlu</Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {showCropper ? (
                                        <ImageCropper
                                            image={selectedImage}
                                            onCropComplete={handleCropComplete}
                                            onCancel={() => setShowCropper(false)}
                                        />
                                    ) : croppedImage ? (
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <img
                                                    src={croppedImage || "/placeholder.svg"}
                                                    alt="Apgriezts attēls"
                                                    className="w-full h-64 object-contain bg-muted rounded-lg"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button onClick={() => setShowCropper(true)} variant="outline" size="sm">
                                                    <Crop className="w-4 h-4 mr-2" />
                                                    Apgriezt Vēlreiz
                                                </Button>
                                                <Button onClick={handleProcessImage} disabled={isProcessing} className="flex-1">
                                                    {isProcessing ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Download className="w-4 h-4 mr-2" />
                                                    )}
                                                    {isProcessing ? "Apstrādā..." : "Analizēt Attēlu"}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : null}

                                    <Button onClick={resetForm} variant="outline" className="w-full bg-transparent">
                                        Sākt No Jauna
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>


                </div>
            </div>
            <Toaster />
        </div>
    );
}
