import { PrismaClient, SeatType, PricingPeriod } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.hall.deleteMany();
  await prisma.pricingRule.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.club.deleteMany();

  // ─── Клубы ───────────────────────────────────────────────────────

  const ciolkovskogo = await prisma.club.create({
    data: {
      name: "Циолковского",
      address: "ул. Циолковского, 6",
      phone: "+7 900 000-00-01",
    },
  });

  const serova = await prisma.club.create({
    data: {
      name: "Серова",
      address: "ул. Серова, 16А",
      phone: "+7 900 000-00-02",
    },
  });

  // ─── Залы Циолковского ───────────────────────────────────────────

  const c_ps = await prisma.hall.create({
    data: { clubId: ciolkovskogo.id, name: "1 этаж — PS-зона", type: SeatType.PS },
  });

  const c_floor1 = await prisma.hall.create({
    data: { clubId: ciolkovskogo.id, name: "1 этаж — ПК", type: SeatType.PC },
  });

  const c_basement1 = await prisma.hall.create({
    data: { clubId: ciolkovskogo.id, name: "Цоколь — Зал 1", type: SeatType.PC },
  });

  const c_basement2 = await prisma.hall.create({
    data: { clubId: ciolkovskogo.id, name: "Цоколь — Зал 2", type: SeatType.PC },
  });

  // ─── Места Циолковского ──────────────────────────────────────────

  await prisma.seat.createMany({
    data: Array.from({ length: 6 }, (_, i) => ({
      hallId: c_ps.id,
      label: String(i + 1),
      seatType: SeatType.PS,
      isBlocked: false,
    })),
  });

  await prisma.seat.createMany({
    data: Array.from({ length: 8 }, (_, i) => ({
      hallId: c_floor1.id,
      label: String(i + 7),
      seatType: SeatType.PC,
      isBlocked: false,
    })),
  });

  await prisma.seat.createMany({
    data: Array.from({ length: 21 }, (_, i) => ({
      hallId: c_basement1.id,
      label: String(i + 15),
      seatType: SeatType.PC,
      isBlocked: false,
    })),
  });

  await prisma.seat.createMany({
    data: Array.from({ length: 28 }, (_, i) => ({
      hallId: c_basement2.id,
      label: String(i + 36),
      seatType: SeatType.PC,
      isBlocked: false,
    })),
  });

  // ─── Залы Серова ─────────────────────────────────────────────────

  const s_main = await prisma.hall.create({
    data: { clubId: serova.id, name: "Главный зал", type: SeatType.PC },
  });

  // ─── Места Серова ────────────────────────────────────────────────

  await prisma.seat.createMany({
    data: Array.from({ length: 26 }, (_, i) => ({
      hallId: s_main.id,
      label: String(i + 1),
      seatType: SeatType.PC,
      isBlocked: false,
    })),
  });

  // ─── Тарифы ПК (одинаковые для обоих клубов) ─────────────────────

  const pcRules = (clubId: string) => [
    // Почасовые
    { clubId, seatType: SeatType.PC, period: PricingPeriod.MORNING,        pricePerHour: 70  }, // 08:00–12:00
    { clubId, seatType: SeatType.PC, period: PricingPeriod.DAY,            pricePerHour: 80  }, // 12:00–17:00
    { clubId, seatType: SeatType.PC, period: PricingPeriod.EVENING,        pricePerHour: 90  }, // 17:00–08:00
    // Пакеты (pricePerHour хранит итоговую стоимость пакета)
    { clubId, seatType: SeatType.PC, period: PricingPeriod.PACK_3H,        pricePerHour: 210 }, // 3 часа
    { clubId, seatType: SeatType.PC, period: PricingPeriod.PACK_5H,        pricePerHour: 320 }, // 5 часов
    { clubId, seatType: SeatType.PC, period: PricingPeriod.NIGHT_WEEKDAY,  pricePerHour: 350 }, // Ночной будни
    { clubId, seatType: SeatType.PC, period: PricingPeriod.NIGHT_WEEKEND,  pricePerHour: 400 }, // Ночной выходные
  ];

  await prisma.pricingRule.createMany({ data: pcRules(ciolkovskogo.id) });
  await prisma.pricingRule.createMany({ data: pcRules(serova.id) });

  // ─── Тарифы PS5 (только Циолковского) ────────────────────────────

  await prisma.pricingRule.createMany({
    data: [
      { clubId: ciolkovskogo.id, seatType: SeatType.PS, period: PricingPeriod.HOURLY,       pricePerHour: 200 }, // 1 час
      { clubId: ciolkovskogo.id, seatType: SeatType.PS, period: PricingPeriod.NIGHT_WEEKDAY, pricePerHour: 400 }, // Ночной пакет
    ],
  });

  // ─── Админ ───────────────────────────────────────────────────────

  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.admin.create({
    data: { login: "admin", passwordHash },
  });

  console.log("✅ Seed завершён");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });