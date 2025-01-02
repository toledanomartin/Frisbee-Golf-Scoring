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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GameState, PlayerStats } from "@/types/game";
import { Trophy, History } from "lucide-react";
import { format } from "date-fns";

const Results = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [tournamentHistory, setTournamentHistory] = useState<Array<{ date: string; stats: PlayerStats[] }>>([]);

  useEffect(() => {
    const savedState = localStorage.getItem("gameState");
    if (!savedState) {
      navigate("/");
      return;
    }

    const gameState: GameState = JSON.parse(savedState);
    const playerStats = calculatePlayerStats(gameState);
    setStats(playerStats);

    // Save current tournament to history
    const history = JSON.parse(localStorage.getItem("tournamentHistory") || "[]");
    const newHistory = [
      { date: new Date().toISOString(), stats: playerStats },
      ...history,
    ].slice(0, 10); // Keep only last 10 tournaments
    localStorage.setItem("tournamentHistory", JSON.stringify(newHistory));
    setTournamentHistory(newHistory);
  }, [navigate]);

  const calculatePlayerStats = (gameState: GameState) => {
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

    return playerStats;
  };

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

        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={newGame}
            className="bg-forest hover:bg-forest/90 text-white"
          >
            Start New Tournament
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <History className="w-4 h-4" />
                Tournament History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tournament History</DialogTitle>
              </DialogHeader>
              {tournamentHistory.map((tournament, index) => (
                <div key={tournament.date} className="mb-8">
                  <h3 className="font-semibold mb-4">
                    {format(new Date(tournament.date), "PPpp")}
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Avg/Hole</TableHead>
                        <TableHead>Best</TableHead>
                        <TableHead>Worst</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tournament.stats.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell>{player.position}</TableCell>
                          <TableCell className="font-medium">
                            {player.name}
                          </TableCell>
                          <TableCell>
                            {player.total} ({player.overPar > 0 ? "+" : ""}
                            {player.overPar})
                          </TableCell>
                          <TableCell>{player.averagePerHole.toFixed(1)}</TableCell>
                          <TableCell>{player.bestHole}</TableCell>
                          <TableCell>{player.worstHole}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  );
};

export default Results;
