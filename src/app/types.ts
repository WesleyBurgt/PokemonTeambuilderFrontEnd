export interface BasePokemon {
    id: number;
    name: string;
    typings: Typing[];
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
    isHidden: Boolean;
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
    evs: Stats
    ivs: Stats
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
