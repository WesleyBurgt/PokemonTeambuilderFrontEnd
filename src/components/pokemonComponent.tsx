import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Copy, Download, ArrowUpDown, Trash2 } from 'lucide-react'
import { Pokemon } from '@/app//types'

interface ComponentProps {
    pokemon: Pokemon
    updatePokemon: (pokemon: Pokemon) => void
    removePokemonFromTeam: (id: number) => void
    setSelectedPokemon: (pokemon: Pokemon) => void
    setView: (view: 'list' | 'detail' | 'team') => void
    genders: string[]
    items: string[]
}

const typeColors: { [key: string]: string } = {
    normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C", grass: "#7AC74C",
    ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1", ground: "#E2BF65", flying: "#A98FF3",
    psychic: "#F95587", bug: "#A6B91A", rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC",
    dark: "#705746", steel: "#B7B7CE", fairy: "#D685AD"
}

const statAbbreviations: { [key in keyof Pokemon['baseStats']]: string } = {
    hp: 'HP',
    attack: 'Atk',
    defense: 'Def',
    specialAttack: 'SpA',
    specialDefense: 'SpD',
    speed: 'Spe',
};

function calculateDerivedStats(pokemon: Pokemon): Pokemon['baseStats'] {
    const level = pokemon.level;

    const calculateStat = (
        baseStat: number,
        ev: number,
        iv: number,
        natureMultiplier: number
    ): number => {
        return Math.floor(((((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5) * natureMultiplier);
    };

    const getNatureMultiplier = (stat: keyof Pokemon['baseStats']): number => {
        if (pokemon.nature.up == stat) return 1.1;
        if (pokemon.nature.down == stat) return 0.9;
        return 1;
    };

    const derivedStats: Pokemon['baseStats'] = {
        hp: Math.floor(((2 * pokemon.baseStats.hp + pokemon.ivs.hp + Math.floor(pokemon.evs.hp / 4)) * level) / 100) + level + 10,
        attack: calculateStat(pokemon.baseStats.attack, pokemon.evs.attack, pokemon.ivs.attack, getNatureMultiplier('attack')),
        defense: calculateStat(pokemon.baseStats.defense, pokemon.evs.defense, pokemon.ivs.defense, getNatureMultiplier('defense')),
        specialAttack: calculateStat(pokemon.baseStats.specialAttack, pokemon.evs.specialAttack, pokemon.ivs.specialAttack, getNatureMultiplier('specialAttack')),
        specialDefense: calculateStat(pokemon.baseStats.specialDefense, pokemon.evs.specialDefense, pokemon.ivs.specialDefense, getNatureMultiplier('specialDefense')),
        speed: calculateStat(pokemon.baseStats.speed, pokemon.evs.speed, pokemon.ivs.speed, getNatureMultiplier('speed'))
    };

    return derivedStats;
}

export default function pokemonComponent({ pokemon, updatePokemon, removePokemonFromTeam, setSelectedPokemon, setView, genders, items }: ComponentProps) {
    const derivedStats = calculateDerivedStats(pokemon)
    return (
        <Card key={pokemon.personalId} className="p-4">
            <div className="flex justify-end mb-2">
                <div className="flex space-x-2">
                    <Button size="sm" variant="outline"><Copy size={16} /></Button>
                    <Button size="sm" variant="outline"><Download size={16} /></Button>
                    <Button size="sm" variant="outline"><ArrowUpDown size={16} /></Button>
                    <Button size="sm" variant="outline" onClick={() => removePokemonFromTeam(pokemon.personalId)}><Trash2 size={16} /></Button>
                </div>
            </div>
            <div className="flex">
                <div className="w-1/3 min-w-60">
                    <div className="flex items-center">
                        <img src={pokemon.sprite} alt={pokemon.name} className="w-24 h-24 mr-4" loading="lazy" />
                        <div>
                            <Input
                                value={pokemon.nickname}
                                onChange={(e) => {
                                    const updatedPokemon = { ...pokemon, nickname: e.target.value }
                                    updatePokemon(updatedPokemon)
                                }}
                                className="text-lg font-bold mb-2"
                            />
                            <div className="flex space-x-2">
                                {pokemon.typings.map(typings => (
                                    <span
                                        key={typings.name}
                                        className="px-2 py-1 rounded-full text-xs font-semibold"
                                        style={{ backgroundColor: typeColors[typings.name], color: 'white' }}
                                    >
                                        {typings.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <Label>Pokémon</Label>
                        <Input value={pokemon.name} readOnly className="bg-gray-100" />
                    </div>
                    <div className="mt-2">
                        <Label>Item</Label>
                        <Select onValueChange={(value) => updatePokemon({ ...pokemon, item: value })}>
                            <SelectTrigger id="item-select" className="item-select">
                                <SelectValue placeholder={pokemon.item} />
                            </SelectTrigger>
                            <SelectContent>
                                {items.map(item => (
                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mt-2">
                        <Label>Ability</Label>
                        <Select onValueChange={(value) => {
                            const newAbility = pokemon.abilities.find(ability => ability.name == value)
                            if (newAbility) {
                                updatePokemon({ ...pokemon, ability: newAbility })
                            }
                        }}>
                            <SelectTrigger id="ability-select" className="ability-select">
                                <SelectValue placeholder={pokemon.ability.name} />
                            </SelectTrigger>
                            <SelectContent>
                                {pokemon.abilities.map(ability => (
                                    <SelectItem key={ability.id} value={ability.name}>{ability.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="w-1/3 min-w-60 px-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label>Level</Label>
                            <Input
                                type="number"
                                value={pokemon.level}
                                onChange={(e) => {
                                    const updatedPokemon = { ...pokemon, level: parseInt(e.target.value) }
                                    updatePokemon(updatedPokemon)
                                }}
                                min={1}
                                max={100}
                            />
                        </div>
                        <div>
                            <Label>Gender</Label>
                            <Select onValueChange={(value) => updatePokemon({ ...pokemon, gender: value })}>
                                <SelectTrigger id="gender-select" className="gender-select">
                                    <SelectValue placeholder={pokemon.gender} />
                                </SelectTrigger>
                                <SelectContent>
                                    {genders.map(gender => (
                                        <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="mt-2">
                        <Label>Moves</Label>
                        {[0, 1, 2, 3].map((index) => (
                            <Select key={index} value={pokemon.selectedMoves[index]?.name || ''} onValueChange={(value) => {
                                const newMove = pokemon.moves.find(move => move.name == value)
                                if (newMove) {
                                    const newMoves = [...pokemon.selectedMoves]
                                    newMoves[index] = newMove
                                    const updatedPokemon = { ...pokemon, selectedMoves: newMoves }
                                    updatePokemon(updatedPokemon);
                                }
                            }}>
                                <SelectTrigger id="move-select" className="mt-1">
                                    <SelectValue placeholder={pokemon.selectedMoves[index]?.name || ''} />
                                </SelectTrigger>
                                <SelectContent>
                                    {pokemon.moves.map(move => (
                                        <SelectItem key={move.id} value={move.name}>
                                            {move.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ))}
                    </div>
                </div>
                <div className="w-1/3 min-w-60">
                    <Label>Stats</Label>
                    <div onClick={() => {
                        setSelectedPokemon(pokemon)
                        setView('detail')
                    }}>
                        {Object.entries(derivedStats).map(([stat, value]) => (
                            <div key={stat} className="flex items-center mt-1">
                                <span className="w-10 text-right mr-10">{statAbbreviations[stat as keyof Pokemon['baseStats']]}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${(value / 714) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="w-10 text-right ml-2">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}