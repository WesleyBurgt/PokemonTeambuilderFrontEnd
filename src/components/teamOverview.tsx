import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PokemonComponent from '@/components/pokemonComponent'
import { ChevronLeft } from 'lucide-react'
import { Pokemon, Team } from '@/app//types'
import { ScrollArea } from './ui/scroll-area'

interface TeamOverviewProps {
    team: Team
    setSelectedTeamName: (newName: string) => Promise<boolean>
    updatePokemon: (pokemon: Pokemon) => void
    deletePokemonFromTeam: (pokemon: Pokemon) => void
    setSelectedPokemon: (pokemon: Pokemon) => void
    setSelectedMoveSlot: (moveslot: number) => void
    view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList'
    setView: (view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList') => void
    genders: string[]
}

export default function TeamOverview({ team, setSelectedTeamName, updatePokemon, deletePokemonFromTeam, setSelectedPokemon, setSelectedMoveSlot, view, setView, genders }: TeamOverviewProps) {
    const [name, setName] = useState(team.name);
    const [previousName, setPreviousName] = useState(team.name);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
    
        const success = await setSelectedTeamName(newName);
        if (success) {
            setPreviousName(newName);
            setName(newName);
        } else {
            setName(previousName);
        }
    };
    

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <div className="flex">
                    <Button onClick={() => setView('teamList')}><ChevronLeft className="mr-2" />Team list</Button>
                    <Input
                        value={name}
                        onChange={handleChange}
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
                            deletePokemonFromTeam={deletePokemonFromTeam}
                            setSelectedPokemon={setSelectedPokemon}
                            selectedMoveSlot={null}
                            setSelectedMoveSlot={setSelectedMoveSlot}
                            view={view}
                            setView={setView}
                            genders={genders}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}