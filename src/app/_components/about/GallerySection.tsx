'use client';

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { photos } from "./constants";

export function GallerySection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else {
      setSelectedIndex(photos.length - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      setSelectedIndex(0);
    }
  };

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, selectedIndex]);

  // Текущее фото для модального окна
  const currentPhoto = photos[selectedIndex];

  return (
    <>
        <div className="mt-8 relative">
          {/* Карусель */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {photos.map((photo: any, index: any) => (
                <div
                  key={photo.alt}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-0.5rem)] lg:flex-[0_0_calc(33.333%-0.75rem)]"
                >
                  <div
                    onClick={() => openModal(index)}
                    className="group relative overflow-hidden rounded-sm border border-[#1e1540] bg-gradient-to-br from-[#120e24] to-[#0e0b1a] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-violet-500/50"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={photo.image}
                        alt={photo.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                        <p className="text-sm font-medium text-white">{photo.alt}</p>
                        <p className="text-xs text-violet-200/60">{photo.desc}</p>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="rounded-full bg-black/50 p-1.5 backdrop-blur-sm">
                          <ZoomIn className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Кнопки навигации */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 backdrop-blur-sm transition-all hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 backdrop-blur-sm transition-all hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>

      {/* Модальное окно для просмотра фото */}
      {isModalOpen && currentPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative max-w-5xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5 text-white" />
            </button>

            <button
              onClick={goToPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            <div className="relative aspect-video overflow-hidden rounded-sm">
              <Image
                src={currentPhoto.image}
                alt={currentPhoto.alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-white">
                {currentPhoto.alt}
              </p>
              <p className="text-sm text-violet-200/60">
                {currentPhoto.desc}
              </p>
              <p className="mt-2 text-xs text-violet-400/40">
                {selectedIndex + 1} / {photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}