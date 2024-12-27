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

const statAbbreviations: { [key: string]: string } = {
    hp: 'HP',
    attack: 'Atk',
    defense: 'Def',
    specialAttack: 'SpA',
    specialDefense: 'SpD',
    speed: 'Spe',
};

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

function calculateTotalEVs(evs: Pokemon['eVs']): number {
    return Object.values(evs).reduce((sum, ev) => sum + ev, 0);
}

export default function PokemonStatComponent({ pokemon, updatePokemon, natures }: PokemonStatTabProps) {
    const derivedStats = calculateDerivedStats(pokemon);
    const totalEVs = calculateTotalEVs(pokemon.eVs);
    const remainingEVs = 510 - totalEVs;

    if (!pokemon.basePokemon) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <Card>
                <CardContent>
                    <div className="mt-4 w-full">
                        <div className="grid grid-cols-[60px_50px_1fr_80px_200px_60px_80px] gap-2 mb-2 text-sm w-full">
                            <div></div>
                            <div>Base</div>
                            <div></div>
                            <div className="text-center">EVs</div>
                            <div></div>
                            <div className="text-center">IVs</div>
                            <div></div>
                        </div>
                        {Object.entries(pokemon.basePokemon.baseStats).map(([stat, baseValue]) => {
                            const evValue = pokemon.eVs[stat as keyof typeof pokemon.eVs];
                            const ivValue = pokemon.iVs[stat as keyof typeof pokemon.iVs];
                            const totalValue = derivedStats[stat as keyof typeof derivedStats];
                            
                            return (
                                <div key={stat} className="grid grid-cols-[60px_50px_1fr_80px_200px_60px_80px] items-center gap-2 mb-2 w-full">
                                    <div className="text-right">
                                        {statAbbreviations[stat as keyof typeof statAbbreviations]}
                                    </div>

                                    <div className="text-right">
                                        {baseValue}
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="h-2.5 rounded-full"
                                            style={{ 
                                                width: `${(totalValue / 714) * 100}%`,
                                                backgroundColor: `hsl(${(totalValue / 714) * 180}, 85%, 45%)`
                                            }}
                                        ></div>
                                    </div>

                                    <div className="relative">
                                        <Input
                                            type="text"
                                            value={evValue}
                                            onKeyDown={(e) => {
                                                if (e.key === '+' || e.key === '-') {
                                                    e.preventDefault();
                                                    
                                                    const otherNatureStat = e.key === '+' ? 
                                                        pokemon.nature.down : 
                                                        pokemon.nature.up;

                                                    const newNature = natures.find(nature => 
                                                        (e.key === '+' && nature.up === stat && nature.down === otherNatureStat) ||
                                                        (e.key === '-' && nature.down === stat && nature.up === otherNatureStat)
                                                    );

                                                    if (newNature) {
                                                        const updatedPokemon = { ...pokemon, nature: newNature };
                                                        updatePokemon(updatedPokemon);
                                                    }
                                                    return;
                                                }
                                            }}
                                            onChange={(e) => {
                                                const input = e.target.value;
                                                
                                                if (input === '' || isNaN(parseInt(input))) {
                                                    const newEvs = { ...pokemon.eVs, [stat]: 0 };
                                                    const updatedPokemon = { ...pokemon, eVs: newEvs };
                                                    updatePokemon(updatedPokemon);
                                                    return;
                                                }

                                                const newValue = Math.min(252, Math.max(0, parseInt(input)));
                                                const otherEVs = Object.entries(pokemon.eVs)
                                                    .filter(([key]) => key !== stat)
                                                    .reduce((sum, [_, value]) => sum + value, 0);
                                                
                                                const maxPossibleValue = Math.min(newValue, 510 - otherEVs);
                                                const newEvs = { ...pokemon.eVs, [stat]: maxPossibleValue };
                                                const updatedPokemon = { ...pokemon, eVs: newEvs };
                                                updatePokemon(updatedPokemon);
                                            }}
                                            className={`w-full ${
                                                pokemon.nature.up === stat ? 'text-red-500' : 
                                                pokemon.nature.down === stat ? 'text-blue-500' : ''
                                            }`}
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                            {pokemon.nature.up === stat && (
                                                <span className="text-red-500">+</span>
                                            )}
                                            {pokemon.nature.down === stat && (
                                                <span className="text-blue-500">-</span>
                                            )}
                                        </span>
                                    </div>

                                    <div>
                                        <input
                                            type="range"
                                            value={evValue}
                                            onChange={(e) => {
                                                const newValue = parseInt(e.target.value);
                                                const otherEVs = Object.entries(pokemon.eVs)
                                                    .filter(([key]) => key !== stat)
                                                    .reduce((sum, [_, value]) => sum + value, 0);
                                                
                                                const maxPossibleValue = Math.min(newValue, 510 - otherEVs);
                                                const newEvs = { ...pokemon.eVs, [stat]: maxPossibleValue };
                                                updatePokemon({ ...pokemon, eVs: newEvs });
                                            }}
                                            min={0}
                                            max={252}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <Input
                                            type="number"
                                            value={ivValue}
                                            onChange={(e) => {
                                                const newIvs = { ...pokemon.iVs, [stat]: Math.min(31, Math.max(0, parseInt(e.target.value) || 0)) }
                                                updatePokemon({ ...pokemon, iVs: newIvs })
                                            }}
                                            min={0}
                                            max={31}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="text-right">
                                        {totalValue}
                                    </div>
                                </div>
                            );
                        })}
                        
                        <div className="mt-4 text-sm flex justify-end items-center gap-2">
                            <span>EVs Remaining:</span>
                            <span className={`font-bold ${remainingEVs < 0 ? 'text-red-500' : ''}`}>
                                {remainingEVs}
                            </span>
                            <span className="text-gray-500">/ 510</span>
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