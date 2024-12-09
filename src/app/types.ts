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

export interface Pokemon extends BasePokemon {
    personalId: number
    nickname: string
    level: number
    gender: string
    item: Item | null
    nature: Nature
    ability: Ability
    selectedMoves: (Move | null)[]
    eVs: Stats
    iVs: Stats
}

export interface Team {
    id: number
    name: string
    pokemons: Pokemon[]
}

export interface Nature {
    name: string
    up: keyof Pokemon['baseStats']
    down: keyof Pokemon['baseStats']
}
