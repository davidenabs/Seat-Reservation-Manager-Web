import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueries, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BookingService } from "@/services/bookingService";
import { HallService } from "@/services/hallService";
import { ROUTES } from "@/config/route";
import type { IReservationPayload } from "@/intefaces/reservation";
import type { ISeat } from "@/intefaces/seats";
import type { ReservationFormData } from "@/schemas/reservationSchema";
import api from "@/lib/api-client";

export const useSeatReservation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);
  const [searchParams] = useSearchParams();
  const initialHallId = searchParams.get("hallId") || "";
  const [selectedHallId, setSelectedHallId] = useState<string>(initialHallId);

  const [editEmail, setEditEmail] = useState<string | null>(null);

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
    queries: selectedDates.map((date) => {
      const localDate = new Date(date);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
      const formattedDate = localDate.toISOString().split("T")[0];
      return {
        queryKey: ["seats", formattedDate, selectedHallId],
        queryFn: () => BookingService.fetchAvailableSeats(formattedDate, selectedHallId),
        enabled: !!date && !!selectedHallId,
        staleTime: 30000,
        gcTime: 300000,
      };
    }),
  });

  const editMutation = useMutation({
    mutationFn: async (payload: { email: string; hallId: string; newEventDates: string[] }) => {
      const res = await api.post("/bookings/modify-unpaid", payload);
      return res;
    },
    onSuccess: (data) => {
      if (data.success && data.data?.baseRef) {
        navigate(`${ROUTES.PAYMENT_OPTIONS}?ref=${data.data.baseRef}`);
      } else {
        toast.success(data.message || "Bookings updated");
        navigate(ROUTES.HOME);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update bookings");
    }
  });

  const reservationMutation = useMutation({
    mutationFn: (payload: IReservationPayload) => BookingService.reserveSeat(payload),
    onSuccess: (data: any, variables: IReservationPayload) => {
      // The backend returns the unwrapped data (IReservationResponse)
      if (data) {
        if (data.requiresOTP) {
          localStorage.setItem("bookingEmail", variables.email);
          if (data.reservationToken) {
            localStorage.setItem("reservationToken", data.reservationToken);
          }
          toast.success(data.message || "Please verify your email.");
          navigate(ROUTES.VERIFY.replace(":tempId", data.tempId));
          return;
        }

        if (data.requiresPayment || data.paymentLinkNGN) {
          const totalNGN = activeHall?.isMultipleDaysBookingEnabled 
            ? (activeHall.paymentPriceNGN || 0) * selectedDates.length
            : (activeHall?.paymentPriceNGN || 0) * selectedSeats.length;
            
          const totalUSD = activeHall?.isMultipleDaysBookingEnabled 
            ? (activeHall.paymentPriceUSD || 0) * selectedDates.length
            : (activeHall?.paymentPriceUSD || 0) * selectedSeats.length;

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
    // Only wipe seats if we are not in edit mode
    if (!editEmail) {
      setSelectedSeats([]);
    }
  }, [selectedDate, editEmail]);

  const handleSeatClick = (seat: ISeat) => {
    if (!seat.isAvailable) return;

    if (selectedSeats.find((s: ISeat) => s.number === seat.number)) {
      setSelectedSeats(selectedSeats.filter((s: ISeat) => s.number !== seat.number));
    } else if (selectedSeats.length < (activeHall?.maxSeatsPerUser ?? 2)) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      toast.error(`You can only select up to ${activeHall?.maxSeatsPerUser} seats.`);
    }
  };

  const handleReserveSeat = () => {
    if (editEmail) {
      // In edit mode, submit modification directly
      editMutation.mutate({
        email: editEmail,
        hallId: selectedHallId,
        newEventDates: (activeHall?.isMultipleDaysBookingEnabled ? selectedDates : (selectedDate ? [selectedDate] : [])).map(d => {
          const local = new Date(d);
          local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
          return local.toISOString();
        })
      });
      return;
    }
    
    if (activeHall?.isMultipleDaysBookingEnabled) {
      if (selectedDates.length === 0) return;
    } else {
      if (selectedSeats.length === 0) return;
    }
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
    editMutation,
    handleSeatClick,
    handleReserveSeat,
    handleFormSubmit,
    navigate,
    editEmail,
    setEditEmail
  };
};
