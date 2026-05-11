import BookingPage from "~/app/_components/booking/BookingPage";
import { api } from "~/trpc/server";

export default async function Page() {
  const clubs = await api.club.getAll();

  return <BookingPage clubs={clubs} />;
}