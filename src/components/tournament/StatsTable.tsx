import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayerStats } from "@/types/game";

interface StatsTableProps {
  stats: PlayerStats[];
}

export const StatsTable = ({ stats }: StatsTableProps) => {
  return (
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
  );
};