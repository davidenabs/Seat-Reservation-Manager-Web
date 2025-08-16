import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReservationFormSchema, type ReservationFormData } from "../schemas/reservationSchema";
import { Ticket } from "lucide-react";

interface ReservationFormProps {
  selectedDate: string;
  selectedSeats: Array<{ number: number; label: string }>;
  validDates: Array<{ value: string; label: string }>;
  onSubmit: (data: ReservationFormData) => void;
  isSubmitting: boolean;
}

const ReservationForm = ({
  selectedDate,
  selectedSeats,
  validDates,
  onSubmit,
  isSubmitting
}: ReservationFormProps) => {
  const form = useForm<ReservationFormData>({
    resolver: zodResolver(ReservationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: undefined,
      ageRange: undefined,
    },
  });

  const handleSubmit = (data: ReservationFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-4">
      {/* Reservation Details */}
      <Card className="mb-6 border-0 border-t-3 border-t-[#FD690C] shadow-none">
        <CardHeader>
          <CardTitle className="text-[24px]">Ticket Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="flex justify-between"><span>Date:</span> {validDates.find(d => d.value === selectedDate)?.label}</p>
          <p className="flex justify-between"><span>Time:</span> 4:00PM</p>
          <p className="flex justify-between"><span>Selected Seats:</span> {selectedSeats.map(s => s.label).join(', ')}</p>
        </CardContent>
      </Card>
      <Card className="border-0  shadow-none">
        <CardHeader>
          <CardTitle className="text-[24px]">Register</CardTitle>
        </CardHeader>
        <CardContent>


          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="email" placeholder="Your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="tel" placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              {/* Age Range */}
              <FormField
                control={form.control}
                name="ageRange"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Age Range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="18-25">18-25</SelectItem>
                        <SelectItem value="26-35">26-35</SelectItem>
                        <SelectItem value="36-45">36-45</SelectItem>
                        <SelectItem value="46-55">46-55</SelectItem>
                        <SelectItem value="55+">55+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-[48px] rounded-full"
                disabled={isSubmitting}
              >
                <Ticket fill="" />
                {isSubmitting ? 'Processing...' : 'Reserve Seat'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationForm;