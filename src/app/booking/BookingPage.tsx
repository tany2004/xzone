"use client";

import { useState } from "react";
import type { Club } from "@prisma/client";
import ClubSelector from "./ClubSelector";
import DateTimePicker from "./DateTimePicker";
import SeatMap from "./SeatMap";
import BookingForm from "./BookingForm";
import BookingSuccess from "./BookingSuccess";

type Step = "select" | "form" | "success";

interface Props {
  clubs: Club[];
}

export default function BookingPage({ clubs }: Props) {
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [startsAt, setStartsAt] = useState<Date | null>(null);
  const [endsAt, setEndsAt] = useState<Date | null>(null);
  const [step, setStep] = useState<Step>("select");
  const [bookingCode, setBookingCode] = useState<string>("");

  const canProceed =
    selectedSeatId !== null && startsAt !== null && endsAt !== null;

  const mapReady =
    selectedClubId !== null && startsAt !== null && endsAt !== null;

  function handleClubChange(clubId: string) {
    setSelectedClubId(clubId);
    setSelectedSeatId(null);
  }

  function handleSuccess(code: string) {
    setBookingCode(code);
    setStep("success");
  }

  if (step === "success") {
    return <BookingSuccess bookingCode={bookingCode} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white">Бронирование</h1>
      <p className="mt-2 text-zinc-400">
        Выбери клуб, дату и время — затем место на карте
      </p>

      <div className="mt-8 space-y-6">
        {/* Шаг 1: выбор клуба */}
        <ClubSelector
          clubs={clubs}
          selectedClubId={selectedClubId}
          onChange={handleClubChange}
        />

        {/* Шаг 2: выбор даты и времени */}
        <DateTimePicker
          startsAt={startsAt}
          endsAt={endsAt}
          onChangeStartsAt={setStartsAt}
          onChangeEndsAt={setEndsAt}
        />

        {/* Карта зала — всегда видна, но с оверлеем если не всё выбрано */}
        <SeatMap
          clubs={clubs}
          selectedClubId={selectedClubId}
          startsAt={startsAt}
          endsAt={endsAt}
          selectedSeatId={selectedSeatId}
          isReady={mapReady}
          onSelect={setSelectedSeatId}
        />

        {/* Кнопка перехода к форме */}
        {canProceed && step === "select" && (
          <div className="flex justify-end">
            <button
              onClick={() => setStep("form")}
              className="rounded-lg bg-violet-600 px-8 py-3 font-medium text-white transition-colors hover:bg-violet-500"
            >
              Продолжить
            </button>
          </div>
        )}

        {/* Форма с именем и телефоном */}
        {step === "form" && selectedSeatId && startsAt && endsAt && (
          <BookingForm
            seatId={selectedSeatId}
            startsAt={startsAt}
            endsAt={endsAt}
            onSuccess={handleSuccess}
            onBack={() => setStep("select")}
          />
        )}
      </div>
    </div>
  );
}