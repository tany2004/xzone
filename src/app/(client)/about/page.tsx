import { HardwareTabsClient } from "~/app/_components/about/HardwareTabsClient";
import { GallerySection } from "~/app/_components/about/GallerySection";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Заголовок */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-500">
          Кто мы
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">О клубе</h1>
        <div className="mt-6 max-w-2xl space-y-4">
          <p className="text-sm leading-relaxed text-violet-200/60">
            XZone — компьютерный клуб для тех, кто ценит качество. Мы открылись
            в 2002 году и с тех пор работаем круглосуточно без выходных. У нас два
            зала в разных районах города — выбирай тот, что ближе.
          </p>
          <p className="text-sm leading-relaxed text-violet-200/60">
            Всё оборудование регулярно обновляется. Мы следим за тем, чтобы каждый
            компьютер работал стабильно и без лагов. Кроме игр — напитки, печать
            документов и комфортная атмосфера.
          </p>
        </div>
      </section>

      {/* Железо с вкладками */}
      <section className="mt-20">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-500">
          Конфигурации
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">
          ОБЩИЙ ЗАЛ / PS AREA
        </h2>
        <p className="mt-1 text-sm text-violet-200/50">
          Мощное железо для комфортной игры
        </p>
        
        <HardwareTabsClient />
      </section>

      {/* Фото залов */}
      <section className="mt-20">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-500">
          Интерьер
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">Наши залы</h2>
        <p className="mt-1 text-sm text-violet-200/50">
          Атмосфера, в которой хочется играть
        </p>
        
        <div className="mt-8">
          <GallerySection />
        </div>
      </section>
    </div>
  );
}