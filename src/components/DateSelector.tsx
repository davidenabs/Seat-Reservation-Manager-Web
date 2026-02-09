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
import type { ISettings } from "@/intefaces/settings";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  settings: ISettings | null;
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

const DateSelector = ({
  selectedDate,
  onDateChange,
  isLoading,
  error,
  // onRetry,
  settings,
}: DateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Setup reservation allowed date range from settings
  const minDate =
    settings?.reservationOpenDate !== undefined
      ? new Date(settings.reservationOpenDate)
      : null;
  const maxDate =
    settings?.reservationCloseDate !== undefined
      ? new Date(settings.reservationCloseDate)
      : null;

  // Normalize time for min/max
  if (minDate) minDate.setHours(0, 0, 0, 0);
  if (maxDate) maxDate.setHours(23, 59, 59, 999);

  // Get array of working days from settings (e.g. [1, 2, 3, 4, 5] for Mon-Fri)
  const workingDays: number[] = Array.isArray(settings?.workingDays)
    ? settings.workingDays.map(Number)
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
    const blockedDates = settings?.blockedDates || [];
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
  }, [minDate, maxDate, workingDays, settings, selectedDate]); // dependencies: all affecting enablement

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
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(date.toISOString());
      setIsOpen(false);
    }
  };

  return (
    <Card className="border-0 border-t-3 border-t-[#FD690C] shadow-none mb-6">
      <CardHeader>
        <CardTitle className="text-[24px] font-SignateGroteskBlack">
          Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            <CalendarComponent
              mode="single"
              selected={selectedDateObj}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              initialFocus
              // defaultMonth goes to either selected or (first enabled date's month)
              defaultMonth={initialFocusDate}
            />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default DateSelector;
