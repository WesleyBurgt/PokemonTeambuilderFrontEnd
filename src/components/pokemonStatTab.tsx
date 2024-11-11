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
import { Card, CardContent } from "@/components/ui/card"
import PokemonComponent from '@/components/pokemonComponent'
import { ChevronLeft } from 'lucide-react'
import { Item, Nature, Pokemon } from '@/app//types'
import { ScrollArea } from './ui/scroll-area'

interface PokemonStatTabProps {
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

export default function PokemonStatTab({ pokemon, updatePokemon, removePokemonFromTeam, setSelectedPokemon, setSelectedMoveSlot, setView, genders, natures, items }: PokemonStatTabProps) {
    const derivedStats = calculateDerivedStats(pokemon);
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
                        <div className="my-8">
                            {Object.entries(derivedStats).map(([stat, value]) => (
                                <div key={stat} className="flex items-center mt-1">
                                    <span className="w-20 text-right mr-10">{stat}</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${(value / 714) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="w-10 text-right ml-4">{value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Label>EVs</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(pokemon.evs).map(([stat, value]) => (
                                    <div key={stat}>
                                        <Label htmlFor={`ev-${stat}`}>{stat}</Label>
                                        <Input
                                            id={`ev-${stat}`}
                                            type="number"
                                            value={value}
                                            onChange={(e) => {
                                                const newEvs = { ...pokemon.evs, [stat]: parseInt(e.target.value) }
                                                updatePokemon({ ...pokemon, evs: newEvs })
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
                                {Object.entries(pokemon.ivs).map(([stat, value]) => (
                                    <div key={stat}>
                                        <Label htmlFor={`iv-${stat}`}>{stat}</Label>
                                        <Input
                                            id={`iv-${stat}`}
                                            type="number"
                                            value={value}
                                            onChange={(e) => {
                                                const newIvs = { ...pokemon.ivs, [stat]: parseInt(e.target.value) }
                                                updatePokemon({ ...pokemon, ivs: newIvs })
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
                                    <SelectValue placeholder={pokemon.nature.name} />
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
            </ScrollArea>
        </div>
    )
}