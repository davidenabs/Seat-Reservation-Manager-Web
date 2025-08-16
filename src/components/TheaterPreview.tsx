// import { Play } from 'lucide-react';
import { Card } from "@/components/ui/card";
import SeatsImage from "@/assets/seats.png";

const TheaterPreview = () => {
  return (
    <Card className="relative overflow-hidden aspect-[4/3]">
      <div className="absolute inset-0 bg-red-800">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${SeatsImage})`
          }}
        />

        {/* Play button overlay */}
        {/* <div className="absolute inset-0 flex items-end justify-start p-10">
          <div className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <Play className="w-8 h-8 text-red-800" fill="currentColor" />
          </div>
        </div> */}
      </div>
    </Card>
  );
};

export default TheaterPreview;