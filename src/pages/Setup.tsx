import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { Player } from "@/types/game";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const Setup = () => {
  const navigate = useNavigate();
  const [totalHoles, setTotalHoles] = useState<number>(18);
  const [players, setPlayers] = useState<{ id: string; name: string }[]>([
    { id: uuidv4(), name: "" },
  ]);

  const addPlayer = () => {
    if (players.length >= 6) {
      toast.error("Maximum 6 players allowed");
      return;
    }
    setPlayers([...players, { id: uuidv4(), name: "" }]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 1) {
      toast.error("Minimum 1 player required");
      return;
    }
    setPlayers(players.filter((p) => p.id !== id));
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  const startTournament = () => {
    if (players.some((p) => !p.name.trim())) {
      toast.error("All players must have names");
      return;
    }

    if (totalHoles < 1) {
      toast.error("Course must have at least 1 hole");
      return;
    }

    const gameState = {
      players: players.map((p) => ({
        id: p.id,
        name: p.name,
        scores: Array(totalHoles).fill(0),
        total: 0,
        overPar: 0,
      })),
      currentHole: 0,
      totalHoles,
      pars: Array(totalHoles).fill(3),
    };

    localStorage.setItem("gameState", JSON.stringify(gameState));
    navigate("/play");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy-light to-white p-6">
      <Card className="max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur">
        <h1 className="text-4xl font-bold text-forest mb-8 text-center">
          Disc Golf Scorecard
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Holes
            </label>
            <Input
              type="number"
              value={totalHoles}
              onChange={(e) => setTotalHoles(Number(e.target.value))}
              min={1}
              max={36}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium">Players</label>
              <Button
                onClick={addPlayer}
                variant="outline"
                size="sm"
                className="text-forest"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Player
              </Button>
            </div>

            <div className="space-y-3">
              {players.map((player) => (
                <div key={player.id} className="flex gap-2">
                  <Input
                    placeholder="Player name"
                    value={player.name}
                    onChange={(e) => updatePlayerName(player.id, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removePlayer(player.id)}
                    variant="outline"
                    size="icon"
                    className="text-red-500"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={startTournament}
            className="w-full bg-forest hover:bg-forest/90 text-white"
          >
            Start Tournament
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Setup;