import type { Club } from "@prisma/client";

interface Props {
  clubs: Club[];
  selectedClubId: string | null;
  onChange: (clubId: string) => void;
}

export default function ClubSelector({ clubs, selectedClubId, onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-violet-200/60">Выбери клуб</p>
      <div className="flex rounded-sm border border-[#1e1540] bg-[#120e24] p-1">
        {clubs.map((club) => (
          <button
            key={club.id}
            onClick={() => onChange(club.id)}
            className={`rounded-sm px-5 py-2.5 text-sm font-medium transition-all ${
              selectedClubId === club.id
                ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/20"
                : "text-violet-400/60 hover:border-violet-500/50 hover:text-violet-400"
            }`}
          >
            {club.name}
          </button>
        ))}
      </div>
    </div>
  );
}