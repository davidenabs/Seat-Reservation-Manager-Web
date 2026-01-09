import { useState } from "react";
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

  // Compute initialFocus date for the calendar
  // If there's a selected date, focus that.
  // Otherwise, if there's settings?.reservationOpenDate, focus that.
  // Otherwise, undefined (let the calendar default).
  const initialFocusDate =
    selectedDateObj ??
    (settings?.reservationOpenDate
      ? new Date(settings.reservationOpenDate)
      : undefined);

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
    const manuallyDisabledDates = ["2026-01-22"].map((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });
    if (manuallyDisabledDates.includes(normalizedDate.getTime())) return true;

    return false;
  };

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
              {error && !isLoading && (
                <div className="text-red-500 text-sm mb-2">{error.message}</div>
              )}
              <Calendar className="mr-2 h-4 w-4" />
              {isLoading ? "Loading…" : formatSelectedDate(selectedDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDateObj}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              initialFocus
              // We add the following for auto-focus on reservationOpenDate
              defaultMonth={initialFocusDate}
            />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default DateSelector;
