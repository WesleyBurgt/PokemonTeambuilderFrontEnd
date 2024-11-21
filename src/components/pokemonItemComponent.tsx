import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Search } from 'lucide-react'
import { Item, Pokemon } from '@/app//types'
import { Input } from '@/components/ui/input'

interface PokemonItemTabProps {
    pokemon: Pokemon;
    updatePokemon: (pokemon: Pokemon) => void;
    setView: (view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList') => void;
    items: Item[];
}

export default function PokemonItemComponent({pokemon, updatePokemon, setView, items}: PokemonItemTabProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItemList, setFilteredItemList] = useState<Item[]>(items);

    useEffect(() => {
        const filteredList = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredItemList(filteredList);
    }, [searchTerm, items]);

    const pokemonSpecificItems = filteredItemList.filter(item =>
        item.description?.toLowerCase().includes(pokemon.name.toLowerCase())
    );
    const heldItems = filteredItemList.filter(
        item => item.description?.toLowerCase().includes('held: ') && 
                !item.description?.toLowerCase().includes(pokemon.name.toLowerCase())
    );
    const otherItems = filteredItemList.filter(
        item => 
            !item.description?.toLowerCase().includes('held: ') &&
            !item.description?.toLowerCase().includes(pokemon.name.toLowerCase())
    );

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
                                onChange={e => setSearchTerm(e.target.value)}
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
                                {searchTerm.length === 0 && (
                                    <tr
                                        key={'item-0'}
                                        className={`cursor-pointer hover:bg-gray-100`}
                                        onClick={() => {
                                            updatePokemon({ ...pokemon, item: null });
                                            setView('abilityTab');
                                        }}
                                    >
                                        <td className="p-2 flex items-center">No item</td>
                                        <td className="p-2"></td>
                                    </tr>
                                )}

                                {/* Pokémon Specific Items */}
                                {pokemonSpecificItems.length > 0 && (
                                    <>
                                        <tr className="bg-zinc-200">
                                            <td colSpan={2} className="p-2 font-bold">
                                                Pokémon Specific Items
                                            </td>
                                        </tr>
                                        {pokemonSpecificItems.map((item, index) => (
                                            <tr
                                                key={`item-${item.id}`}
                                                className={`cursor-pointer hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                                onClick={() => {
                                                    updatePokemon({ ...pokemon, item });
                                                    setView('abilityTab');
                                                }}
                                            >
                                                <td className="p-2 flex items-center">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-10 h-10 mr-2"
                                                            loading="lazy"
                                                        />
                                                    )}
                                                    {item.name}
                                                </td>
                                                <td className="p-2">{item.description}</td>
                                            </tr>
                                        ))}
                                    </>
                                )}

                                {/* Held Items */}
                                {heldItems.length > 0 && (
                                    <>
                                        <tr className="bg-zinc-200">
                                            <td colSpan={2} className="p-2 font-bold">
                                                Held Items
                                            </td>
                                        </tr>
                                        {heldItems.map((item, index) => (
                                            <tr
                                                key={`item-${item.id}`}
                                                className={`cursor-pointer hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                                onClick={() => {
                                                    updatePokemon({ ...pokemon, item });
                                                    setView('abilityTab');
                                                }}
                                            >
                                                <td className="p-2 flex items-center">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-10 h-10 mr-2"
                                                            loading="lazy"
                                                        />
                                                    )}
                                                    {item.name}
                                                </td>
                                                <td className="p-2">{item.description}</td>
                                            </tr>
                                        ))}
                                    </>
                                )}

                                {/* Other Items */}
                                {otherItems.length > 0 && (
                                    <>
                                        <tr className="bg-zinc-200">
                                            <td colSpan={2} className="p-2 font-bold">
                                                Other Items
                                            </td>
                                        </tr>
                                        {otherItems.map((item, index) => (
                                            <tr
                                                key={`item-${item.id}`}
                                                className={`cursor-pointer hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                                onClick={() => {
                                                    updatePokemon({ ...pokemon, item });
                                                    setView('abilityTab');
                                                }}
                                            >
                                                <td className="p-2 flex items-center">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-10 h-10 mr-2"
                                                            loading="lazy"
                                                        />
                                                    )}
                                                    {item.name}
                                                </td>
                                                <td className="p-2">{item.description}</td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
