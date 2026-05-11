const clubs = [
  {
    name: "Клуб на Циолковского",
    address: "ул. Циолковского, 42",
    phone: "+7 900 000-00-01",
  },
  {
    name: "Клуб на Серова",
    address: "ул. Серова, 17",
    phone: "+7 900 000-00-02",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1540] bg-[#120e24]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-white">XZone</p>
            <p className="mt-2 text-sm text-violet-200/60">
              Компьютерный клуб. Работаем круглосуточно.
            </p>
          </div>

          {clubs.map((club) => (
            <div key={club.name}>
              <p className="font-medium text-white">{club.name}</p>
              <p className="mt-2 text-sm text-violet-200/60">{club.address}</p>
              <a
                href={`tel:${club.phone}`}
                className="mt-1 block text-sm text-violet-200/60 transition-colors hover:text-white">
              
                {club.phone}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-[#1e1540] pt-6 text-center text-xs text-violet-200/60">
          © {new Date().getFullYear()} XZone. Все права защищены.
        </div>
      </div>
    </footer>
  );
}