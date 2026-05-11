import Link from "next/link";
import { RecentBookingCard } from "./RecentBookingCard";

interface RecentBookingsProps {
  bookings: any[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="mt-16">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Последние бронирования</h2>
          <p className="text-sm text-violet-200/50">Недавние активности</p>
        </div>
        <Link
          href="/manage/booking"
          className="text-xs text-violet-400 hover:text-teal-400 transition-colors"
        >
          Все бронирования →
        </Link>
      </div>
      <div className="space-y-2">
        {bookings.map((booking) => (
          <RecentBookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}