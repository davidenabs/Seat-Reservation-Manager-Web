import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { Sparkles, User, Maximize2 } from "lucide-react";
import type { IHall } from "@/services/hallService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GuestSpotlightProps {
  hall?: IHall | null;
  selectedDates: string[];
  className?: string;
}

const toDateKey = (value: string | Date): string => {
  if (typeof value === "string") {
    // If already YYYY-MM-DD, return directly to avoid UTC/local shift
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return format(d, "yyyy-MM-dd");
    }
    return value.slice(0, 10);
  }
  return value.toISOString().split("T")[0];
};

export const GuestSpotlight: React.FC<GuestSpotlightProps> = ({
  hall,
  selectedDates,
  className = "",
}) => {
  const [previewGuest, setPreviewGuest] = useState<{
    dateKey: string;
    guestName?: string;
    flyerImage?: string;
  } | null>(null);

  const matchedGuests = useMemo(() => {
    const appearances = hall?.guestAppearances;
    if (!appearances || appearances.length === 0 || selectedDates.length === 0) {
      return [];
    }

    const guestMap = new Map<
      string,
      { dateKey: string; guestName?: string; flyerImage?: string }
    >();

    appearances.forEach((item) => {
      if (!item.guestName && !item.flyerImage) return;
      // Backend stores date at UTC midnight; split('T')[0] preserves exact calendar date
      const key =
        typeof item.date === "string"
          ? item.date.split("T")[0]
          : item.date.toISOString().split("T")[0];
      guestMap.set(key, {
        dateKey: key,
        guestName: item.guestName,
        flyerImage: item.flyerImage,
      });
    });

    const uniqueSelectedKeys = Array.from(
      new Set(selectedDates.filter(Boolean).map(toDateKey))
    ).sort();

    return uniqueSelectedKeys
      .map((k) => guestMap.get(k))
      .filter(
        (g): g is { dateKey: string; guestName?: string; flyerImage?: string } =>
          !!g
      );
  }, [hall?.guestAppearances, selectedDates]);

  if (matchedGuests.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className={`rounded-2xl border border-[#FCD8CF] bg-gradient-to-br from-[#FFF8F6] to-white p-4 sm:p-5 shadow-sm ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E8593C]/10 text-[#E8593C]">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-sm font-bold text-gray-900">
              {matchedGuests.length === 1
                ? "Special Guest for Selected Date"
                : `Special Guests for Your Selected Dates (${matchedGuests.length})`}
            </h3>
          </div>
          {matchedGuests.length > 1 && (
            <span className="text-[11px] text-gray-500 hidden sm:inline">
              Click any flyer to enlarge
            </span>
          )}
        </div>

        {matchedGuests.length === 1 ? (
          // Single-date clean featured layout
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {matchedGuests[0].flyerImage && (
              <button
                type="button"
                onClick={() => setPreviewGuest(matchedGuests[0])}
                className="relative group w-full sm:w-36 aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden border border-[#FCD8CF] bg-white shrink-0 shadow-xs"
              >
                <img
                  src={matchedGuests[0].flyerImage}
                  alt={matchedGuests[0].guestName || "Guest flyer"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 right-2 bg-black/65 text-white p-1.5 rounded-full opacity-90 group-hover:opacity-100">
                  <Maximize2 className="w-3 h-3" />
                </span>
              </button>
            )}

            <div className="space-y-1.5 min-w-0">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFF4F0] text-[#E8593C] border border-[#FCD8CF]">
                {format(new Date(`${matchedGuests[0].dateKey}T12:00:00`), "EEEE, MMM d, yyyy")}
              </span>
              {matchedGuests[0].guestName ? (
                <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <User className="w-4 h-4 text-[#E8593C] shrink-0" />
                  <span>{matchedGuests[0].guestName}</span>
                </div>
              ) : (
                <p className="text-sm font-medium text-gray-700">
                  Guest flyer available for this session
                </p>
              )}
              {matchedGuests[0].flyerImage && (
                <button
                  type="button"
                  onClick={() => setPreviewGuest(matchedGuests[0])}
                  className="text-xs font-medium text-[#E8593C] hover:underline block pt-0.5"
                >
                  View full flyer →
                </button>
              )}
            </div>
          </div>
        ) : (
          // Multi-date compact horizontal/grid cards so multiple guests stay organized
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {matchedGuests.map((guest) => (
              <div
                key={guest.dateKey}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-gray-200/80 hover:border-[#E8593C]/40 transition-colors"
              >
                {guest.flyerImage ? (
                  <button
                    type="button"
                    onClick={() => setPreviewGuest(guest)}
                    className="relative group w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50"
                    title="Click to enlarge flyer"
                  >
                    <img
                      src={guest.flyerImage}
                      alt={guest.guestName || guest.dateKey}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <Maximize2 className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100" />
                    </span>
                  </button>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[#FFF4F0] border border-[#FCD8CF] flex items-center justify-center shrink-0 text-[#E8593C]">
                    <User className="w-5 h-5" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold text-[#E8593C]">
                    {format(new Date(`${guest.dateKey}T12:00:00`), "EEE, MMM d, yyyy")}
                  </div>
                  <div className="text-sm font-bold text-gray-900 truncate">
                    {guest.guestName || "Guest Flyer"}
                  </div>
                  {guest.flyerImage && (
                    <button
                      type="button"
                      onClick={() => setPreviewGuest(guest)}
                      className="text-[11px] text-gray-500 hover:text-[#E8593C] hover:underline mt-0.5"
                    >
                      View flyer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flyer Lightbox Modal */}
      <Dialog open={!!previewGuest} onOpenChange={(open) => !open && setPreviewGuest(null)}>
        <DialogContent className="max-w-lg p-4 sm:p-6 bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-gray-900">
              {previewGuest?.guestName || "Featured Guest Flyer"}
            </DialogTitle>
            {previewGuest?.dateKey && (
              <p className="text-xs text-[#E8593C] font-semibold">
                {format(new Date(`${previewGuest.dateKey}T12:00:00`), "EEEE, MMMM do, yyyy")}
              </p>
            )}
          </DialogHeader>
          {previewGuest?.flyerImage && (
            <div className="mt-2 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 max-h-[70vh] flex items-center justify-center">
              <img
                src={previewGuest.flyerImage}
                alt={previewGuest.guestName || "Guest flyer"}
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
