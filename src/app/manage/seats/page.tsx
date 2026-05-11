import { api } from "~/trpc/server";
import ManageSeatsClient from "~/app/_components/manage/ManageSeatsClient";

export default async function ManageSeatsPage() {
  const clubs = await api.club.getAll();
  return <ManageSeatsClient clubs={clubs} />;
}