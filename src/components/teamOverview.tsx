import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PokemonComponent from '@/components/pokemonComponent'
import { ChevronLeft } from 'lucide-react'
import { Pokemon, Team } from '@/app//types'
import { ScrollArea } from './ui/scroll-area'

interface TeamOverviewProps {
    team: Team
    setSelectedTeam: (team: Team) => void
    updatePokemon: (pokemon: Pokemon) => void
    removePokemonFromTeam: (id: number) => void
    setSelectedPokemon: (pokemon: Pokemon) => void
    setSelectedMoveSlot: (moveslot: number) => void
    setView: (view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList') => void
    genders: string[]
}

export default function TeamOverview({ team, setSelectedTeam, updatePokemon, removePokemonFromTeam, setSelectedPokemon, setSelectedMoveSlot, setView, genders }: TeamOverviewProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <div className="flex">
                    <Button onClick={() => setView('teamList')}><ChevronLeft className="mr-2" />Team list</Button>
                    <Input
                        value={team.name}
                        onChange={(e) => setSelectedTeam({ ...team, name: e.target.value })
                        }
                        className="text-lg ml-4 font-bold w-fit"
                    />
                </div>
                <Button onClick={() => setView('list')}>Add Pokémon</Button>
            </div>
            <ScrollArea className="scroll-area pr-2">
                <div className="grid gap-y-4">
                    {team.pokemons.map((pokemon) => (
                        <PokemonComponent
                            key={pokemon.personalId}
                            pokemon={pokemon}
                            updatePokemon={updatePokemon}
                            removePokemonFromTeam={removePokemonFromTeam}
                            setSelectedPokemon={setSelectedPokemon}
                            setSelectedMoveSlot={setSelectedMoveSlot}
                            setView={setView}
                            genders={genders}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}