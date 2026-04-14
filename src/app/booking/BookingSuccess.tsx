import Link from "next/link";

interface Props {
  bookingCode: string;
}

export default function BookingSuccess({ bookingCode }: Props) {
  return (
    <div className="mx-auto max-w-lg px-4 py-32 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-600/20 text-3xl">
        ✓
      </div>
      <h1 className="mt-6 text-3xl font-bold text-white">Готово!</h1>
      <p className="mt-3 text-zinc-400">
        Место успешно забронировано. Сохрани номер брони — он понадобится
        если захочешь отменить.
      </p>

      <div className="mt-8 rounded-xl border border-violet-500/30 bg-violet-600/10 p-6">
        <p className="text-sm text-zinc-400">Номер брони</p>
        <p className="mt-2 text-4xl font-bold tracking-widest text-white">
          {bookingCode}
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          На главную
        </Link>
        <Link
          href="/booking"
          className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
        >
          Новая бронь
        </Link>
      </div>
    </div>
  );
}