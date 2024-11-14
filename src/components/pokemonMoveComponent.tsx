import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Search } from 'lucide-react'
import { Move, Pokemon } from '@/app//types'
import { Input } from '@/components/ui/input'
import PokemonTypingComponent from './pokemonTyping'
import physical from './images/physical.png'
import special from './images/special.png'
import status from './images/status.png'
import Image from 'next/image'

interface PokemonMoveTabProps {
    pokemon: Pokemon
    updatePokemon: (pokemon: Pokemon) => void
    moveSlotIndex: number
}

export default function PokemonMoveComponent({ pokemon, updatePokemon, moveSlotIndex }: PokemonMoveTabProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMoveList, setFilteredMoveList] = useState<Move[]>(pokemon.moves);

    useEffect(() => {
        const filteredList = pokemon.moves.filter(move =>
            move.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredMoveList(filteredList);
    }, [searchTerm, pokemon.moves]);

    return (
        <div>
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
                                {searchTerm.length == 0 && (
                                    <tr
                                        key={'move-0'}
                                        className={`cursor-pointer hover:bg-gray-100`}
                                        onClick={() => updatePokemon({
                                            ...pokemon,
                                            selectedMoves: pokemon.selectedMoves.map((m, i) => i === moveSlotIndex ? null : m)
                                        })}
                                    >
                                        <td className="p-2 flex items-center">
                                            no move
                                        </td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                    </tr>
                                )}
                                {filteredMoveList
                                    .map((move, index) => (
                                        <tr
                                            key={`move-${move.id}`}
                                            className={`cursor-pointer hover:bg-gray-100 ${(index + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
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
                                                        <PokemonTypingComponent
                                                            typing={move.typing}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-2">
                                                {move.category === "physical" && (
                                                    <Image src={physical} alt={move.category} className="w-10 h-4 object-contain" loading="lazy" />
                                                )}
                                                {move.category === "special" && (
                                                    <Image src={special} alt={move.category} className="w-10 h-4 object-contain" loading="lazy" />
                                                )}                                                
                                                {move.category === "status" && (
                                                    <Image src={status} alt={move.category} className="w-10 h-4 object-contain" loading="lazy" />
                                                )}
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
        </div>
    )
}