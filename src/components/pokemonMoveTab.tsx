import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import PokemonComponent from '@/components/pokemonComponent'
import { ChevronLeft, Search } from 'lucide-react'
import { Item, Move, Pokemon } from '@/app//types'
import { ScrollArea } from './ui/scroll-area'
import { Input } from '@/components/ui/input'
import { typeColors } from '@/app/typeColors'

interface PokemonMoveTabProps {
    pokemon: Pokemon
    updatePokemon: (pokemon: Pokemon) => void
    removePokemonFromTeam: (id: number) => void
    setSelectedPokemon: (pokemon: Pokemon) => void
    setSelectedMoveSlot: (moveslot: number) => void
    setView: (view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList') => void
    genders: string[]
    items: Item[]
    moveSlotIndex: number
}

export default function PokemonMoveTab({ pokemon, updatePokemon, removePokemonFromTeam, setSelectedPokemon, setSelectedMoveSlot, setView, genders, items, moveSlotIndex }: PokemonMoveTabProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMoveList, setFilteredMoveList] = useState<Move[]>(pokemon.moves);

    useEffect(() => {
        const filteredList = pokemon.moves.filter(move =>
            move.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredMoveList(filteredList);
    }, [searchTerm, items]);

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
            />
            <ScrollArea className="scroll-area-tab pr-2 mt-4">
                <Card>
                    <CardContent>
                        <div className="mt-6">
                            <div className="relative mb-4">
                                <Input
                                    type="text"
                                    placeholder="Search Move"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                            </div>
                            <table className="w-full">
                                <thead className="sticky top-0 bg-zinc-400">
                                    <tr>
                                        <th className="p-2 text-left">Move</th>
                                        <th className="p-2 text-left">Typing</th>
                                        <th className="p-2 text-left">Category</th>
                                        <th className="p-2 text-left">Power</th>
                                        <th className="p-2 text-left">Accuracy</th>
                                        <th className="p-2 text-left">PP</th>
                                        <th className="p-2 text-left">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMoveList
                                        .map((move, index) => (
                                            <tr
                                                key={`move-${move.id}`}
                                                className={`cursor-pointer hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                                onClick={() => updatePokemon({
                                                    ...pokemon,
                                                    selectedMoves: pokemon.selectedMoves.map((m, i) => i === moveSlotIndex ? move : m)
                                                })}
                                            >
                                                <td className="p-2">
                                                    {move.name}
                                                </td>
                                                <td className="p-2">
                                                    <div className="flex justify-center">
                                                        {move.typing && (
                                                            <span
                                                                key={`moveTyping-${move.typing.id}`}
                                                                className="px-2 py-1 rounded-full text-xs font-semibold"
                                                                style={{ backgroundColor: typeColors[move.typing.name], color: 'white' }}
                                                            >
                                                                {move.typing.name}
                                                            </span>)}
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    {move.category} {/*TODO: Make into image*/}
                                                </td>
                                                <td className="p-2">
                                                    <div className="flex justify-center">
                                                        {move.basePower}
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    {move.accuracy != null && (
                                                        <div className="flex justify-center">
                                                            {move.accuracy}%
                                                        </div>
                                                    )}
                                                    {move.accuracy == null && (
                                                        <div className="flex justify-center">
                                                            -
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-2 flex justify-center">
                                                    <div className="flex justify-center">
                                                        {move.pp}
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    {move.description}
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