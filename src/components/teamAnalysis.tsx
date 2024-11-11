import React from 'react'
import { Card } from "@/components/ui/card"
import TypingGrid from './teamWeakness'
import { Typing, Team } from '@/app/types';
import { ScrollArea } from './ui/scroll-area';

interface TeamAnalysisProps {
    team: Team
    typings: Typing[]
}

export default function TeamAnalysis({ team, typings }: TeamAnalysisProps) {
    return (
        <ScrollArea className="space-y-4 m-4 scroll-area">
            <h2 className="text-2xl font-bold">Team Analysis</h2>
            <div className="m-2">
                <TypingGrid
                    team={team}
                    typings={typings}
                />
            </div>
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
        </ScrollArea>
    )
}