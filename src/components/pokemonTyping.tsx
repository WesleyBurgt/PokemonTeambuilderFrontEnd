import { Typing } from "@/app/types";

export const typingColors: { [key: string]: string } = {
    normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C", grass: "#7AC74C",
    ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1", ground: "#E2BF65", flying: "#A98FF3",
    psychic: "#F95587", bug: "#A6B91A", rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC",
    dark: "#705746", steel: "#B7B7CE", fairy: "#E685BD"
};

interface PokemonTypingComponentProps {
    typing: Typing
}

export default function PokemonTypingComponent({ typing }: PokemonTypingComponentProps) {
    return (
        <span
            key={`moveTyping-${typing.id}`}
            className="px-2 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: typingColors[typing.name], color: 'white' }}
        >
            {typing.name}
        </span>
    )
}