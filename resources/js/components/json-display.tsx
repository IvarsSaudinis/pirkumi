"use client"

import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { toast } from "sonner"

interface JsonDisplayProps {
    data: any
    isLoading?: boolean
}

export function JsonDisplay({ data, isLoading }: JsonDisplayProps) {


    const copyToClipboard = async () => {
        if (!data) return

        try {
            await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
            toast( "Dati ir nokopēti uz starpliktuvi" )
        } catch (error) {
            toast("Neizdevās nokopēt datus")
        }
    }

    const downloadJson = () => {
        if (!data) return

        const jsonString = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonString], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `image-analysis-${Date.now()}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    if (isLoading) {
        return (
            <div className="bg-muted rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-muted-foreground">Apstrādā attēlu...</p>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="bg-muted rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Augšupielādējiet un analizējiet attēlu, lai redzētu rezultātus</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Button onClick={copyToClipboard} size="sm" variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Kopēt
                </Button>
                <Button onClick={downloadJson} size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Lejupielādēt
                </Button>
            </div>

            <div className="bg-muted rounded-lg p-4 max-h-[500px] overflow-auto">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    )
}
