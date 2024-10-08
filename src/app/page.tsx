"use client"

import React, { useState, useEffect } from 'react'
import TeamOverview from '@/components/teamOverview'
import PokemonList from '@/components/pokemonList'
import PokemonDetail from '@/components/pokemonStatTab'
import TeamAnalysis from '@/components/teamAnalysis'
import TeamList from '@/components/teamList'
import { Nature, Pokemon, BasePokemon, Team, Typing } from './types'

export default function PokemonTeamBuilder() {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([])

    const [teams, SetTeams] = useState<Team[]>([])
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
    const [view, setView] = useState<'list' | 'detail' | 'team' | 'teamList'>('teamList')
    const [loading, setLoading] = useState(false)
    const [genders, setGenders] = useState<string[]>([])
    const [natures, setNatures] = useState<Nature[]>([])
    const [typings, setTypings] = useState<Typing[]>([])
    const [items, setItems] = useState<string[]>([])

    const [offset, setOffset] = useState<number>(0);
    const pokemonFetchLimit = 1400;

    useEffect(() => {
        fetchGenders();
        fetchNatures();
        fetchTypings();
        fetchItems();
        fetchPokemonList(offset);
        SetTeams(getTeamsFromLocalStorage)
    }, []);

    const getTeamsFromLocalStorage = (): Team[] => {
        const storedTeams = localStorage.getItem("teams");

        if (storedTeams) {
            try {
                return JSON.parse(storedTeams) as Team[];
            } catch (error) {
                console.error("Error parsing teams from localStorage:", error);
                return [];
            }
        }
        return [];
    };

    const fetchPokemonList = async (offset: number) => {
        try {
            setLoading(true)
            const response = await fetch(`https://localhost:7010/Pokemon?offset=${offset}&limit=${pokemonFetchLimit}`)
            const data = await response.json()
            const detailedPokemonList = await Promise.all(
                data.map((pokemon: BasePokemon) => ({
                    id: pokemon.id,
                    name: pokemon.name,
                    typings: pokemon.typings.map(typing => typing),
                    abilities: pokemon.abilities.map(ability => ability),
                    baseStats: pokemon.baseStats,
                    moves: pokemon.moves.map(move => move),
                    sprite: pokemon.sprite
                })));

            const newPokemonList = detailedPokemonList.filter(pokemon =>
                !pokemonList.some(existingPokemon => existingPokemon.id === pokemon.id)
            );

            setPokemonList(prevList => [...prevList, ...newPokemonList])
            console.log("offset: " + offset)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching Pokemon list:', error)
            setLoading(false)
        }
    }

    const fetchGenders = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/gender')
            const data = await response.json()
            setGenders(data.results.map((gender: any) => gender.name))
        } catch (error) {
            console.error('Error fetching genders:', error)
        }
    }

    const fetchNatures = async () => {
        try {
            const response = await fetch('https://localhost:7010/Nature');
            const data = await response.json();
            const detailedNatures = await Promise.all(
                data.map((natureResponse: Nature) => ({
                    name: natureResponse.name,
                    up: natureResponse.up,
                    down: natureResponse.down,
                }))
            );
            setNatures(detailedNatures);
        } catch (error) {
            console.error('Error fetching natures:', error);
        }
    };

    const fetchTypings = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/type');
            const data = await response.json();

            const typeUrls = data.results.map((type: any) => type.url);

            const typings = await Promise.all(
                typeUrls.map(async (url: string) => {
                    const typeResponse = await fetch(url);
                    const typeData = await typeResponse.json();

                    const typing: Typing = {
                        id: typeData.id,
                        name: typeData.name,
                        weaknesses: typeData.damage_relations.double_damage_from.map((type: any) => ({
                            id: type.id,
                            name: type.name,
                            weaknesses: [],
                            resistances: [],
                            immunities: []
                        })),
                        resistances: typeData.damage_relations.half_damage_from.map((type: any) => ({
                            id: type.id,
                            name: type.name,
                            weaknesses: [],
                            resistances: [],
                            immunities: []
                        })),
                        immunities: typeData.damage_relations.no_damage_from.map((type: any) => ({
                            id: type.id,
                            name: type.name,
                            weaknesses: [],
                            resistances: [],
                            immunities: []
                        }))
                    };

                    return typing;
                })
            );

            setTypings(typings);
        } catch (error) {
            console.error('Error fetching types:', error);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/item?limit=1000')
            const data = await response.json()
            setItems(data.results.map((item: any) => item.name))
        } catch (error) {
            console.error('Error fetching items:', error)
        }
    }

    const getMaxPersonalId = (): number => {
        const allPersonalIds = teams.flatMap(team => team.pokemons.map(pokemon => pokemon.personalId));
        return allPersonalIds.length > 0 ? Math.max(...allPersonalIds) : 0;
    };

    const addPokemonToTeam = (pokemon: BasePokemon) => {
        if (selectedTeam && selectedTeam.pokemons.length < 6) {
            var newHighestPersonalId = getMaxPersonalId() + 1
            const detailedPokemon: Pokemon = {
                ...pokemon,
                personalId: newHighestPersonalId,
                nickname: pokemon.name,
                level: 100,
                gender: 'male',
                item: '',
                nature: natures[0],
                ability: pokemon.abilities[0],
                selectedMoves: [],
                evs: {
                    hp: 0,
                    attack: 0,
                    defense: 0,
                    specialAttack: 0,
                    specialDefense: 0,
                    speed: 0
                },
                ivs: {
                    hp: 31,
                    attack: 31,
                    defense: 31,
                    specialAttack: 31,
                    specialDefense: 31,
                    speed: 31
                }
            }
            setSelectedPokemon(detailedPokemon)
            const newTeamPokemons = [...selectedTeam.pokemons, detailedPokemon]
            _setSelectedTeam({ ...selectedTeam, pokemons: newTeamPokemons })
            setView('detail')
        }
    }

    const removePokemonFromTeam = (pokemonId: number) => {
        if (selectedTeam) {
            const newTeamPokemons = selectedTeam.pokemons.filter(p => p.personalId !== pokemonId)
            _setSelectedTeam({ ...selectedTeam, pokemons: newTeamPokemons })
            setView('team')
        }
    }

    const updateSelectedPokemon = (updatedPokemon: Pokemon) => {
        if (selectedTeam) {
            setSelectedPokemon(updatedPokemon)
            const newTeamPokemons = selectedTeam.pokemons.map(p => p.personalId === updatedPokemon.personalId ? updatedPokemon : p)
            _setSelectedTeam({ ...selectedTeam, pokemons: newTeamPokemons })
        }
    }

    const _setSelectedTeam = (team: Team) => {
        setSelectedTeam(team)
        const newTeams = teams.map(t => t.id === team.id ? team : t)
        SetTeams(newTeams)
        localStorage.setItem("teams", JSON.stringify(teams))
    }

    const addTeam = (team: Team) => {
        SetTeams([...teams, team])
        setSelectedTeam(team)
        setView('list')
        localStorage.setItem("teams", JSON.stringify(teams))
    }

    return (
        <div>
            {view === 'teamList' && (
                <div className="w-full bg-zinc-200">
                    <TeamList
                        teams={teams}
                        addTeam={addTeam}
                        setSelectedTeam={_setSelectedTeam}
                        setView={setView}
                        loading={loading}
                    />
                </div>
            )}
            {view !== 'teamList' && (
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="w-full xl:w-3/5 space-y-4 m-4">
                        {view === 'list' && selectedTeam && (
                            <PokemonList
                                pokemonList={pokemonList}
                                addPokemonToTeam={addPokemonToTeam}
                                setView={setView}
                                loading={loading}
                            />
                        )}
                        {view === 'detail' && selectedTeam && selectedPokemon && (
                            <PokemonDetail
                                pokemon={selectedPokemon}
                                updatePokemon={updateSelectedPokemon}
                                removePokemonFromTeam={removePokemonFromTeam}
                                setSelectedPokemon={setSelectedPokemon}
                                setView={setView}
                                genders={genders}
                                natures={natures}
                                items={items}
                            />
                        )}
                        {view === 'team' && selectedTeam && (
                            <TeamOverview
                                team={selectedTeam}
                                setSelectedTeam={_setSelectedTeam}
                                updatePokemon={updateSelectedPokemon}
                                removePokemonFromTeam={removePokemonFromTeam}
                                setSelectedPokemon={setSelectedPokemon}
                                setView={setView}
                                genders={genders}
                                items={items}
                            />
                        )}
                    </div>
                    {selectedTeam && typings && (
                        <div className="w-full xl:w-2/5 bg-zinc-400 space-y-4">
                            <TeamAnalysis
                                team={selectedTeam}
                                typings={typings}
                            />
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}