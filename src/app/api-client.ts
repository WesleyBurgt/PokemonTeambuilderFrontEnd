import { BasePokemon, Item, Nature, Pokemon, Team, Typing } from "./types";
import axios from 'axios';
import { getAccessToken } from "@/utils/tokenUtils";
import { LoginModel } from "./types";

const apiConnectionStringBase = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function loginUser(login: LoginModel): Promise<{ accesToken: string; refreshToken: string }> {
    try {
        const response = await fetch(`${apiConnectionStringBase}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(login),
        });

        if (!response.ok) {
            throw new Error("Invalid username or password");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function registerUser(login: LoginModel): Promise<{ accesToken: string; refreshToken: string }> {
    try {
      const response = await fetch(`${apiConnectionStringBase}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
}

export const getTeams = async () => {
    try {
        const response = await axios.get(`${apiConnectionStringBase}/Team/GetTeams`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAccessToken()}`
            }
        });

        const processedTeams = response.data.results.map((team: Team) => ({
            ...team,
            pokemons: team.pokemons.map((pokemon: Pokemon) => ({
                ...pokemon,
                selectedMoves: [...pokemon.selectedMoves, ...Array(4 - pokemon.selectedMoves.length).fill(null)],
            })),
        }));

        return(processedTeams);
    } catch (error) {
        console.error('Error fetching teams:', error);
    }
};

export const createTeam = async (teams: Team[], setTeams: (teams: Team[]) => void) => {
    try {
        const response = await axios.post(
            `${apiConnectionStringBase}/Team/CreateTeam`,
            { },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAccessToken()}`
                }
            }
        );
        const team: Team = response.data;
        setTeams([...teams, team]);
    } catch (error) {
        console.error('Error adding pokemon to team:', error);
    }
}

export const setTeamName = async (team: Team, newName: string, setTeam: (team: Team) => void) => {
    try {
        await axios.post(
            `${apiConnectionStringBase}/Team/SetTeamName`,
            { teamId: team.id, teamName: newName },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAccessToken()}`
                }
            }
        );

        team.name = newName
        setTeam(team);
    } catch (error) {
        console.error('Error adding pokemon to team:', error);
    }
}

export const addPokemonToTeam = async (team: Team, basePokemon: BasePokemon, setTeam: (team: Team) => void) => {
    try {
        const basePokemonId = basePokemon.id;
        const response = await axios.post(
            `${apiConnectionStringBase}/Team/AddPokemonToTeam`,
            { teamId: team.id, basePokemonId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAccessToken()}`
                }
            }
        );
        let pokemon: Pokemon = response.data;

        pokemon = {
            ...pokemon,
            selectedMoves: [...pokemon.selectedMoves, ...Array(4 - pokemon.selectedMoves.length).fill(null)],
            basePokemon: basePokemon
        };

        const updatedTeam = {
            ...team,
            pokemons: [...team.pokemons, pokemon],
        };

        setTeam(updatedTeam);
        return pokemon;
    } catch (error) {
        console.error('Error adding pokemon to team:', error);
    }
};

export const deletePokemonFromTeam = async (team: Team, pokemon: Pokemon, setTeam: (team: Team) => void) => {
    try {
        const pokemonId = pokemon.personalId
        const teamId = team.id
        await axios.post(
            `${apiConnectionStringBase}/Team/DeletePokemonFromTeam`,
            { teamId: teamId, pokemonId: pokemonId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAccessToken()}`
                }
            }
        );

        const updatedTeam = {
            ...team,
            pokemons: team.pokemons.filter(pokemon => pokemon.personalId !== pokemonId)
        };

        setTeam(updatedTeam);
    } catch (error) {
        console.error('Error adding pokemon to team:', error);
    }
};

export const updatePokemonFromTeam = async (team: Team, newPokemon: Pokemon, basePokemon: BasePokemon, setTeam: (team: Team) => void) => {
    try {
        const { basePokemon, ...pokemonWithoutBase } = newPokemon;

        const response = await axios.post(
            `${apiConnectionStringBase}/Team/UpdatePokemonFromTeam`,
            { pokemon: pokemonWithoutBase },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            }
        );

        let updatedPokemon: Pokemon = response.data;

        updatedPokemon = {
            ...updatedPokemon,
            basePokemon: basePokemon,
            selectedMoves: [
                ...updatedPokemon.selectedMoves,
                ...Array(4 - updatedPokemon.selectedMoves.length).fill(null),
            ],
        };

        const updatedTeam = {
            ...team,
            pokemons: team.pokemons.map((p) =>
                p.personalId === updatedPokemon.personalId ? updatedPokemon : p
            ),
        };

        setTeam(updatedTeam);
    } catch (error) {
        console.error('Error updating pokemon in team:', error);
    }
};



export const fetchPokemonList = async (offset: number, pokemonFetchLimit: number) => {
    try {
        const response = await fetch(`${apiConnectionStringBase}/BasePokemon/List?offset=${offset}&limit=${pokemonFetchLimit}`);
        const data = await response.json();
        const pokemonList = await Promise.all(
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

        return { pokemons: pokemonList, count: data.count }
    } catch (error) {
        console.error('Error fetching Pokemon list:', error);
    }
};


export const fetchGenders = async (setGenders: (genders: string[]) => void) => {
    try {
        const response = await fetch(`${apiConnectionStringBase}/Gender/List`)
        const data = await response.json()
        setGenders(data.results.map((gender: string) => gender))
    } catch (error) {
        console.error('Error fetching genders:', error)
    }
}

export const fetchNatures = async (setNatures: (natures: Nature[]) => void) => {
    try {
        const response = await fetch(`${apiConnectionStringBase}/Nature/List`);
        const data = await response.json();
        const detailedNatures = await Promise.all(
            data.results.map((natureResponse: Nature) => ({
                id: natureResponse.id,
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

export const fetchTypings = async (setTypings: (typings: Typing[]) => void) => {
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

export const fetchItems = async (setItems: (items: Item[]) => void) => {
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