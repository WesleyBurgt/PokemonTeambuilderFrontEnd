import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Search } from 'lucide-react'
import { Item, Pokemon } from '@/app//types'
import { Input } from '@/components/ui/input'

interface PokemonItemTabProps {
    pokemon: Pokemon
    updatePokemon: (pokemon: Pokemon) => void
    items: Item[]
}

export default function PokemonItemComponent({ pokemon, updatePokemon, items }: PokemonItemTabProps) {
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
            <Card>
                <CardContent>
                    <div className="mt-6">
                        <div className="relative mb-4">
                            <Input
                                type="text"
                                placeholder="Search Item"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                        </div>
                        <table className="w-full">
                            <thead className="sticky top-0 bg-zinc-400">
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
        </div>
    )
}