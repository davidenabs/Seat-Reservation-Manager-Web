import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IHall } from "@/services/hallService";

interface EventAndDateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedDates?: string[];
  onDatesChange?: (dates: string[]) => void;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  halls: IHall[];
  selectedHallId: string;
  onHallChange: (id: string) => void;
}

// Helper: format date for display
const formatSelectedDate = (dateString: string) => {
  if (!dateString) return "Select a Date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const EventAndDateSelector = ({
  selectedDate,
  onDateChange,
  selectedDates = [],
  onDatesChange,
  isLoading,
  error,
  // onRetry,
  halls,
  selectedHallId,
  onHallChange,
}: EventAndDateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeHall = useMemo(() => halls?.find((hall) => hall._id === selectedHallId), [halls, selectedHallId]);

  // Setup reservation allowed date range from settings
  const minDate =
    activeHall?.reservationOpenDate !== undefined
      ? new Date(activeHall.reservationOpenDate)
      : null;
  const maxDate =
    activeHall?.reservationCloseDate !== undefined
      ? new Date(activeHall.reservationCloseDate)
      : null;

  // Normalize time for min/max
  if (minDate) minDate.setHours(0, 0, 0, 0);
  if (maxDate) maxDate.setHours(23, 59, 59, 999);

  // Get array of working days from settings (e.g. [1, 2, 3, 4, 5] for Mon-Fri)
  const workingDays: number[] = Array.isArray(activeHall?.workingDays)
    ? activeHall.workingDays.map(Number)
    : [];

  // Convert selected date string to Date object for calendar
  const selectedDateObj = selectedDate ? new Date(selectedDate) : undefined;

  // Disable dates logic as per requirements:
  // - Only enable dates inside reservationOpenDate <= date <= reservationCloseDate
  // - Only allow days of week that are present in workingDays array
  // - Don't allow past dates (before today)
  const isDateDisabled = (date: Date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    // 1. Only enable between reservation window
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;

    // 2. Only enable future dates (remove today & past)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // 3. Only enable working days (0=Sunday, ..., 6=Saturday)
    const dayOfWeek = date.getDay();
    if (!workingDays.includes(dayOfWeek)) return true;

    // 4. Manually disable January 22, 2026
    const blockedDates = activeHall?.blockedDates || [];
    // console.log({blockedDates});

    const manuallyDisabledDates = blockedDates.map((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });
    if (manuallyDisabledDates.includes(normalizedDate.getTime())) return true;

    return false;
  };

  // Find first enabled (not disabled) date in the month range
  const getFirstEnabledDate = useMemo(() => {
    // Start at minDate or today (whichever is later)
    let cursor = minDate ? new Date(minDate) : new Date();
    const today = new Date();
    cursor.setHours(0, 0, 0, 0);
    if (cursor < today) cursor = new Date(today);

    // Search up to maxDate
    const lastDate = maxDate
      ? new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0, 0)
      : undefined;
    for (
      let i = 0;
      (!lastDate || cursor <= lastDate) && i < 366;
      cursor.setDate(cursor.getDate() + 1), i++
    ) {
      if (!isDateDisabled(cursor)) {
        return new Date(cursor); // Need a new instance because calendar may mutate
      }
    }
    return minDate || today;
  }, [minDate, maxDate, workingDays, activeHall, selectedDate]); // dependencies: all affecting enablement

  // Compute initialFocus date for the calendar
  // If there's a selected date, focus that.
  // Otherwise, go to enabled date month.
  const initialFocusDate =
    selectedDateObj
      ? selectedDateObj
      : getFirstEnabledDate
        ? new Date(getFirstEnabledDate.getFullYear(), getFirstEnabledDate.getMonth(), 1)
        : undefined;

  // Handle calendar selection
  const isMultiple = activeHall?.isMultipleDaysBookingEnabled;
  const handleDateSelect = (date: Date | undefined) => {
    if (!isMultiple && date) {
      onDateChange(date.toISOString());
      setIsOpen(false);
    }
  };
  const handleDatesSelect = (dates: Date[] | undefined) => {
    if (isMultiple && onDatesChange) {
      onDatesChange(dates?.map(d => d.toISOString()) || []);
    }
  };

  return (
    <Card className="border-0 border-t-3 border-t-[#FD690C] shadow-none mb-6">
      <CardHeader>
        <CardTitle className="text-[24px] font-SignateGroteskBlack">
          Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {halls && halls.length > 0 && (
          <Select
            value={selectedHallId}
            onValueChange={(val) => {
              onHallChange(val)

            }}
          >
            <SelectTrigger className="w-full h-[48px]">
              <SelectValue placeholder="Select an Event Center" />
            </SelectTrigger>
            <SelectContent>
              {halls.map((hall) => (
                <SelectItem key={hall._id} value={hall._id!}>
                  {hall.name} - {hall.city}, {hall.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={isLoading}
              className={cn(
                "w-full justify-start text-left font-normal rounded-full !border-[#eee] h-10 px-3",
                isLoading && "cursor-not-allowed opacity-50",
                !selectedDate && "text-muted-foreground"
              )}
            >
              {/* Button content with error and state awareness */}
              <span className="flex items-center w-full">
                <Calendar className="mr-2 h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">
                  {isLoading ? (
                    <span className="text-gray-400">Loading…</span>
                  ) : isMultiple ? (
                    selectedDates.length > 0 ? `${selectedDates.length} days selected` : <span className="text-muted-foreground">Select dates</span>
                  ) : selectedDate ? (
                    formatSelectedDate(selectedDate)
                  ) : (
                    <span className="text-muted-foreground">Select a date</span>
                  )}
                </span>
              </span>
              {error && !isLoading && (
                <div className="text-muted-foreground text-xs mt2">{error.message}</div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {isMultiple ? (
              <CalendarComponent
                mode="multiple"
                selected={selectedDates.map(d => new Date(d))}
                onSelect={handleDatesSelect}
                disabled={isDateDisabled}
                initialFocus
                defaultMonth={initialFocusDate}
              />
            ) : (
              <CalendarComponent
                mode="single"
                selected={selectedDateObj}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                initialFocus
                defaultMonth={initialFocusDate}
              />
            )}
          </PopoverContent>
        </Popover>


        {/* If the event hall is paid, should the price be shown */}
        {activeHall?.isPaymentEnabled && (activeHall.paymentPriceNGN || activeHall.paymentPriceUSD) && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl py-2 px-3 w-full flex items-start gap-3">
            <div className="text-gray-600 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
            </div>
            <div>
              <p className="text-gray-800 text-sm font-medium mb-1">
                Ticket Price (per day)
              </p>
              <p className="text-gray-700 text-sm font-semibold">
                {activeHall.paymentPriceNGN ? `₦${activeHall.paymentPriceNGN.toLocaleString()}` : ''}
                {activeHall.paymentPriceNGN && activeHall.paymentPriceUSD ? ' / ' : ''}
                {activeHall.paymentPriceUSD ? `$${activeHall.paymentPriceUSD.toLocaleString()}` : ''}
              </p>
              {activeHall.isMultipleDaysBookingEnabled && activeHall.discountConfig?.minDays ? (
                 <p className=" text-xs mt-1 font-medium px-2 py-1 rounded inline-block border">
                   Book {activeHall.discountConfig.minDays}+ days to get 
                   {activeHall.discountConfig.discountAmountNGN ? ` ₦${activeHall.discountConfig.discountAmountNGN.toLocaleString()}` : ''}
                   {activeHall.discountConfig.discountAmountNGN && activeHall.discountConfig.discountAmountUSD ? ' / ' : ''}
                   {activeHall.discountConfig.discountAmountUSD ? ` $${activeHall.discountConfig.discountAmountUSD.toLocaleString()}` : ''} off!
                 </p>
              ) : null}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventAndDateSelector;
