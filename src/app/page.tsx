import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 py-32 text-center">
        <h1 className="max-w-3xl text-5xl font-bold leading-tight text-white">
          Компьютерный клуб нового уровня
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-400">
          Мощные ПК, PS5, комфортные залы. Работаем круглосуточно.
          Бронируй место онлайн за 30 секунд.
        </p>
        <Link
          href="/booking"
          className="mt-8 rounded-lg bg-violet-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-violet-500"
        >
          Забронировать место
        </Link>
      </section>

      {/* Преимущества */}
      <section className="border-t border-white/10 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-white/10 bg-zinc-900 p-6"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="mt-4 text-lg font-medium text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Два клуба */}
      <section className="border-t border-white/10 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white">Наши клубы</h2>
          <p className="mt-2 text-zinc-400">Два адреса в городе</p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {clubs.map((club) => (
              <div
                key={club.name}
                className="rounded-xl border border-white/10 bg-zinc-900 p-8"
              >
                <h3 className="text-xl font-bold text-white">{club.name}</h3>
                <p className="mt-2 text-zinc-400">{club.address}</p>
                <p className="mt-1 text-zinc-400">{club.phone}</p>
                <p className="mt-1 text-sm text-zinc-500">Круглосуточно, без выходных</p>
                <div className="mt-6 flex gap-3">
                  {club.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400"
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
      <section className="border-t border-white/10 px-4 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold text-white">
            Готов играть?
          </h2>
          <p className="mt-4 text-zinc-400">
            Выбери место на карте зала и забронируй онлайн — без звонков и регистрации.
          </p>
          <Link
            href="/booking"
            className="mt-8 inline-block rounded-lg bg-violet-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-violet-500"
          >
            Открыть карту залов
          </Link>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: "🖥️",
    title: "Мощные ПК",
    description:
      "RTX 4070, Intel i7, 165Hz мониторы. Все компьютеры одинаково укомплектованы.",
  },
  {
    icon: "🎮",
    title: "PS5 зона",
    description:
      "Несколько консолей с большими экранами. Огромная библиотека игр.",
  },
  {
    icon: "📅",
    title: "Онлайн-бронирование",
    description:
      "Бронируй конкретное место заранее. Без регистрации — только имя и телефон.",
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