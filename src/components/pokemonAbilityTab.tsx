import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import PokemonComponent from '@/components/pokemonComponent'
import { ChevronLeft, Search } from 'lucide-react'
import { Item, Nature, Pokemon } from '@/app//types'
import { ScrollArea } from './ui/scroll-area'

interface PokemonAbilityTabProps {
    pokemon: Pokemon
    updatePokemon: (pokemon: Pokemon) => void
    removePokemonFromTeam: (id: number) => void
    setSelectedPokemon: (pokemon: Pokemon) => void
    setSelectedMoveSlot: (moveslot: number) => void
    setView: (view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList') => void
    genders: string[]
    natures: Nature[]
    items: Item[]
}

export default function PokemonAbilityTab({ pokemon, updatePokemon, removePokemonFromTeam, setSelectedPokemon, setSelectedMoveSlot, setView, genders, natures, items }: PokemonAbilityTabProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <Button onClick={() => setView('team')}><ChevronLeft className="mr-2" />Team</Button>
                <Button onClick={() => setView('list')}>Add Pokémon</Button>
            </div>
            <PokemonComponent
                pokemon={pokemon}
                updatePokemon={updatePokemon}
                removePokemonFromTeam={removePokemonFromTeam}
                setSelectedPokemon={setSelectedPokemon}
                setSelectedMoveSlot={setSelectedMoveSlot}
                setView={setView}
                genders={genders}
                items={items}
            />
            <ScrollArea className="scroll-area-tab pr-2 mt-4">
                <Card>
                    <CardContent>
                        <div className="mt-6">
                            <table className="w-full">
                                <thead className="sticky top-0 bg-zinc-400">
                                    <tr>
                                        <th className="p-2 text-left">Ability</th>
                                        <th className="p-2 text-left">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pokemon.abilities
                                        .filter(ability => !ability.isHidden)
                                        .map((ability, index) => (
                                            <tr
                                                key={`ability-${ability.id}`}
                                                className={`cursor-pointer hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                                onClick={() => updatePokemon({ ...pokemon, ability })}
                                            >
                                                <td className="p-2 flex items-center">
                                                    {ability.name}
                                                </td>
                                                <td className="p-2">
                                                    {ability.description}
                                                </td>
                                            </tr>
                                        ))}

                                    {pokemon.abilities.some(ability => ability.isHidden) && (
                                        <tr className="bg-zinc-200">
                                            <td colSpan={2} className="p-2 font-semibold">
                                                Hidden Abilities
                                            </td>
                                        </tr>
                                    )}

                                    {pokemon.abilities
                                        .filter(ability => ability.isHidden)
                                        .map((ability, index) => (
                                            <tr
                                                key={`ability-${ability.id}`}
                                                className={`cursor-pointer hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                                onClick={() => updatePokemon({ ...pokemon, ability })}
                                            >
                                                <td className="p-2 flex items-center">
                                                    {ability.name}
                                                </td>
                                                <td className="p-2">
                                                    {ability.description}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </ScrollArea>
        </div>
    )
}