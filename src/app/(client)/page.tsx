import Link from "next/link";
import { Computer, Gamepad2, CalendarDays } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-36 text-center overflow-hidden">
        {/* Фоновый градиент */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#3b1d8a22_0%,_transparent_60%)]" />
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

        <span className="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[2px] text-violet-400">
          Компьютерный клуб · Омск
        </span>
        <h1 className="max-w-3xl text-5xl font-bold leading-tight text-white">
          Компьютерный клуб{" "}
          <span className="bg-gradient-to-r from-violet-400 to-teal-400 bg-clip-text text-transparent">
            нового уровня
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-violet-200/60">
          Мощные ПК, PS5, комфортные залы. Работаем круглосуточно.
          Бронируй место онлайн за 30 секунд.
        </p>
        <Link
          href="/booking"
          className="relative mt-8 overflow-hidden rounded-sm px-8 py-3 text-sm font-bold uppercase tracking-[2px] text-white transition-all duration-300 hover:scale-105 hover:brightness-125 active:scale-95 group"
          style={{ background: "linear-gradient(90deg, #7c3aed 0%, #0d9488 100%)" }}
        >
          <span className="relative z-10">Вперед играть!</span>
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(90deg, #0d9488 0%, #7c3aed 100%)" }}
          />
        </Link>
      </section>

      {/* Преимущества */}
      <section className="border-t border-[#1e1540] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-sm border border-[#1e1540] bg-[#120e24] p-6 transition-colors hover:border-violet-700/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-violet-900/40 text-xl">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-violet-200/50">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Два клуба */}
      <section className="border-t border-[#1e1540] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-500">
            Два адреса
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">Наши клубы</h2>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {clubs.map((club) => (
              <div
                key={club.name}
                className="rounded-sm border border-[#1e1540] bg-[#120e24] p-8 transition-colors hover:border-violet-700/50"
              >
                <h3 className="text-lg font-bold text-white">{club.name}</h3>
                <p className="mt-2 text-sm text-violet-200/60">{club.address}</p>
                <p className="mt-1 text-sm text-violet-200/60">{club.phone}</p>
                <p className="mt-1 text-xs text-violet-400/50">Круглосуточно, без выходных</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {club.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#1e1540] px-4 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-500">
            Онлайн-бронирование
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">Готов играть?</h2>
          <p className="mt-4 text-violet-200/60">
            Выбери место на карте зала и забронируй онлайн — без звонков и регистрации.
          </p>
          <Link
            href="/booking"
            className="relative mt-8 inline-block overflow-hidden rounded-sm px-8 py-3 text-sm font-bold uppercase tracking-[2px] text-white transition-all duration-300 hover:scale-105 hover:brightness-125 active:scale-95 group"
            style={{ background: "linear-gradient(90deg, #7c3aed 0%, #0d9488 100%)" }}
          >
            <span className="relative z-10">Открыть карту залов</span>
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(90deg, #0d9488 0%, #7c3aed 100%)" }}
            />
          </Link>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: <Computer size={22} strokeWidth={1.5} />,
    title: "Мощные ПК",
    description: "RTX 4070, Intel i7, 165Hz мониторы. Все компьютеры одинаково укомплектованы.",
  },
  {
    icon: <Gamepad2 size={22} strokeWidth={1.5} />,
    title: "PS5 зона",
    description: "Несколько консолей с большими экранами. Огромная библиотека игр.",
  },
  {
    icon: <CalendarDays size={22} strokeWidth={1.5} />,
    title: "Онлайн-бронирование",
    description: "Бронируй конкретное место заранее. Без регистрации — только имя и телефон.",
  },
];

const clubs = [
  {
    name: "XZone на Циолковского",
    address: "ул. Циолковского, 42",
    phone: "+7 900 000-00-01",
    tags: ["60 ПК", "6 PS5", "24/7"],
  },
  {
    name: "XZone на Серова",
    address: "ул. Серова, 17",
    phone: "+7 900 000-00-02",
    tags: ["26 ПК", "24/7"],
  },
];