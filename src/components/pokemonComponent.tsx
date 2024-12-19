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
import { BasePokemon, Pokemon } from '@/app//types'
import PokemonTypingComponent from './pokemonTyping'

interface ComponentProps {
    pokemon: Pokemon
    updatePokemon: (pokemon: Pokemon) => void
    deletePokemonFromTeam: (pokemon: Pokemon) => void
    setSelectedPokemon: (pokemon: Pokemon) => void
    selectedMoveSlot: number | null
    setSelectedMoveSlot: (moveslot: number) => void
    view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList'
    setView: (view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList') => void
    genders: string[]
}

const statAbbreviations: { [key in keyof BasePokemon['baseStats']]: string } = {
    hp: 'HP',
    attack: 'Atk',
    defense: 'Def',
    specialAttack: 'SpA',
    specialDefense: 'SpD',
    speed: 'Spe',
};

export function calculateDerivedStats(pokemon: Pokemon): BasePokemon['baseStats'] {
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

export default function pokemonComponent({ pokemon, updatePokemon, deletePokemonFromTeam, setSelectedPokemon, selectedMoveSlot, setSelectedMoveSlot, view, setView, genders }: ComponentProps) {
    const derivedStats = calculateDerivedStats(pokemon)
    if (!pokemon.basePokemon) {
        return (<div></div>);
    }
    return (
        <Card key={pokemon.personalId} className="p-4">
            <div className="flex justify-end mb-2">
                <div className="flex space-x-2">
                    <Button size="sm" variant="outline"><Copy size={16} /></Button>
                    <Button size="sm" variant="outline"><Download size={16} /></Button>
                    <Button size="sm" variant="outline"><ArrowUpDown size={16} /></Button>
                    <Button size="sm" variant="outline" onClick={() => deletePokemonFromTeam(pokemon)}><Trash2 size={16} /></Button>
                </div>
            </div>
            <div className="flex">
                <div className="w-1/3 min-w-60">
                    <div className="flex items-center">
                        <img src={pokemon.basePokemon.sprite} alt={pokemon.basePokemon.name} className="w-24 h-24 mr-4" loading="lazy" />
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
                                {pokemon.basePokemon.typings
                                    .sort((a, b) => a.slot - b.slot)
                                    .map(typing => (
                                        <div key={typing.typing.name}>
                                            <PokemonTypingComponent typing={typing.typing} />
                                        </div>
                                    ))}

                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <Label>Pokémon</Label>
                        <Input value={pokemon.basePokemon.name} readOnly className="bg-gray-100" />
                    </div>
                    <div className="mt-2">
                        <Label>Item</Label>
                        <Button variant='outline' className={`w-full justify-start ${(view === 'itemTab') ? 'outline outline-sky-400' : ''}`} onClick={() => {
                            setSelectedPokemon(pokemon)
                            setView('itemTab')
                        }}>
                            {pokemon.item && (<div> {
                                pokemon.item.image && (<div className='flex'>
                                    <img src={pokemon.item.image} alt={pokemon.item.name} className="w-6 h-6" loading="lazy" />
                                    <div>{pokemon.item.name}</div>
                                </div>)
                            }</div>)
                            }
                        </Button>
                    </div>
                    <div className="mt-2">
                        <Label>Ability</Label>
                        <Button variant='outline' className={`w-full justify-start ${(view === 'abilityTab') ? 'outline outline-sky-400' : ''}`} onClick={() => {
                            setSelectedPokemon(pokemon)
                            setView('abilityTab')
                        }}>
                            <div>{pokemon.ability.name}</div>
                        </Button>
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
                            <Button
                                key={`moveSlot-${index}`}
                                variant={'outline'}
                                className={`w-full justify-start my-2 ${(view === 'moveTab' && index === selectedMoveSlot) ? 'outline outline-sky-400' : ''}`}
                                onClick={() => {
                                    setSelectedPokemon(pokemon);
                                    setSelectedMoveSlot(index);
                                    setView('moveTab');
                                }}>
                                <div>
                                    {
                                        (() => {
                                            const selectedMoveId = pokemon.selectedMoves?.find(s => s?.slot === index)?.id;
                                            const move = pokemon.basePokemon?.moves?.find(m => m.id === selectedMoveId);
                                            return move ? move.name : '';
                                        })()
                                    }
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="w-1/3 min-w-60">
                    <Label>Stats</Label>
                    <Button variant={'outline'} className={`w-full h-fit ${(view === 'statTab') ? 'outline outline-sky-400' : ''}`}>
                        <div className='w-full h-full py-4' onClick={() => {
                            setSelectedPokemon(pokemon)
                            setView('statTab')
                        }}>
                            {Object.entries(derivedStats).map(([stat, value]) => (
                                <div key={stat} className="flex items-center mt-1">
                                    <span className="w-10 text-right mr-10">{statAbbreviations[stat as keyof BasePokemon['baseStats']]}</span>
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
                    </Button>
                </div>
            </div>
        </Card>
    )
}