import type { Club } from "@prisma/client";

interface Props {
  clubs: Club[];
  selectedClubId: string | null;
  onChange: (clubId: string) => void;
}

export default function ClubSelector({ clubs, selectedClubId, onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-zinc-400">Выбери клуб</p>
      <div className="flex rounded-xl border border-white/10 bg-zinc-900 p-1">
        {clubs.map((club) => (
          <button
            key={club.id}
            onClick={() => onChange(club.id)}
            className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
              selectedClubId === club.id
                ? "bg-violet-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {club.name}
          </button>
        ))}
      </div>
    </div>
  );
}