import { Card, CardContent } from "@/components/ui/card"
import { Pokemon } from '@/app//types'

interface PokemonAbilityTabProps {
    pokemon: Pokemon
    updatePokemon: (pokemon: Pokemon) => void
    setView: (view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList') => void
    setSelectedMoveSlot: (moveslot: number) => void
}

export default function PokemonAbilityComponent({ pokemon, updatePokemon, setView, setSelectedMoveSlot }: PokemonAbilityTabProps) {
    if(!pokemon.basePokemon){
        return (<div></div>)
    }
    return (
        <div>
            <Card>
                <CardContent>
                    <div className="mt-6">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-zinc-400">
                                <tr>
                                    <th className="p-2 text-left">Ability</th>
                                    <th className="p-2 text-left">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pokemon.basePokemon.abilities
                                    .filter(ability => !ability.isHidden)
                                    .map((ability, index) => (
                                        <tr
                                            key={`ability-${ability.id}`}
                                            className={`cursor-pointer hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                            onClick={() => {
                                                updatePokemon({ ...pokemon, ability })
                                                setSelectedMoveSlot(0)
                                                setView("moveTab")
                                            }}
                                        >
                                            <td className="p-2 flex items-center">
                                                {ability.name}
                                            </td>
                                            <td className="p-2">
                                                {ability.description}
                                            </td>
                                        </tr>
                                    ))}

                                {pokemon.basePokemon.abilities.some(ability => ability.isHidden) && (
                                    <tr className="bg-zinc-200">
                                        <td colSpan={2} className="p-2 font-semibold">
                                            Hidden Abilities
                                        </td>
                                    </tr>
                                )}

                                {pokemon.basePokemon.abilities
                                    .filter(ability => ability.isHidden)
                                    .map((ability, index) => (
                                        <tr
                                            key={`ability-${ability.id}`}
                                            className={`cursor-pointer hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                            onClick={() => {
                                                updatePokemon({ ...pokemon, ability })
                                                setSelectedMoveSlot(0)
                                                setView("moveTab")
                                            }}
                                        >
                                            <td className="p-2 flex items-center">
                                                {ability.name}
                                            </td>
                                            <td className="p-2">
                                                {ability.description}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}