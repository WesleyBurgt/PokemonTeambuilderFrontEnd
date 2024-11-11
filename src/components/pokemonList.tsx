import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { BasePokemon } from '@/app/types';
import { ScrollArea } from './ui/scroll-area';

interface PokemonListProps {
    pokemonList: BasePokemon[];
    addPokemonToTeam: (pokemon: BasePokemon) => void;
    setView: (view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'team' | 'teamList') => void;
}

const typeColors: { [key: string]: string } = {
    normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C", grass: "#7AC74C",
    ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1", ground: "#E2BF65", flying: "#A98FF3",
    psychic: "#F95587", bug: "#A6B91A", rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC",
    dark: "#705746", steel: "#B7B7CE", fairy: "#E685BD"
};

export default function PokemonList({ pokemonList, addPokemonToTeam, setView }: PokemonListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPokemonList, setFilteredPokemonList] = useState<BasePokemon[]>(pokemonList);
    const [sortConfig, setSortConfig] = useState<{ key: keyof BasePokemon['baseStats'] | 'total'; direction: 'asc' | 'desc' } | null>(null);

    useEffect(() => {
        const filteredList = pokemonList.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig) {
            const { key, direction } = sortConfig;
            filteredList.sort((a, b) => {
                const aValue = key === 'total' ? Object.values(a.baseStats).reduce((acc, stat) => acc + stat, 0) : a.baseStats[key];
                const bValue = key === 'total' ? Object.values(b.baseStats).reduce((acc, stat) => acc + stat, 0) : b.baseStats[key];
                return direction === 'desc' ? bValue - aValue : aValue - bValue;
            });
        }

        setFilteredPokemonList(filteredList);
    }, [searchTerm, pokemonList, sortConfig]);

    const sortPokemon = (key: keyof BasePokemon['baseStats'] | 'total') => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
        setFilteredPokemonList(
            [...filteredPokemonList].sort((a, b) => {
                const aValue = key === 'total' ? Object.values(a.baseStats).reduce((acc, stat) => acc + stat, 0) : a.baseStats[key];
                const bValue = key === 'total' ? Object.values(b.baseStats).reduce((acc, stat) => acc + stat, 0) : b.baseStats[key];
                if (direction === 'desc') {
                    return bValue - aValue;
                } else {
                    return aValue - bValue;
                }
            })
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Pokémon Selection</h2>
                <Button onClick={() => setView('team')}>Team</Button>
            </div>
            <div className="relative mb-4">
                <Input
                    type="text"
                    placeholder="Search Pokémon"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            </div>
            <ScrollArea className="scroll-area-teams border pr-2 rounded-md">
                <table className="w-full">
                    <thead className="sticky top-0 bg-zinc-400">
                        <tr>
                            <th className="p-2 text-left">Pokémon</th>
                            <th className="p-2 text-left">Types</th>
                            <th className="p-2 text-left">Abilities</th>
                            <th className="p-2 text-left cursor-pointer hover:bg-gray-200" onClick={() => sortPokemon('hp')}>HP</th>
                            <th className="p-2 text-left cursor-pointer hover:bg-gray-200" onClick={() => sortPokemon('attack')}>Atk</th>
                            <th className="p-2 text-left cursor-pointer hover:bg-gray-200" onClick={() => sortPokemon('defense')}>Def</th>
                            <th className="p-2 text-left cursor-pointer hover:bg-gray-200" onClick={() => sortPokemon('specialAttack')}>SpA</th>
                            <th className="p-2 text-left cursor-pointer hover:bg-gray-200" onClick={() => sortPokemon('specialDefense')}>SpD</th>
                            <th className="p-2 text-left cursor-pointer hover:bg-gray-200" onClick={() => sortPokemon('speed')}>Spe</th>
                            <th className="p-2 text-left cursor-pointer hover:bg-gray-200" onClick={() => sortPokemon('total')}>BST</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPokemonList.map((pokemon, index) => (
                            <tr
                                key={pokemon.id}
                                className={`cursor-pointer hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                onClick={() => addPokemonToTeam(pokemon)}
                            >
                                <td className="p-2 flex items-center">
                                    <img src={pokemon.sprite} alt={pokemon.name} className="w-10 h-10 mr-2" loading="lazy" />
                                    {pokemon.name}
                                </td>
                                <td className="p-2">
                                    {pokemon.typings.map(typing => (
                                        <span
                                            key={typing.name}
                                            className="inline-block px-2 py-1 rounded-full text-xs font-semibold mr-1"
                                            style={{ backgroundColor: typeColors[typing.name], color: 'white' }}
                                        >
                                            {typing.name}
                                        </span>
                                    ))}
                                </td>
                                <td className="p-2">{pokemon.abilities.map(ability => ability.name).join(', ')}</td>
                                <td className="p-2">{pokemon.baseStats.hp}</td>
                                <td className="p-2">{pokemon.baseStats.attack}</td>
                                <td className="p-2">{pokemon.baseStats.defense}</td>
                                <td className="p-2">{pokemon.baseStats.specialAttack}</td>
                                <td className="p-2">{pokemon.baseStats.specialDefense}</td>
                                <td className="p-2">{pokemon.baseStats.speed}</td>
                                <td className="p-2">
                                    {Object.values(pokemon.baseStats).reduce((a, b) => a + b, 0)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ScrollArea>
        </div>
    );
}
