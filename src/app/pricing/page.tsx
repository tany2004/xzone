import { api } from "~/trpc/server";

export default async function PricingPage() {
  const clubs = await api.club.getAll();
  const pricingRules = await Promise.all(
    clubs.map(async (club) => ({
      club,
      rules: await api.pricing.getByClub({ clubId: club.id }),
    })),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold text-white">Цены</h1>
      <p className="mt-2 text-zinc-400">Все тарифы и услуги</p>

      {/* Тарифы по клубам */}
      {pricingRules.map(({ club, rules }) => (
        <section key={club.id} className="mt-16">
          <h2 className="text-2xl font-bold text-white">{club.name}</h2>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="rounded-xl border border-white/10 bg-zinc-900 p-6"
              >
                <p className="text-sm text-zinc-400">
                  {seatTypeLabel[rule.seatType]} · {periodLabel[rule.period]}
                </p>
                <p className="mt-3 text-3xl font-bold text-white">
                  {Number(rule.pricePerHour)} ₽
                </p>
                <p className="mt-1 text-sm text-zinc-500">за час</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Меню напитков */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold text-white">Напитки</h2>
        <p className="mt-2 text-zinc-400">Можно взять на ресепшн</p>

        <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-900">
                <th className="px-6 py-4 text-left font-medium text-zinc-400">
                  Напиток
                </th>
                <th className="px-6 py-4 text-right font-medium text-zinc-400">
                  Цена
                </th>
              </tr>
            </thead>
            <tbody>
              {drinks.map((drink, i) => (
                <tr
                  key={drink.name}
                  className={`border-b border-white/10 last:border-0 ${
                    i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/50"
                  }`}
                >
                  <td className="px-6 py-4 text-white">{drink.name}</td>
                  <td className="px-6 py-4 text-right text-zinc-400">
                    {drink.price} ₽
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Полиграфия */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold text-white">Полиграфия</h2>
        <p className="mt-2 text-zinc-400">Печать и копирование документов</p>

        <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-900">
                <th className="px-6 py-4 text-left font-medium text-zinc-400">
                  Услуга
                </th>
                <th className="px-6 py-4 text-right font-medium text-zinc-400">
                  Цена
                </th>
              </tr>
            </thead>
            <tbody>
              {printing.map((item, i) => (
                <tr
                  key={item.name}
                  className={`border-b border-white/10 last:border-0 ${
                    i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/50"
                  }`}
                >
                  <td className="px-6 py-4 text-white">{item.name}</td>
                  <td className="px-6 py-4 text-right text-zinc-400">
                    {item.price} ₽
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const seatTypeLabel: Record<string, string> = {
  PC: "ПК",
  PS: "PS / Xbox",
};

const periodLabel: Record<string, string> = {
  DAY: "Дневной",
  NIGHT: "Ночной",
  HOURLY: "Почасовой",
};

const drinks = [
  { name: "Вода 0.5 л", price: 60 },
  { name: "Энергетик (Red Bull, Monster)", price: 150 },
  { name: "Кофе (растворимый)", price: 80 },
  { name: "Чай", price: 60 },
  { name: "Сок 0.2 л", price: 80 },
];

const printing = [
  { name: "Печать ч/б (1 стр. А4)", price: 5 },
  { name: "Печать цветная (1 стр. А4)", price: 20 },
  { name: "Сканирование (1 стр.)", price: 10 },
  { name: "Копирование (1 стр.)", price: 5 },
  { name: "Ламинирование А4", price: 50 },
];