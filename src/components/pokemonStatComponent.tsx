import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Nature, BasePokemon, Pokemon } from '@/app//types'

interface PokemonStatTabProps {
    pokemon: Pokemon
    updatePokemon: (pokemon: Pokemon) => void
    natures: Nature[]
}

function calculateDerivedStats(pokemon: Pokemon): BasePokemon['baseStats'] {
    if (!pokemon.basePokemon) {
        console.warn(`BasePokemon data is missing for Pokémon with personalId: ${pokemon.personalId}`);
        return {
            hp: 0,
            attack: 0,
            defense: 0,
            specialAttack: 0,
            specialDefense: 0,
            speed: 0,
        };
    }
    
    const level = pokemon.level;

    const calculateStat = (
        baseStat: number,
        ev: number,
        iv: number,
        natureMultiplier: number
    ): number => {
        return Math.floor(((((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5) * natureMultiplier);
    };

    const getNatureMultiplier = (stat: keyof BasePokemon['baseStats']): number => {
        if (pokemon.nature.up == stat) return 1.1;
        if (pokemon.nature.down == stat) return 0.9;
        return 1;
    };

    const derivedStats: BasePokemon['baseStats'] = {
        hp: Math.floor(((2 * pokemon.basePokemon.baseStats.hp + pokemon.iVs.hp + Math.floor(pokemon.eVs.hp / 4)) * level) / 100) + level + 10,
        attack: calculateStat(pokemon.basePokemon.baseStats.attack, pokemon.eVs.attack, pokemon.iVs.attack, getNatureMultiplier('attack')),
        defense: calculateStat(pokemon.basePokemon.baseStats.defense, pokemon.eVs.defense, pokemon.iVs.defense, getNatureMultiplier('defense')),
        specialAttack: calculateStat(pokemon.basePokemon.baseStats.specialAttack, pokemon.eVs.specialAttack, pokemon.iVs.specialAttack, getNatureMultiplier('specialAttack')),
        specialDefense: calculateStat(pokemon.basePokemon.baseStats.specialDefense, pokemon.eVs.specialDefense, pokemon.iVs.specialDefense, getNatureMultiplier('specialDefense')),
        speed: calculateStat(pokemon.basePokemon.baseStats.speed, pokemon.eVs.speed, pokemon.iVs.speed, getNatureMultiplier('speed'))
    };

    return derivedStats;
}

export default function PokemonStatComponent({ pokemon, updatePokemon, natures }: PokemonStatTabProps) {
    const derivedStats = calculateDerivedStats(pokemon);
    return (
        <div>
            <Card>
                <CardContent>
                    <div className="mt-6">
                        {Object.entries(derivedStats).map(([stat, value]) => (
                            <div key={stat} className="flex items-center mt-1">
                                <span className="w-20 text-right mr-10">{stat}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="h-2.5 rounded-full"
                                        style={{ 
                                            width: `${(value / 714) * 100}%`,
                                            backgroundColor: `hsl(${(value / 714) * 180}, 85%, 45%)`
                                        }}
                                    ></div>
                                </div>
                                <span className="w-10 text-right ml-4">{value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <Label>EVs</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(pokemon.eVs).map(([stat, value]) => (
                                <div key={stat}>
                                    <Label htmlFor={`ev-${stat}`}>{stat}</Label>
                                    <Input
                                        id={`ev-${stat}`}
                                        type="number"
                                        value={value}
                                        onChange={(e) => {
                                            const newEvs = { ...pokemon.eVs, [stat]: parseInt(e.target.value) }
                                            updatePokemon({ ...pokemon, eVs: newEvs })
                                        }}
                                        min={0}
                                        max={252}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <Label>IVs</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(pokemon.iVs).map(([stat, value]) => (
                                <div key={stat}>
                                    <Label htmlFor={`iv-${stat}`}>{stat}</Label>
                                    <Input
                                        id={`iv-${stat}`}
                                        type="number"
                                        value={value}
                                        onChange={(e) => {
                                            const newIvs = { ...pokemon.iVs, [stat]: parseInt(e.target.value) }
                                            updatePokemon({ ...pokemon, iVs: newIvs })
                                        }}
                                        min={0}
                                        max={31}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="nature">Nature</Label>
                        <Select onValueChange={(value) => {
                            const selectedNature = natures.find((nature) => nature.name === value);
                            if (selectedNature) {
                                updatePokemon({ ...pokemon, nature: selectedNature });
                            }
                        }}>
                            <SelectTrigger id="nature-select" className="nature-select">
                                <SelectValue
                                    placeholder={
                                        pokemon.nature.up && pokemon.nature.down ? `${pokemon.nature.name} (+${pokemon.nature.up}, -${pokemon.nature.down})` : pokemon.nature.name
                                    }/>                            
                                    </SelectTrigger>
                            <SelectContent>
                                {natures.map(nature => (
                                    <SelectItem key={nature.name} value={nature.name}>
                                        {nature.name}
                                        {nature.up && nature.down && ` (+${nature.up}, -${nature.down})`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}