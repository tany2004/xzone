export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">

      {/* О клубе */}
      <section>
        <h1 className="text-4xl font-bold text-white">О клубе</h1>
        <p className="mt-6 max-w-2xl text-zinc-400 leading-relaxed">
          XZone — компьютерный клуб для тех, кто ценит качество. Мы открылись
          в 2020 году и с тех пор работаем круглосуточно без выходных. У нас два
          зала в разных районах города — выбирай тот, что ближе.
        </p>
        <p className="mt-4 max-w-2xl text-zinc-400 leading-relaxed">
          Всё оборудование регулярно обновляется. Мы следим за тем, чтобы каждый
          компьютер работал стабильно и без лагов. Кроме игр — напитки, печать
          документов и комфортная атмосфера.
        </p>
      </section>

      {/* Железо */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold text-white">Железо</h2>
        <p className="mt-2 text-zinc-400">Конфигурация всех ПК в клубе</p>

        <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-900">
                <th className="px-6 py-4 text-left font-medium text-zinc-400">
                  Компонент
                </th>
                <th className="px-6 py-4 text-left font-medium text-zinc-400">
                  Модель
                </th>
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, i) => (
                <tr
                  key={spec.component}
                  className={`border-b border-white/10 last:border-0 ${
                    i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/50"
                  }`}
                >
                  <td className="px-6 py-4 text-zinc-400">{spec.component}</td>
                  <td className="px-6 py-4 font-medium text-white">
                    {spec.model}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Консоли */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold text-white">Консоли</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {consoles.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-white/10 bg-zinc-900 p-6"
            >
              <p className="font-medium text-white">{item.name}</p>
              <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Фото залов */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold text-white">Наши залы</h2>
        <p className="mt-2 text-zinc-400">
          Атмосфера, в которой хочется играть
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.alt}
              className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-zinc-900"
            >
              {/* Сюда потом вставишь реальные фото через next/image */}
              <div className="flex h-full items-center justify-center text-zinc-600 text-sm">
                {photo.alt}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

const specs = [
  { component: "Процессор", model: "Intel Core i7-13700K" },
  { component: "Видеокарта", model: "NVIDIA GeForce RTX 4070" },
  { component: "Оперативная память", model: "32 GB DDR5 5600 MHz" },
  { component: "Накопитель", model: "SSD NVMe 1 TB" },
  { component: "Монитор", model: '27" IPS 165 Hz, 1ms' },
  { component: "Периферия", model: "Игровая мышь, механическая клавиатура" },
  { component: "Гарнитура", model: "HyperX Cloud II" },
];

const consoles = [
  {
    name: "PlayStation 5",
    description:
      "4K, 120 fps, DualSense контроллер. Большая библиотека эксклюзивов.",
  },
  {
    name: "Xbox Series X",
    description: "Game Pass Ultimate, 4K, 120 fps. Сотни игр по подписке.",
  },
];

const photos = [
  { alt: "ПК-зал" },
  { alt: "PS-зона" },
  { alt: "Ресепшн" },
  { alt: "VIP-зона" },
  { alt: "Общий вид" },
  { alt: "Ночной режим" },
];