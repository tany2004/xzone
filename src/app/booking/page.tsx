import BookingPage from "~/app/booking/BookingPage";
import { api } from "~/trpc/server";

export default async function Page() {
  const clubs = await api.club.getAll();

  return <BookingPage clubs={clubs} />;
}