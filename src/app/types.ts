export interface LoginModel {
    username: string;
    password: string;
}

export interface BasePokemon {
    id: number;
    name: string;
    typings: BasePokemonTyping[];
    abilities: Ability[];
    baseStats: Stats;
    moveIds: number[];
    moves: Move[];
    sprite: string;
}

export interface Item {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
}

export interface BasePokemonTyping {
    slot: number;
    typing: Typing;
}

export interface Typing {
    id: number;
    name: string;
    weaknesses: Typing[];
    resistances: Typing[];
    immunities: Typing[];
}

export interface Ability {
    id: number;
    name: string;
    description: string | null;
    isHidden: boolean;
}

export interface Stats {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
}

export interface Move {
    id: number;
    name: string;
    description: string | null;
    typing: Typing;
    category: string;
    basePower: number | null;
    accuracy: number | null;
    pp: number | null;
}

export interface selectedMove {
    id: number
    slot: number
}

export interface Pokemon {
    personalId: number
    basePokemonId: number
    basePokemon: BasePokemon | null
    nickname: string
    level: number
    gender: string
    item: Item | null
    nature: Nature
    ability: Ability
    selectedMoves: (selectedMove | null)[]
    eVs: Stats
    iVs: Stats
}

export interface Team {
    id: number
    name: string
    pokemons: Pokemon[]
}

export interface Nature {
    id: number
    name: string
    up: keyof BasePokemon['baseStats']
    down: keyof BasePokemon['baseStats']
}
