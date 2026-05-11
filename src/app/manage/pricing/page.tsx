import { api } from "~/trpc/server";
import ManagePricingClient from "~/app/_components/manage/pricing/ManagePricingClient";

export default async function ManagePricingPage() {
  const clubs = await api.club.getAll();
  const rules = await Promise.all(
    clubs.map(async (club) => ({
      club,
      rules: await api.pricing.getByClub({ clubId: club.id }),
    })),
  );
  
  return <ManagePricingClient initialData={rules} />;
}