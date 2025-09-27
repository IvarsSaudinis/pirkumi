"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Image } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner"

export default function Results({ data }: { data: any }) {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Pirkuma čeka analīzes rīks</h1>
                    <p className="text-muted-foreground">
                        Augšupielādējiet pirkuma čeku, apgrieziet to un saņemiet AI analīzes rezultātus JSON formātā
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">

                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Image className="w-5 h-5" />
                                Attēls
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           {data?.image && (
                               <div>
                                   <img src={data.image} alt="Uploaded receipt" className="w-full rounded-lg" />
                               </div>
                          )}
                        </CardContent>
                    </Card>

                    {/* Labā puse - JSON rezultāti */}
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>JSON Rezultāti</CardTitle>
                        </CardHeader>
                        <CardContent>
                            { data ? (
                                <div className="space-y-4">
                                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto text-foreground">
                                       {JSON.stringify(data, null, 2).replace(/\\n/g, '\n').replace(/\\"/g, '"')}
                                      </pre>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
                                                variant="outline"
                                                size="sm"
                                            >
                                                Kopēt JSON
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
                                                    const url = URL.createObjectURL(blob)
                                                    const a = document.createElement("a")
                                                    a.href = url
                                                    a.download = "image-analysis.json"
                                                    a.click()
                                                    URL.revokeObjectURL(url)
                                                }}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Lejupielādēt
                                            </Button>
                                        </div>
                                        <div>
                                            <Button size="sm" onClick={() => window.location.href = '/'} >
                                                { "Atgriezties sākumā" }
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-12">
                                    <p>Kaut kāda kļūda...</p>
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
