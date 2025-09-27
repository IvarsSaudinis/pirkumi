"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import "react-image-crop/dist/ReactCrop.css"

interface ImageCropperProps {
    image: string
    onCropComplete: (croppedImage: string) => void
    onCancel: () => void
}

export function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
    const imgRef = useRef<HTMLImageElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        width: 50,
        height: 50,
        x: 25,
        y: 25,
    })
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget
        setCrop({
            unit: "%",
            width: 50,
            height: 50,
            x: 25,
            y: 25,
        })
    }, [])

    const handleCrop = useCallback(async () => {
        const image = imgRef.current
        const canvas = canvasRef.current
        if (!image || !canvas || !completedCrop) return

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        const offscreen = new OffscreenCanvas(completedCrop.width * scaleX, completedCrop.height * scaleY)
        const ctx = offscreen.getContext("2d")
        if (!ctx) return

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            offscreen.width,
            offscreen.height,
        )

        const blob = await offscreen.convertToBlob({
            type: "image/jpeg",
            quality: 0.9,
        })

        const reader = new FileReader()
        reader.onload = () => {
            onCropComplete(reader.result as string)
        }
        reader.readAsDataURL(blob)
    }, [completedCrop, onCropComplete])

    return (
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Velciet stūrus, lai mainītu apgriešanas apgabalu</div>

            <div className="flex justify-center">
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={undefined}
                    minWidth={300}
                    minHeight={600}
                    className="max-w-full"
                >
                    <img
                        ref={imgRef}
                        alt="Apgriežamais attēls"
                        src={image || "/placeholder.svg"}
                        onLoad={onImageLoad}
                        className="max-h-96 max-w-full object-contain"
                    />
                </ReactCrop>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-2 justify-center">
                <Button onClick={handleCrop} size="sm" disabled={!completedCrop}>
                    <Check className="w-4 h-4 mr-2" />
                    Apstiprināt
                </Button>
                <Button onClick={onCancel} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Atcelt
                </Button>
            </div>
        </div>
    )
}
