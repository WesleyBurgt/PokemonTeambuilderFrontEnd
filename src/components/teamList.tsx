import React, { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Team } from '@/app/types';
import { ScrollArea } from './ui/scroll-area';

interface TeamListProps {
    teams: Team[];
    addTeam: (team: Team) => void;
    setSelectedTeam: (team: Team) => void;
    setView: (view: 'list' | 'statTab' | 'itemTab' | 'abilityTab' | 'moveTab' | 'team' | 'teamList') => void;
}

export default function TeamList({ teams, addTeam, setSelectedTeam, setView }: TeamListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTeams, setFilteredTeams] = useState<Team[]>(teams);

    const debouncedSearch = useMemo(
        () =>
            debounce((term: string) => {
                setFilteredTeams(
                    teams.filter(team =>
                        team.name.toLowerCase().includes(term.toLowerCase())
                    )
                );
            }, 300),
        [teams]
    );

    useEffect(() => {
        if (searchTerm) {
            debouncedSearch(searchTerm);
        } else {
            setFilteredTeams(teams);
        }
    }, [teams, searchTerm]);

    return (
        <div>
            <div className="relative border border-black">
                <Input
                    type="text"
                    placeholder="Search Teams"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <ScrollArea className="scroll-area-teams">
                <div className="flex flex-wrap font-bold">{
                    filteredTeams.map((team) => (
                        <Card key={team.id} className="p-4 m-10 w-96" onClick={() => {
                            setSelectedTeam(team);
                            setView('team');
                        }}>
                            {team.name}
                            <div className="flex flex-wrap">
                                {team.pokemons.map((pokemon) => (
                                    <div key={pokemon.personalId}>
                                        <img src={pokemon.basePokemon?.sprite} alt={pokemon.basePokemon?.name} className="w-28 h-28" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))
                }
                </div>
            </ScrollArea>
            <Button
                className="ml-10 mt-5 mb-10"
                onClick={() => {
                    const team: Team = {
                        id: teams.length + 1,
                        name: "New Team",
                        pokemons: []
                    };
                    addTeam(team);
                }}
            >
                Add Team
            </Button>
        </div>
    );
}
