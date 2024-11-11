import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import PokemonComponent from '@/components/pokemonComponent'
import { ChevronLeft, Search } from 'lucide-react'
import { Item, Nature, Pokemon } from '@/app//types'
import { ScrollArea } from './ui/scroll-area'
import { Input } from '@/components/ui/input'

interface PokemonItemTabProps {
    pokemon: Pokemon
    updatePokemon: (pokemon: Pokemon) => void
    removePokemonFromTeam: (id: number) => void
    setSelectedPokemon: (pokemon: Pokemon) => void
    setView: (view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'team' | 'teamList') => void
    genders: string[]
    natures: Nature[]
    items: Item[]
}

export default function PokemonItemTab({ pokemon, updatePokemon, removePokemonFromTeam, setSelectedPokemon, setView, genders, natures, items }: PokemonItemTabProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItemList, setFilteredItemList] = useState<Item[]>(items);

    useEffect(() => {
        const filteredList = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredItemList(filteredList);
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
                setView={setView}
                genders={genders}
                items={items}
            />
            <ScrollArea className="scroll-area-tab pr-2 mt-4">
                <Card>
                    <CardContent>
                        <div className="my-8">
                            <div className="relative mb-4">
                                <Input
                                    type="text"
                                    placeholder="Search Item"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            <table className="w-full">
                                <thead className="sticky top-0 bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">Item</th>
                                        <th className="p-2 text-left">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        key={'item-0'}
                                        className={`cursor-pointer hover:bg-gray-100`}
                                        onClick={() => updatePokemon({ ...pokemon, item: null })}
                                    >
                                        <td className="p-2 flex items-center">
                                            no item
                                        </td>
                                        <td className="p-2"></td>
                                    </tr>
                                    {filteredItemList.map((item, index) => (
                                        <tr
                                            key={`item-${item.id}`}
                                            className={`cursor-pointer hover:bg-gray-100 ${(index + 1) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                            onClick={() => updatePokemon({ ...pokemon, item: item })}
                                        >
                                            <td className="p-2 flex items-center">
                                                {item.image && (
                                                    <img src={item.image} alt={item.name} className="w-10 h-10 mr-2" loading="lazy" />
                                                )} {item.name}
                                            </td>
                                            <td className="p-2">
                                                {item.description}
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