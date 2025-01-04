import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameState, PlayerStats } from "@/types/game";
import { PodiumDisplay } from "@/components/tournament/PodiumDisplay";
import { StatsTable } from "@/components/tournament/StatsTable";
import { HistoryDialog } from "@/components/tournament/HistoryDialog";
import { useToast } from "@/components/ui/use-toast";

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [tournamentHistory, setTournamentHistory] = useState<
    Array<{ date: string; stats: PlayerStats[] }>
  >([]);

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
    ].slice(0, 10);
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

  const handleClearHistory = () => {
    localStorage.removeItem("tournamentHistory");
    setTournamentHistory([]);
    toast({
      title: "History Cleared",
      description: "Tournament history has been cleared successfully.",
    });
  };

  if (!stats.length) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy-light to-white p-6">
      <Card className="max-w-4xl mx-auto p-8 bg-white/90 backdrop-blur">
        <h1 className="text-4xl font-bold text-navy mb-8 text-center">
          Tournament Results
        </h1>

        <PodiumDisplay stats={stats} />
        <StatsTable stats={stats} />

        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={newGame}
            className="bg-navy hover:bg-navy-light text-white"
          >
            Start New Tournament
          </Button>
          <HistoryDialog
            tournamentHistory={tournamentHistory}
            onClearHistory={handleClearHistory}
          />
        </div>
      </Card>
    </div>
  );
};

export default Results;
