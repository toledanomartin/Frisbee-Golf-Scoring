import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GameState, PlayerStats } from "@/types/game";
import { Trophy } from "lucide-react";

const Results = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<PlayerStats[]>([]);

  useEffect(() => {
    const savedState = localStorage.getItem("gameState");
    if (!savedState) {
      navigate("/");
      return;
    }

    const gameState: GameState = JSON.parse(savedState);
    const playerStats = gameState.players.map((player) => {
      const scores = player.scores.filter((s) => s > 0);
      const averagePerHole = scores.reduce((a, b) => a + b, 0) / scores.length;
      const bestHole = Math.min(...scores);
      const worstHole = Math.max(...scores);

      const scoreDiffs = player.scores.map(
        (score, idx) => score - gameState.pars[idx]
      );
      const aces = scoreDiffs.filter((diff) => diff === -2).length;
      const eagles = scoreDiffs.filter((diff) => diff === -1).length;
      const birdies = scoreDiffs.filter((diff) => diff === 0).length;
      const pars = scoreDiffs.filter((diff) => diff === 1).length;
      const bogeys = scoreDiffs.filter((diff) => diff === 2).length;
      const doubleBogeys = scoreDiffs.filter((diff) => diff > 2).length;

      return {
        ...player,
        position: 0,
        averagePerHole,
        bestHole,
        worstHole,
        aces,
        eagles,
        birdies,
        pars,
        bogeys,
        doubleBogeys,
      };
    });

    // Sort by total score and assign positions
    playerStats.sort((a, b) => a.total - b.total);
    playerStats.forEach((player, idx) => {
      player.position = idx + 1;
    });

    setStats(playerStats);
  }, [navigate]);

  const newGame = () => {
    localStorage.removeItem("gameState");
    navigate("/");
  };

  if (!stats.length) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest to-sage p-6">
      <Card className="max-w-4xl mx-auto p-8 bg-white/90 backdrop-blur">
        <h1 className="text-4xl font-bold text-forest mb-8 text-center">
          Tournament Results
        </h1>

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

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Avg/Hole</TableHead>
                <TableHead>Best</TableHead>
                <TableHead>Worst</TableHead>
                <TableHead>Aces</TableHead>
                <TableHead>Eagles</TableHead>
                <TableHead>Birdies</TableHead>
                <TableHead>Pars</TableHead>
                <TableHead>Bogeys</TableHead>
                <TableHead>Double+</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.position}</TableCell>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>
                    {player.total} ({player.overPar > 0 ? "+" : ""}
                    {player.overPar})
                  </TableCell>
                  <TableCell>{player.averagePerHole.toFixed(1)}</TableCell>
                  <TableCell>{player.bestHole}</TableCell>
                  <TableCell>{player.worstHole}</TableCell>
                  <TableCell>{player.aces}</TableCell>
                  <TableCell>{player.eagles}</TableCell>
                  <TableCell>{player.birdies}</TableCell>
                  <TableCell>{player.pars}</TableCell>
                  <TableCell>{player.bogeys}</TableCell>
                  <TableCell>{player.doubleBogeys}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={newGame}
            className="bg-forest hover:bg-forest/90 text-white"
          >
            Start New Tournament
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Results;