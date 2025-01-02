import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { History, Trash2 } from "lucide-react";
import { PlayerStats } from "@/types/game";

interface HistoryDialogProps {
  tournamentHistory: Array<{ date: string; stats: PlayerStats[] }>;
  onClearHistory: () => void;
}

export const HistoryDialog = ({ tournamentHistory, onClearHistory }: HistoryDialogProps) => {
  return (
    <Dialog>
      <div className="flex gap-2">
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <History className="w-4 h-4" />
            Tournament History
          </Button>
        </DialogTrigger>
        <Button
          variant="outline"
          className="gap-2 text-destructive hover:text-destructive"
          onClick={onClearHistory}
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </Button>
      </div>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tournament History</DialogTitle>
        </DialogHeader>
        {tournamentHistory.map((tournament) => (
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
                    <TableCell className="font-medium">{player.name}</TableCell>
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
  );
};