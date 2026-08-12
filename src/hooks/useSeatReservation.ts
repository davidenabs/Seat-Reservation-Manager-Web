import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BookingService } from "@/services/bookingService";
import { HallService } from "@/services/hallService";
import { ROUTES } from "@/config/route";
import type { IReservationPayload } from "@/intefaces/reservation";
import type { ISeat } from "@/intefaces/seats";
import type { ReservationFormData } from "@/schemas/reservationSchema";

export const useSeatReservation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);
  const [searchParams] = useSearchParams();
  const initialHallId = searchParams.get("hallId") || "";
  const [selectedHallId, setSelectedHallId] = useState<string>(initialHallId);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: seatsResponse, isLoading: isLoadingSeats, error: seatsError, refetch: refetchSeats } = useQuery({
    queryKey: ["seats", selectedDate, selectedHallId],
    queryFn: () => {
      const localDate = new Date(selectedDate);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
      const formattedDate = localDate.toISOString().split("T")[0];
      return BookingService.fetchAvailableSeats(formattedDate, selectedHallId);
    },
    enabled: !!selectedDate && !!selectedHallId,
    staleTime: 30000,
    gcTime: 300000,
  });

  const { data: halls, isLoading: isLoadingHalls } = useQuery({
    queryKey: ["halls"],
    queryFn: () => HallService.getHalls(),
  });

  useEffect(() => {
    if (halls && halls.length > 0 && !selectedHallId) {
      setSelectedHallId(halls[0]._id!);
    }
  }, [halls, selectedHallId]);

  const activeHall = useMemo(() => {
    if (!halls || !selectedHallId) return undefined;
    return halls.find((h) => h._id === selectedHallId);
  }, [halls, selectedHallId]);

  const multipleSeatsQueries = useQueries({
    queries: selectedDates.map(date => {
      return {
        queryKey: ["seats", date, selectedHallId],
        queryFn: () => {
          const localDate = new Date(date);
          localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
          const formattedDate = localDate.toISOString().split("T")[0];
          return BookingService.fetchAvailableSeats(formattedDate, selectedHallId);
        },
        enabled: activeHall?.isMultipleDaysBookingEnabled && !!date && !!selectedHallId,
        staleTime: 30000,
        gcTime: 300000,
      }
    })
  });

  const reservationMutation = useMutation({
    mutationFn: (payload: IReservationPayload) => BookingService.reserveSeat(payload),
    onSuccess: (data) => {
      const tempId = data.tempId;
      const reservationToken = data.reservationToken;

      if (tempId) {
        localStorage.setItem("reservationToken", reservationToken!);
        toast.success("Please check your email for verification code.");
        navigate(`/verify/${tempId}`);
      } else {
        queryClient.invalidateQueries({ queryKey: ["seats"] });

        if ((data as any).data?.paymentLinkNGN || (data as any).data?.paymentLinkUSD) {
          toast.success("Reservation saved! Please select your payment currency.");
          
          const numSelected = activeHall?.isMultipleDaysBookingEnabled ? selectedDates.length : (selectedDate ? 1 : 0);
          let totalNGN = (activeHall?.paymentPriceNGN || 0) * numSelected;
          let totalUSD = (activeHall?.paymentPriceUSD || 0) * numSelected;

          if (activeHall?.isMultipleDaysBookingEnabled && activeHall?.discountConfig?.minDays && numSelected >= activeHall.discountConfig.minDays) {
            totalNGN -= (activeHall.discountConfig.discountAmountNGN || 0);
            totalUSD -= (activeHall.discountConfig.discountAmountUSD || 0);
            if (totalNGN < 0) totalNGN = 0;
            if (totalUSD < 0) totalUSD = 0;
          }

          const bookingDataWithPrices = {
            ...data,
            priceNGN: totalNGN,
            priceUSD: totalUSD
          };
          localStorage.setItem("booking_details", JSON.stringify(bookingDataWithPrices));
          navigate(ROUTES.PAYMENT_OPTIONS);
          return;
        }

        toast.success(data.message || "Reservation successful!");
        localStorage.setItem("booking_details", JSON.stringify(data));

        setCurrentStep(1);
        setSelectedSeats([]);
        setSelectedDate("");
        navigate(ROUTES.BOOKING_SUCCESS);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Reservation failed. Please try again.");
    },
  });

  useEffect(() => {
    setSelectedSeats([]);
  }, [selectedDate]);

  const handleSeatClick = (seat: ISeat) => {
    if (!seat.isAvailable) return;

    if (selectedSeats.find((s: ISeat) => s.number === seat.number)) {
      setSelectedSeats(selectedSeats.filter((s: ISeat) => s.number !== seat.number));
    } else if (selectedSeats.length < (activeHall?.maxSeatsPerUser ?? 2)) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleReserveSeat = () => {
    if (selectedSeats.length === 0) return;
    setCurrentStep(2);
  };

  const handleFormSubmit = (formData: ReservationFormData) => {
    let payload: any = {
      hallId: selectedHallId,
      ...formData,
    };

    if (activeHall?.isMultipleDaysBookingEnabled) {
      payload.eventDates = selectedDates.map(d => {
        const local = new Date(d);
        local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
        return local.toISOString();
      });
      payload.seatNumbers = [];
      payload.seatLabels = [];
    } else {
      const localDate = new Date(selectedDate);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
      payload.eventDate = localDate.toISOString();
      payload.seatNumbers = selectedSeats.map((s: ISeat) => s.number);
      payload.seatLabels = selectedSeats.map((s: ISeat) => s.label);
    }

    localStorage.setItem("bookingEmail", formData.email);
    reservationMutation.mutate(payload);
  };

  return {
    currentStep,
    setCurrentStep,
    selectedDate,
    setSelectedDate,
    selectedDates,
    setSelectedDates,
    selectedSeats,
    setSelectedSeats,
    selectedHallId,
    setSelectedHallId,
    halls,
    activeHall,
    seatsResponse,
    isLoadingSeats,
    seatsError,
    refetchSeats,
    isLoadingHalls,
    multipleSeatsQueries,
    reservationMutation,
    handleSeatClick,
    handleReserveSeat,
    handleFormSubmit,
    navigate,
  };
};
