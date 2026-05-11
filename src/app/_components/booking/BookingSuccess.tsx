import Link from "next/link";

interface Props {
  bookingCode: string;
}

export default function BookingSuccess({ bookingCode }: Props) {
  return (
    <div className="mx-auto max-w-lg px-4 py-32 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/30 to-teal-600/30 text-3xl border border-violet-500/30">
        <span className="text-violet-400">✓</span>
      </div>
      <h1 className="mt-6 text-3xl font-bold text-white">Готово!</h1>
      <p className="mt-3 text-violet-200/60">
        Место успешно забронировано. Сохрани номер брони — он понадобится
        если захочешь отменить.
      </p>

      <div className="mt-8 rounded-sm border border-violet-500/30 bg-gradient-to-br from-violet-600/10 to-teal-600/10 p-6">
        <p className="text-sm text-violet-400/50">Номер брони</p>
        <p className="mt-2 text-4xl font-bold tracking-widest bg-gradient-to-r from-violet-400 to-teal-400 bg-clip-text text-transparent">
          {bookingCode}
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-sm border border-[#1e1540] bg-[#120e24] px-6 py-2.5 text-sm text-violet-200/60 transition-all duration-200 hover:border-violet-700/50 hover:text-white"
        >
          На главную
        </Link>
        <Link
          href="/booking"
          className="relative overflow-hidden rounded-sm px-6 py-2.5 text-sm font-bold uppercase tracking-[2px] text-white transition-all duration-300 hover:scale-105 hover:brightness-125 active:scale-95 group"
          style={{ background: "linear-gradient(90deg, #7c3aed 0%, #0d9488 100%)" }}
        >
          <span className="relative z-10">Новая бронь</span>
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(90deg, #0d9488 0%, #7c3aed 100%)" }}
          />
        </Link>
      </div>
    </div>
  );
}