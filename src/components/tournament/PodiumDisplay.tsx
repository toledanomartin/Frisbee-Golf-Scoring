import { Trophy } from "lucide-react";
import { PlayerStats } from "@/types/game";

interface PodiumDisplayProps {
  stats: PlayerStats[];
}

export const PodiumDisplay = ({ stats }: PodiumDisplayProps) => {
  return (
    <div className="flex justify-center gap-8 mb-12">
      {stats.slice(0, 3).map((player, index) => (
        <div
          key={player.id}
          className={`flex flex-col items-center animate-slide-up`}
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
              index === 0
                ? "bg-gold"
                : index === 1
                ? "bg-silver"
                : "bg-bronze"
            }`}
          >
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h3 className="font-bold">{player.name}</h3>
            <p className="text-sm text-sage">
              {player.total} ({player.overPar > 0 ? "+" : ""}
              {player.overPar})
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};