import { api } from "~/trpc/server";
import ManageBookingsClient from "~/app/_components/manage/ManageBookingsClient";
import ManageBlacklistClient from "~/app/_components/manage/ManageBlacklistClient";

interface PageProps {
  searchParams: Promise<{
    filter?: string;
    clubId?: string;
    date?: string;
    status?: string;
  }>;
}

export default async function BookingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const clubs = await api.club.getAll();
  
  // Передаем параметры фильтрации в клиентский компонент
  return (
    <>
      <ManageBookingsClient 
        clubs={clubs} 
        initialFilter={params.filter}
        initialClubId={params.clubId}
        initialDate={params.date}
        initialStatus={params.status}
      />
      <ManageBlacklistClient />
    </>
  );
}