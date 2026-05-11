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
      {/* Заголовок в стиле сайта */}
      <div className="border-b border-[#1e1540] pb-6 mb-8">
        <h1 className="text-3xl font-bold text-white">Бронирование</h1>
        <p className="mt-2 text-violet-200/60">
          Выбери клуб, дату и время — затем место на карте
        </p>
      </div>

      <div className="space-y-8">
        <ClubSelector
          clubs={clubs}
          selectedClubId={selectedClubId}
          onChange={handleClubChange}
        />

        <DateTimePicker
          startsAt={startsAt}
          endsAt={endsAt}
          onChangeStartsAt={setStartsAt}
          onChangeEndsAt={setEndsAt}
        />

        <SeatMap
          clubs={clubs}
          selectedClubId={selectedClubId}
          startsAt={startsAt}
          endsAt={endsAt}
          selectedSeatId={selectedSeatId}
          isReady={mapReady}
          onSelect={setSelectedSeatId}
        />

        {canProceed && step === "select" && (
          <div className="flex justify-end pt-4 border-t border-[#1e1540]">
            <button
              onClick={() => setStep("form")}
              className="relative overflow-hidden rounded-sm px-8 py-3 text-sm font-bold uppercase tracking-[2px] text-white transition-all duration-300 hover:scale-105 hover:brightness-125 active:scale-95 group"
              style={{ background: "linear-gradient(90deg, #7c3aed 0%, #0d9488 100%)" }}
            >
              <span className="relative z-10">Продолжить</span>
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(90deg, #0d9488 0%, #7c3aed 100%)" }}
              />
            </button>
          </div>
        )}

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