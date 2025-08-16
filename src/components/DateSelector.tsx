import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  validDates: Array<{ value: string; label: string }>;
}

const DateSelector = ({ selectedDate, onDateChange, validDates }: DateSelectorProps) => {
  return (
    <Card className="border-0 border-t-3 border-t-[#FD690C] shadow-none mb-6">
      <CardHeader>
        <CardTitle className="text-[24px] font-SignateGroteskBlack">Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedDate} onValueChange={onDateChange}>
          <SelectTrigger className="w-full rounded-full !border-[#eee]">
            <SelectValue placeholder="Select a Date" />
          </SelectTrigger>
          <SelectContent className=" ">
            {validDates.map((date) => (
              <SelectItem key={date.value} value={date.value}>
                {date.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default DateSelector;