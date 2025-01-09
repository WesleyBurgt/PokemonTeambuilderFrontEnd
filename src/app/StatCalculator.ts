import { BasePokemon, Pokemon } from "./types";

export const statAbbreviations: { [key in keyof BasePokemon['baseStats']]: string } = {
    hp: 'HP',
    attack: 'Atk',
    defense: 'Def',
    specialAttack: 'SpA',
    specialDefense: 'SpD',
    speed: 'Spe',
};

export function calculateDerivedStats(pokemon: Pokemon): BasePokemon['baseStats'] {
    if (!pokemon.basePokemon) {
        console.warn(`BasePokemon data is missing for Pokémon with personalId: ${pokemon.personalId}`);
        return {
            hp: 0,
            attack: 0,
            defense: 0,
            specialAttack: 0,
            specialDefense: 0,
            speed: 0,
        };
    }

    const level = pokemon.level;

    const calculateStat = (
        baseStat: number,
        ev: number,
        iv: number,
        natureMultiplier: number
    ): number => {
        return Math.floor(((((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5) * natureMultiplier);
    };

    const getNatureMultiplier = (stat: keyof BasePokemon['baseStats']): number => {
        if (pokemon.nature.up == stat) return 1.1;
        if (pokemon.nature.down == stat) return 0.9;
        return 1;
    };

    const derivedStats: BasePokemon['baseStats'] = {
        hp: pokemon.basePokemon.baseStats.hp === 1
            ? 1
            : Math.floor(((2 * pokemon.basePokemon.baseStats.hp + pokemon.iVs.hp + Math.floor(pokemon.eVs.hp / 4)) * level) / 100) + level + 10,
        attack: calculateStat(pokemon.basePokemon.baseStats.attack, pokemon.eVs.attack, pokemon.iVs.attack, getNatureMultiplier('attack')),
        defense: calculateStat(pokemon.basePokemon.baseStats.defense, pokemon.eVs.defense, pokemon.iVs.defense, getNatureMultiplier('defense')),
        specialAttack: calculateStat(pokemon.basePokemon.baseStats.specialAttack, pokemon.eVs.specialAttack, pokemon.iVs.specialAttack, getNatureMultiplier('specialAttack')),
        specialDefense: calculateStat(pokemon.basePokemon.baseStats.specialDefense, pokemon.eVs.specialDefense, pokemon.iVs.specialDefense, getNatureMultiplier('specialDefense')),
        speed: calculateStat(pokemon.basePokemon.baseStats.speed, pokemon.eVs.speed, pokemon.iVs.speed, getNatureMultiplier('speed'))
    };

    return derivedStats;
}