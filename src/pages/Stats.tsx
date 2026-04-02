import { useEffect, useMemo, useState } from "react";
import { TRACKS_URL } from "@/data/tracks";

type PlayCountsResponse = {
  playCounts?: Record<string, number>;
};

type TrackRow = {
  id: string;
  title: string;
  artist: string;
};

type TracksJson = {
  tracks?: TrackRow[];
};

type StatsRow = {
  id: string;
  plays: number;
  title: string;
  artist: string;
};

const Stats = () => {
  const [rows, setRows] = useState<StatsRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [countsRes, tracksRes] = await Promise.all([
          fetch("/api/play-counts", { cache: "no-store" }),
          fetch(TRACKS_URL),
        ]);

        if (!countsRes.ok) throw new Error(`play-counts HTTP ${countsRes.status}`);
        if (!tracksRes.ok) throw new Error(`tracks.json HTTP ${tracksRes.status}`);

        const countsJson = (await countsRes.json()) as PlayCountsResponse;
        const tracksJson = (await tracksRes.json()) as TracksJson;

        const counts = countsJson.playCounts ?? {};
        const tracks = tracksJson.tracks ?? [];
        const byId = new Map<string, TrackRow>(tracks.map((t) => [String(t.id), t]));

        const merged: StatsRow[] = Object.entries(counts)
          .map(([id, plays]) => {
            const t = byId.get(String(id));
            return {
              id: String(id),
              plays: Number(plays) || 0,
              title: t?.title ?? "Unknown track",
              artist: t?.artist ?? "Unknown artist",
            };
          })
          .sort((a, b) => b.plays - a.plays || Number(a.id) - Number(b.id));

        if (!cancelled) setRows(merged);
      } catch (e) {
        if (!cancelled) {
          setRows([]);
          setError(e instanceof Error ? e.message : "Failed to load stats");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPlays = useMemo(
    () => rows.reduce((sum, row) => sum + row.plays, 0),
    [rows],
  );

  return (
    <div className="min-h-svh bg-background text-foreground p-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold">Play Counts</h1>
          <a href="/" className="text-sm text-primary underline">Back to app</a>
        </div>

        <div className="mb-3 text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `Tracks with plays: ${rows.length} | Total plays: ${totalPlays}`}
        </div>

        {error ? (
          <p className="text-sm text-destructive">Error: {error}</p>
        ) : (
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Track ID</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Artist</th>
                  <th className="px-3 py-2 text-right">Plays</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.id} className="border-t border-border/60">
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2 font-mono">{row.id}</td>
                    <td className="px-3 py-2">{row.title}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.artist}</td>
                    <td className="px-3 py-2 text-right font-semibold">{row.plays}</td>
                  </tr>
                ))}
                {!isLoading && rows.length === 0 ? (
                  <tr>
                    <td className="px-3 py-6 text-center text-muted-foreground" colSpan={5}>
                      No play count data yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
