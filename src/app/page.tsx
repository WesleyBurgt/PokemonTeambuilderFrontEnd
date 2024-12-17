"use client"

import React, { useState, useEffect } from 'react'
import TeamOverview from '@/components/teamOverview'
import PokemonList from '@/components/pokemonList'
import TeamAnalysis from '@/components/teamAnalysis'
import TeamList from '@/components/teamList'
import { Typing, Nature, Item, Pokemon, BasePokemon, Team } from './types'
import PokemonTab from '@/components/pokemonTab'
import { fetchGenders, fetchItems, fetchNatures, fetchPokemonList, fetchTypings, getTeams, addPokemonToTeam, deletePokemonFromTeam, createTeam, setTeamName, updatePokemonFromTeam } from './api-client'
import LoginPage from './pages/LoginPage'
import { getAccessToken } from "@/utils/tokenUtils";
import LogoutButton from '@/components/LogoutButton'

export default function PokemonTeamBuilder() {
    const [pokemonList, setPokemonList] = useState<BasePokemon[]>([])
    const [teams, SetTeams] = useState<Team[]>([])
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
    const [selectedMoveSlot, SetSelectedMoveSlot] = useState<number | null>(null)
    const [view, setView] = useState<'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList'>('teamList')
    const [genders, setGenders] = useState<string[]>([])
    const [natures, setNatures] = useState<Nature[]>([])
    const [typings, setTypings] = useState<Typing[]>([])
    const [items, setItems] = useState<Item[]>([])
    const pokemonFetchLimit = 30;
    const [offset, setOffset] = useState<number>(0)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        checkAuthentication
    }, []);

    const checkAuthentication = () => {
        const accessToken = getAccessToken();
        setIsAuthenticated(!!accessToken);
    }

    useEffect(() => {
        fetchGenders(setGenders);
        fetchNatures(setNatures);
        fetchTypings(setTypings);
        fetchItems(setItems);
        updatePokemonList();
        if (isAuthenticated) {
            getTeams(SetTeams);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        updatePokemonList()
    }, [offset, isAuthenticated])

    const updatePokemonList = async () => {
        const result = await fetchPokemonList(offset, pokemonFetchLimit)
        if (result?.pokemons) {
            const newPokemonList = result.pokemons.filter(pokemon =>
                !pokemonList.some(existingPokemon => existingPokemon.id === pokemon.id)
            )
            setPokemonList([...pokemonList, ...newPokemonList]);

            if (offset + pokemonFetchLimit < result.count) {
                setOffset(offset + pokemonFetchLimit)
            }
        }
    }

    const setSelectedTeamName = async (newName: string): Promise<boolean> => {
        if (!selectedTeam) return false;
        checkAuthentication();

        if (!isAuthenticated) return false;
        return new Promise((resolve) => {
            setTeamName(selectedTeam, newName, (updatedTeam) => {
                if (updatedTeam.name === newName) {
                    _setSelectedTeam(updatedTeam);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    };

    const addPokemonToSelectedTeam = (pokemon: BasePokemon) => {
        if (selectedTeam) {
            checkAuthentication();

            if (isAuthenticated) {
                addPokemonToTeam(selectedTeam, pokemon.id, _setSelectedTeam)
                    .then((newPokemon) => {
                        if (newPokemon != undefined) {
                            setSelectedPokemon(newPokemon);
                            setView('itemTab')
                        }
                    });
            }
        }
    };

    const deletePokemonFromSelectedTeam = (pokemon: Pokemon) => {
        if (selectedTeam) {
            checkAuthentication();

            if (isAuthenticated) {
                deletePokemonFromTeam(selectedTeam, pokemon, (updatedTeam) => {
                    _setSelectedTeam(updatedTeam);
                    if (updatedTeam.pokemons && !updatedTeam.pokemons.some((p) => p.personalId === pokemon.personalId)) {
                        setView('team');
                    }
                });
            }
        }
    };

    const updatePokemonFromSelectedTeam = (newPokemon: Pokemon) => {
        if (selectedTeam) {
            checkAuthentication();

            if (isAuthenticated) {
                updatePokemonFromTeam(selectedTeam, newPokemon, (updatedTeam) => {
                    _setSelectedTeam(updatedTeam);
                    setSelectedPokemon(newPokemon);
                });
            }
        }
    };

    const _setSelectedTeam = (team: Team) => {
        setSelectedTeam(team)
        const newTeams = teams.map(t => t.id === team.id ? team : t)
        SetTeams(newTeams)
    }

    const addTeam = (team: Team) => {
        createTeam(teams, SetTeams)
        setSelectedTeam(team)
        setView('list')
    }

    const resetCache = () => {
        SetTeams([]);
        setSelectedTeam(null);
        setSelectedPokemon(null);
        SetSelectedMoveSlot(null);
        setView('teamList');
    }

    const hasPrivateCache = () => {
        if (teams.length > 0 || selectedPokemon != null || selectedPokemon != null || selectedMoveSlot != null) {
            return true;
        }
        return false;
    }

    if (!isAuthenticated) {
        if (hasPrivateCache()) {
            resetCache();
        }
        return <LoginPage
            setIsAuthenticated={setIsAuthenticated}
        />;
    }

    return (
        <div>
            {view === 'teamList' && (
                <div className="w-full relative bg-zinc-200">
                    <div className="absolute right-0 m-3 z-10">
                        <LogoutButton
                            setIsAuthenticated={setIsAuthenticated}
                        />
                    </div>
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
                                addPokemonToTeam={addPokemonToSelectedTeam}
                                setView={setView}
                            />
                        )}
                        {(view === 'statTab' || view === 'itemTab' || view === 'abilityTab' || (view === 'moveTab' && selectedMoveSlot != null)) && selectedTeam && selectedPokemon && (
                            <PokemonTab
                                pokemon={selectedPokemon}
                                updatePokemon={updatePokemonFromSelectedTeam}
                                deletePokemonFromTeam={deletePokemonFromSelectedTeam}
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
                                setSelectedTeamName={setSelectedTeamName}
                                updatePokemon={updatePokemonFromSelectedTeam}
                                deletePokemonFromTeam={deletePokemonFromSelectedTeam}
                                setSelectedPokemon={setSelectedPokemon}
                                setSelectedMoveSlot={SetSelectedMoveSlot}
                                view={view}
                                setView={setView}
                                genders={genders}
                            />
                        )}
                    </div>
                    {selectedTeam && typings && (
                        <div className="w-full relative xl:w-2/5 bg-zinc-400 space-y-4">
                            <div className="absolute right-0 m-3 z-10">
                                <LogoutButton
                                    setIsAuthenticated={setIsAuthenticated}
                                />
                            </div>
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