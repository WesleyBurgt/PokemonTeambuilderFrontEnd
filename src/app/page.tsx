"use client"

import React, { useState, useEffect } from 'react'
import TeamOverview from '@/components/teamOverview'
import PokemonList from '@/components/pokemonList'
import TeamAnalysis from '@/components/teamAnalysis'
import TeamList from '@/components/teamList'
import { Typing, Nature, Item, Pokemon, BasePokemon, Team } from './types'
import PokemonTab from '@/components/pokemonTab'

export default function PokemonTeamBuilder() {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
    const [teams, SetTeams] = useState<Team[]>([])
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
    const [selectedMoveSlot, SetSelectedMoveSlot] = useState<number | null>(null)
    const [view, setView] = useState<'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList'>('teamList')
    const [genders, setGenders] = useState<string[]>([])
    const [natures, setNatures] = useState<Nature[]>([])
    const [typings, setTypings] = useState<Typing[]>([])
    const [items, setItems] = useState<Item[]>([])
    const pokemonFetchLimit = 50;
    const offset = 0;

    const apiConnectionStringBase = `${process.env.NEXT_PUBLIC_DATABASE_URL}/api`;

    useEffect(() => {
        fetchGenders();
        fetchNatures();
        fetchTypings();
        fetchItems();
        SetTeams(getTeamsFromLocalStorage());
        fetchPokemonList(offset);
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
            const response = await fetch(`${apiConnectionStringBase}/BasePokemon/List?offset=${offset}&limit=${pokemonFetchLimit}`);
            const data = await response.json();
            const detailedPokemonList = await Promise.all(
                data.results.map((pokemon: BasePokemon) => ({
                    id: pokemon.id,
                    name: pokemon.name,
                    typings: pokemon.typings.map(typing => typing),
                    abilities: pokemon.abilities.map(ability => ability),
                    baseStats: pokemon.baseStats,
                    moves: pokemon.moves.map(move => move),
                    sprite: pokemon.sprite
                }))
            );
    
            const newPokemonList = detailedPokemonList.filter(pokemon =>
                !pokemonList.some(existingPokemon => existingPokemon.id === pokemon.id)
            );
    
            setPokemonList(prevList => [...prevList, ...newPokemonList]);
    
            if (data.count > offset + pokemonFetchLimit) {
                fetchPokemonList(offset + pokemonFetchLimit);
            }
        } catch (error) {
            console.error('Error fetching Pokemon list:', error);
        }
    };
    

    const fetchGenders = async () => {
        try {
            const response = await fetch(`${apiConnectionStringBase}/Gender/List`)
            const data = await response.json()
            setGenders(data.results.map((gender: string) => gender))
        } catch (error) {
            console.error('Error fetching genders:', error)
        }
    }

    const fetchNatures = async () => {
        try {
            const response = await fetch(`${apiConnectionStringBase}/Nature/List`);
            const data = await response.json();
            const detailedNatures = await Promise.all(
                data.results.map((natureResponse: Nature) => ({
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
            const response = await fetch(`${apiConnectionStringBase}/Typing/List`);
            const data = await response.json();

            const typings = await Promise.all(
                data.results.map((typingResponse: Typing) => {
                    const typing: Typing = {
                        id: typingResponse.id,
                        name: typingResponse.name,
                        weaknesses: typingResponse.weaknesses,
                        resistances: typingResponse.resistances,
                        immunities: typingResponse.immunities
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
            const response = await fetch(`${apiConnectionStringBase}/Item/List`)
            const data = await response.json()

            const items = await Promise.all(
                data.results.map((itemResponse: Item) => {
                    const item: Item = {
                        id: itemResponse.id,
                        name: itemResponse.name,
                        description: itemResponse.description,
                        image: itemResponse.image
                    };

                    return item;
                })
            );

            setItems(items);
        } catch (error) {
            console.error('Error fetching items:', error)
        }
    };

    const getMaxPersonalId = (): number => {
        const allPersonalIds = teams.flatMap(team => team.pokemons.map(pokemon => pokemon.personalId));
        return allPersonalIds.length > 0 ? Math.max(...allPersonalIds) : 0;
    };

    const addPokemonToTeam = (pokemon: BasePokemon) => {
        if (selectedTeam && selectedTeam.pokemons.length < 6) {
            const newHighestPersonalId = getMaxPersonalId() + 1
            const detailedPokemon: Pokemon = {
                ...pokemon,
                personalId: newHighestPersonalId,
                nickname: pokemon.name,
                level: 100,
                gender: genders[0],
                item: null,
                nature: natures[0],
                ability: pokemon.abilities[0],
                selectedMoves: [null, null, null, null],
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
            setView('itemTab')
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
                    />
                </div>
            )}
            {view !== 'teamList' && (
                <div className="flex flex-col h-dvh xl:flex-row gap-4">
                    <div className="left-tab xl:w-3/5 space-y-4 m-4">
                        {view === 'list' && selectedTeam && (
                            <PokemonList
                                pokemonList={pokemonList}
                                addPokemonToTeam={addPokemonToTeam}
                                setView={setView}
                            />
                        )}
                        {(view === 'statTab' || view === 'itemTab' || view === 'abilityTab' || (view === 'moveTab' && selectedMoveSlot != null)) && selectedTeam && selectedPokemon && (
                            <PokemonTab
                                pokemon={selectedPokemon}
                                updatePokemon={updateSelectedPokemon}
                                removePokemonFromTeam={removePokemonFromTeam}
                                setSelectedPokemon={setSelectedPokemon}
                                setSelectedMoveSlot={SetSelectedMoveSlot}
                                setView={setView}
                                genders={genders}
                                natures={natures}
                                items={items}
                                selectedMoveSlot={selectedMoveSlot}
                                view={view}
                            />
                        )}
                        {view === 'team' && selectedTeam && (
                            <TeamOverview
                                team={selectedTeam}
                                setSelectedTeam={_setSelectedTeam}
                                updatePokemon={updateSelectedPokemon}
                                removePokemonFromTeam={removePokemonFromTeam}
                                setSelectedPokemon={setSelectedPokemon}
                                setSelectedMoveSlot={SetSelectedMoveSlot}
                                view={view}
                                setView={setView}
                                genders={genders}
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