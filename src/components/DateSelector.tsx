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

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  validDates: Array<{ value: string; label: string }>;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Convert selected date string to Date object for calendar
  const selectedDateObj = selectedDate ? new Date(selectedDate) : undefined;

  // Generate disabled dates function
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable if date is today or in the past
    if (date <= today) return true;
    
    // Disable if date is more than 30 days in the future
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);
    if (date > maxDate) return true;
    
    // Disable weekends (Saturday = 6, Sunday = 0)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return true;
    
    return false;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // const dateString = date.toISOString().split('T')[0];
      onDateChange(date.toDateString());
      setIsOpen(false);
    }
  };

  // Format the selected date for display
  const formatSelectedDate = (dateString: string) => {
    if (!dateString) return "Select a Date";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="border-0 border-t-3 border-t-[#FD690C] shadow-none mb-6">
      <CardHeader>
        <CardTitle className="text-[24px] font-SignateGroteskBlack">Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal rounded-full !border-[#eee] h-10 px-3",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {formatSelectedDate(selectedDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDateObj}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default DateSelector;
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// interface DateSelectorProps {
//   selectedDate: string;
//   onDateChange: (date: string) => void;
//   validDates: Array<{ value: string; label: string }>;
// }

// const DateSelector = ({ selectedDate, onDateChange, validDates }: DateSelectorProps) => {
//   return (
//     <Card className="border-0 border-t-3 border-t-[#FD690C] shadow-none mb-6">
//       <CardHeader>
//         <CardTitle className="text-[24px] font-SignateGroteskBlack">Schedule</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Select value={selectedDate} onValueChange={onDateChange}>
//           <SelectTrigger className="w-full rounded-full !border-[#eee]">
//             <SelectValue placeholder="Select a Date" />
//           </SelectTrigger>
//           <SelectContent className=" ">
//             {validDates.map((date) => (
//               <SelectItem key={date.value} value={date.value}>
//                 {date.label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </CardContent>
//     </Card>
//   );
// };

// export default DateSelector;