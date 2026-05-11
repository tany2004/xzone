"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTelegramPlane, FaVk } from "react-icons/fa";

const links = [
  { href: "/", label: "Главная" },
  { href: "/pricing", label: "Прайс" },
  { href: "/about", label: "О клубе" },
];

const MaxIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3C7.03 3 3 6.7 3 11.2C3 13.5 4.2 15.6 6 17.1V21L9.6 18.9C10.4 19.1 11.2 19.2 12 19.2C16.97 19.2 21 15.5 21 11C21 6.5 16.97 3 12 3Z" />
    <path d="M6 17.1L3 21L5.5 18.5" opacity="0.8" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[#1e1540] bg-[#0e0b1a]">
      <div className="mx-auto flex max-w-6xl items-stretch h-[58px]">

        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2.5 px-5 border-r border-[#1e1540] min-w-[160px]">
          <div className="w-9 h-9 bg-violet-800 rounded flex items-center justify-center p-1.5">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <rect x="3" y="3" width="8" height="8" rx="1" fill="#c4b5fd"/>
              <rect x="13" y="3" width="8" height="8" rx="1" fill="#5b21b6"/>
              <rect x="3" y="13" width="8" height="8" rx="1" fill="#5b21b6"/>
              <rect x="13" y="13" width="8" height="8" rx="1" fill="#2dd4bf"/>
            </svg>
          </div>
          <div className="flex flex-col leading-none gap-0.5">
            <span className="text-white text-[17px] font-bold tracking-wide">XZone</span>
            <span className="text-violet-700 text-[9px] tracking-[3px] uppercase">cybersport</span>
          </div>
        </Link>

        {/* Меню → якорь на еду */}
        <Link
          href="/pricing#food"
          className="flex items-center gap-1.5 px-4 border-r border-[#1e1540] text-violet-300 text-[13px] font-semibold uppercase tracking-wide hover:text-white transition-colors"
        >
          <span>Меню</span>
          <div className="flex gap-0.5 items-center">
            <div className="w-[6px] h-[9px] bg-violet-900" style={{clipPath:"polygon(0 0,100% 50%,0 100%)"}}/>
            <div className="w-[6px] h-[9px] bg-violet-700" style={{clipPath:"polygon(0 0,100% 50%,0 100%)"}}/>
            <div className="w-[6px] h-[9px] bg-violet-400" style={{clipPath:"polygon(0 0,100% 50%,0 100%)"}}/>
          </div>
        </Link>

        {/* Ссылки */}
        <nav className="flex items-stretch flex-1 px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-3.5 text-[13px] border-b-2 transition-colors ${
                pathname === link.href
                  ? "text-white border-teal-400"
                  : "text-violet-300 border-transparent hover:text-white hover:border-violet-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Кнопка бронирования */}
        <div className="flex items-center px-4">
          <Link
            href="/booking"
            className="relative overflow-hidden text-white text-[11px] font-bold tracking-[2px] uppercase px-5 py-2.5 rounded-sm transition-all duration-300 hover:scale-105 hover:brightness-125 active:scale-95 group"
            style={{background: "linear-gradient(90deg, #7c3aed 0%, #0d9488 100%)"}}
          >
            <span className="relative z-10">Забронировать место</span>
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{background: "linear-gradient(90deg, #0d9488 0%, #7c3aed 100%)"}}
            />
          </Link>
        </div>

        {/* Соцсети — короче некуда */}
        <div className="flex items-center gap-1.5 px-4 border-l border-[#1e1540]">
          <SocialIcon href="https://t.me/xzoneclub" icon={<FaTelegramPlane size={14} />} />
          <SocialIcon href="https://vk.com/xz.omsk" icon={<FaVk size={14} />} />
          <SocialIcon href="https://max.ru/u/f9LHodD0cOL4IjC6msjvky8EGwCX-aIyUUD_iHjeDT3DG0LfuiaNFfSLYWw" icon={<MaxIcon />} />
        </div>

      </div>
    </header>
  );
}

// Вынес повторяющийся элемент в отдельный компонент
function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-[30px] h-[30px] rounded-full border border-[#2a1f4a] flex items-center justify-center text-violet-400 hover:border-violet-700 hover:bg-[#1e1540] hover:text-violet-300 transition-colors"
    >
      {icon}
    </a>
  );
}