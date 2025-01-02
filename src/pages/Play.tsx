import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GameState } from "@/types/game";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const Play = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const savedState = localStorage.getItem("gameState");
    if (!savedState) {
      navigate("/");
      return;
    }
    setGameState(JSON.parse(savedState));
  }, [navigate]);

  const updateScore = (playerId: string, score: number) => {
    if (!gameState) return;
    
    const newScore = Math.max(0, score);
    
    setGameState((prev) => {
      if (!prev) return null;
      
      const newPlayers = prev.players.map((p) => {
        if (p.id !== playerId) return p;
        
        const newScores = [...p.scores];
        newScores[prev.currentHole] = newScore;
        
        const total = newScores.reduce((sum, score) => sum + score, 0);
        const overPar = newScores.reduce((sum, score, idx) => 
          sum + (score ? score - prev.pars[idx] : 0), 0);
        
        return { ...p, scores: newScores, total, overPar };
      });
      
      return { ...prev, players: newPlayers };
    });
  };

  const updatePar = (par: number) => {
    if (!gameState) return;
    
    setGameState((prev) => {
      if (!prev) return null;
      const newPars = [...prev.pars];
      newPars[prev.currentHole] = Math.max(1, par);
      
      const newPlayers = prev.players.map((p) => ({
        ...p,
        overPar: p.scores.reduce((sum, score, idx) => 
          sum + (score ? score - newPars[idx] : 0), 0)
      }));
      
      return { ...prev, pars: newPars, players: newPlayers };
    });
  };

  const navigate_hole = (direction: 'prev' | 'next') => {
    if (!gameState) return;
    
    if (direction === 'next' && gameState.currentHole === gameState.totalHoles - 1) {
      // Check if all scores are entered
      const allScoresEntered = gameState.players.every(player => 
        player.scores.every(score => score > 0)
      );
      
      if (!allScoresEntered) {
        toast.error("Please enter all scores before finishing");
        return;
      }
      
      localStorage.setItem("gameState", JSON.stringify(gameState));
      navigate("/results");
      return;
    }
    
    setGameState(prev => {
      if (!prev) return null;
      const newHole = direction === 'next' ? 
        prev.currentHole + 1 : 
        Math.max(0, prev.currentHole - 1);
      return { ...prev, currentHole: newHole };
    });
  };

  if (!gameState) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest to-sage p-6">
      <Card className="max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-forest">
            Hole {gameState.currentHole + 1}
          </h2>
          <p className="text-sage mt-2">
            Par: {gameState.pars[gameState.currentHole]}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Par</label>
            <Input
              type="number"
              value={gameState.pars[gameState.currentHole]}
              onChange={(e) => updatePar(Number(e.target.value))}
              min={1}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            {gameState.players.map((player) => (
              <div key={player.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">{player.name}</label>
                  <div className="text-sm text-sage">
                    Total: {player.total} ({player.overPar > 0 ? "+" : ""}
                    {player.overPar})
                  </div>
                </div>
                <Input
                  type="number"
                  value={player.scores[gameState.currentHole] || ""}
                  onChange={(e) =>
                    updateScore(player.id, Number(e.target.value))
                  }
                  min={0}
                  placeholder="Strokes"
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between gap-4 mt-8">
            <Button
              onClick={() => navigate_hole('prev')}
              disabled={gameState.currentHole === 0}
              variant="outline"
              className="w-1/2"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous Hole
            </Button>
            <Button
              onClick={() => navigate_hole('next')}
              className="w-1/2 bg-forest hover:bg-forest/90"
            >
              {gameState.currentHole === gameState.totalHoles - 1 ? (
                "Finish Tournament"
              ) : (
                <>
                  Next Hole <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Play;