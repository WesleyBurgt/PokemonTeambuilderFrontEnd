import React from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function TeamAnalysis() {
    return (
        <div className="space-y-4 m-4">
            <h2 className="text-2xl font-bold">Team Analysis</h2>
            <Tabs defaultValue="weaknesses">
                <TabsList>
                    <TabsTrigger value="weaknesses">Team Weaknesses</TabsTrigger>
                    <TabsTrigger value="coverage">Move Coverage</TabsTrigger>
                </TabsList>
                <TabsContent value="weaknesses">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="type" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="effectiveness" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="coverage">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="type" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </TabsContent>
            </Tabs>
            <Card className="space-y-2 m-2">
                <h3 className="font-bold">Team Building Checklist</h3>
                <div className="flex flex-wrap">
                    <Card className="flex-shrink-0 p-2 m-2">
                        <h4 className="font-bold">Offensive</h4>
                        <ul className="list-disc list-inside">
                            <li className="whitespace-nowrap">Boosting move</li>
                            <li className="whitespace-nowrap">Volt-turn move</li>
                            <li className="whitespace-nowrap">Choice item</li>
                        </ul>
                    </Card>
                    <Card className="flex-shrink-0 p-2 m-2">
                        <h4 className="font-bold">Defensive</h4>
                        <ul className="list-disc list-inside">
                            <li className="whitespace-nowrap">Reliable recovery</li>
                            <li className="whitespace-nowrap">Status setter</li>
                            <li className="whitespace-nowrap">Status removal</li>
                        </ul>
                    </Card>
                    <Card className="flex-shrink-0 p-2 m-2">
                        <h4 className="font-bold">Hazard</h4>
                        <ul className="list-disc list-inside">
                            <li className="whitespace-nowrap">Hazard setter</li>
                            <li className="whitespace-nowrap">Hazard removal</li>
                            <li className="whitespace-nowrap">Phazer</li>
                        </ul>
                    </Card>
                    <Card className="flex-shrink-0 p-2 m-2">
                        <h4 className="font-bold">Control</h4>
                        <ul className="list-disc list-inside">
                            <li className="whitespace-nowrap">Weather control</li>
                            <li className="whitespace-nowrap">Terrain control</li>
                            <li className="whitespace-nowrap">Taunt</li>
                        </ul>
                    </Card>
                </div>
            </Card>
        </div>
    )
}