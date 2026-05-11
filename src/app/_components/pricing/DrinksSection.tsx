export const drinks = [
  { name: "Вода 0.5 л", price: 60 },
  { name: "Энергетик (Red Bull, Monster)", price: 150 },
  { name: "Кофе (растворимый)", price: 80 },
  { name: "Чай", price: 60 },
  { name: "Сок 0.2 л", price: 80 },
];


export function DrinksSection() {
  return (
    <section className="mt-20" id="food">
      <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-500">
        Еда и напитки
      </p>
      <h2 className="mt-2 text-2xl font-bold text-white">Напитки</h2>
      <p className="mt-1 text-sm text-violet-200/50">Можно взять на ресепшн</p>

      <div className="mt-6 overflow-hidden rounded-sm border border-[#1e1540]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1540] bg-[#120e24]">
              <th className="px-6 py-4 text-left font-medium text-violet-400">Напиток</th>
              <th className="px-6 py-4 text-right font-medium text-violet-400">Цена</th>
            </tr>
          </thead>
          <tbody>
            {drinks.map((drink, i) => (
              <tr
                key={drink.name}
                className={`border-b border-[#1e1540] last:border-0 ${
                  i % 2 === 0 ? "bg-[#0e0b1a]" : "bg-[#120e24]"
                }`}
              >
                <td className="px-6 py-4 text-white">{drink.name}</td>
                <td className="px-6 py-4 text-right font-medium text-teal-400">
                  {drink.price} ₽
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}