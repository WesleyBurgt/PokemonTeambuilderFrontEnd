import React from 'react'
import { Button } from "@/components/ui/button"
import PokemonComponent from '@/components/pokemonComponent'
import { ChevronLeft } from 'lucide-react'
import { Item, Nature, Pokemon } from '@/app//types'
import { ScrollArea } from './ui/scroll-area'
import PokemonStatComponent from './pokemonStatComponent'
import PokemonItemComponent from './pokemonItemComponent'
import PokemonAbilityComponent from './pokemonAbilityComponent'
import PokemonMoveComponent from './pokemonMoveComponent'

interface PokemonTabProps {
    pokemon: Pokemon
    updatePokemon: (pokemon: Pokemon) => void
    removePokemonFromTeam: (id: number) => void
    setSelectedPokemon: (pokemon: Pokemon) => void
    setSelectedMoveSlot: (moveslot: number) => void
    setView: (view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList') => void
    genders: string[]
    natures: Nature[]
    items: Item[]
    selectedMoveSlot: number | null
    view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList'
}

export default function PokemonTab({ pokemon, updatePokemon, removePokemonFromTeam, setSelectedPokemon, setSelectedMoveSlot, setView, genders, natures, items, selectedMoveSlot, view }: PokemonTabProps) {
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
            />
            <ScrollArea className="scroll-area-tab pr-2 mt-4">
                {view === 'statTab' && (
                    <PokemonStatComponent
                        pokemon={pokemon}
                        updatePokemon={updatePokemon}
                        natures={natures}
                    />
                )}
                {view === 'itemTab' && (
                    <PokemonItemComponent
                        pokemon={pokemon}
                        updatePokemon={updatePokemon}
                        items={items}
                    />
                )}
                {view === 'abilityTab' && (
                    <PokemonAbilityComponent
                        pokemon={pokemon}
                        updatePokemon={updatePokemon}
                    />
                )}
                {view === 'moveTab' && selectedMoveSlot != null && (
                    <PokemonMoveComponent
                        pokemon={pokemon}
                        updatePokemon={updatePokemon}
                        moveSlotIndex={selectedMoveSlot}
                    />
                )}
            </ScrollArea>
        </div>
    )
}