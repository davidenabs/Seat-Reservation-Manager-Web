import { useQuery } from "@tanstack/react-query";
import { HallService } from "@/services/hallService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import VirtualNavbar from "@/components/VirtualNavbar";

const HomePage = () => {
    const navigate = useNavigate();

    const { data: halls, isLoading } = useQuery({
        queryKey: ["halls"],
        queryFn: () => HallService.getHalls(),
    });

    const formatDateRange = (openDate?: string, closeDate?: string) => {
        if (!openDate || !closeDate) return "Dates TBD";
        const start = new Date(openDate);
        const end = new Date(closeDate);

        const startMonth = format(start, "MMMM");
        const endMonth = format(end, "MMMM");

        if (startMonth === endMonth) {
            return `${format(start, "MMMM do")} - ${format(end, "do")}`;
        }
        return `${format(start, "MMMM do")} - ${format(end, "MMMM do")}`;
    };

    return (
        <div className="min-h-screen bg-morayo-bg text-morayo-ink antialiased font-sans text-[14px] leading-[1.5] pt-[60px]">
            <VirtualNavbar />
            <div className="min-h-screen bg-white text-gray-900 font-sans p-6 md:p-12 lg:p-20">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
                            The Morayo Show Tour
                        </h1>
                        <p className="text-base text-gray-700 max-w-3xl leading-relaxed">
                            Experience The Morayo Show live as it brings compelling conversations, inspiring guests, and unforgettable moments to audiences in Abuja and Ibadan.
                        </p>
                    </header>

                    {isLoading ? (
                        <div className="flex space-x-4 animate-pulse">
                            <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded-2xl"></div>
                            <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded-2xl hidden md:block"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {halls?.map((hall) => (
                                <div key={hall._id} className="flex flex-col group">
                                    <div className="rounded-lg overflow-hidden shadow-sm aspect-video bg-gray-100 mb-6 cursor-pointer transform transition-transform group-hover:scale-[1.02]" onClick={() => navigate(`/reserve?hallId=${hall._id}`)}>
                                        {hall.featureImage ? (
                                            <img
                                                src={hall.featureImage}
                                                alt={hall.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Image Available
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold font-serif mb-2">{hall.name}</h3>
                                    <p className="text-gray-600 mb-6">
                                        {formatDateRange(hall.reservationOpenDate, hall.reservationCloseDate)}
                                    </p>
                                    <div>
                                        <Button
                                            onClick={() => navigate(`/reserve?hallId=${hall._id}`)}
                                            className="bg-[#E8593C] hover:bg-[#e05a0b] text-white rounded-full px-8 py-5 font-medium transition-colors"
                                        >
                                            Book Your Seat
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <footer className="mt-24 pt-8 text-sm font-semibold text-gray-900 border-t border-gray-100">
                        Sponsorship & Partnership{" "}
                        <a href="mailto:mabstudios.production@gmail.com" className="text-[#E8593C] hover:underline">
                            mabstudios.production@gmail.com
                        </a>{" "}
                        / <span className="text-[#E8593C]">08124461291</span>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
