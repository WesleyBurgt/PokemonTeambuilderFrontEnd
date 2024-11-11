import React from 'react';
import { Team, Pokemon, Typing } from '@/app/types';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface TeamWeaknessProps {
  team: Team
  typings: Typing[]
}

const typeColors: { [key: string]: string } = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C", grass: "#7AC74C",
  ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1", ground: "#E2BF65", flying: "#A98FF3",
  psychic: "#F95587", bug: "#A6B91A", rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC",
  dark: "#705746", steel: "#B7B7CE", fairy: "#E685BD"
};

export default function teamWeakness({ team, typings }: TeamWeaknessProps) {
  const getEffectiveness = (pokemon: Pokemon, typing: Typing): string => {
    let effectiveness = 1;

    pokemon.typings.forEach(pokemonTyping => {
      if (pokemonTyping.immunities.some(immunity => immunity.name === typing.name)) {
        effectiveness = 0;
      }
      else if (pokemonTyping.weaknesses.some(weakness => weakness.name === typing.name)) {
        effectiveness *= 2;
      }
      else if (pokemonTyping.resistances.some(resistance => resistance.name === typing.name)) {
        effectiveness *= 0.5;
      }
    });

    if (effectiveness === 0) return 'immune';
    if (effectiveness === 4) return '4×';
    if (effectiveness === 2) return '2×';
    if (effectiveness === 0.5) return '½';
    if (effectiveness === 0.25) return '¼';
    return '';
  };

  return (
    <ScrollArea className="typing-grid pb-2">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th>Move</th>
            {team.pokemons.map(pokemon => (
              <th key={`header-${pokemon.personalId}`}>
                <img src={pokemon.sprite} alt={pokemon.name} className="w-full min-w-20 h-20 object-contain" />
              </th>
            ))}
            <th>Total Weak</th>
            <th>Total Resist</th>
            <th>Total Immune</th>
          </tr>
        </thead>
        <tbody>
          {typings.map(typing => (
            <tr key={`typing-${typing.id}`}>
              <td className="px-2 py-1" style={{ backgroundColor: typeColors[typing.name], color: 'white' }}>
                <span>{typing.name.toUpperCase()}</span>
              </td>
              {team.pokemons.map(pokemon => (
                <td key={`effectiveness-${pokemon.personalId}-${typing.id}`} className="text-center">
                  {getEffectiveness(pokemon, typing)}
                </td>
              ))}
              <td>
                {team.pokemons.reduce((total, pokemon) => {
                  const effectiveness = getEffectiveness(pokemon, typing);
                  if (effectiveness === '4×') {
                    return total + 2;
                  }
                  if (effectiveness === '2×') {
                    return total + 1;
                  }
                  return total;
                }, 0)}
              </td>
              <td>
                {team.pokemons.reduce((total, pokemon) => {
                  const effectiveness = getEffectiveness(pokemon, typing);
                  if (effectiveness === '¼') {
                    return total + 2;
                  }
                  if (effectiveness === '½') {
                    return total + 1;
                  }
                  return total;
                }, 0)}
              </td>
              <td>
                {team.pokemons.reduce((total, pokemon) => {
                  const effectiveness = getEffectiveness(pokemon, typing);
                  if (effectiveness === 'immune') {
                    return total + 1;
                  }
                  return total;
                }, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

};
