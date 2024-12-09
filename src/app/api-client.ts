import { BasePokemon, Item, Nature, Typing } from "./types";
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