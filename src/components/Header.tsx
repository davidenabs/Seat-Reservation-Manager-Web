import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import Logo from "@/assets/tmas-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white shadowmd">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="https://themorayoshow.com" target="_blank" rel="noopener noreferrer">
              <img src={Logo} alt="TMAS Logo" className="w-36 sm:w-[145.131591796875px]" />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="https://themorayoshow.com" className="text-gray-700 hover:text-gray-900 font-medium">Home</a>
            <a href="https://themorayoshow.com/meet-morayo/" className="text-gray-700 hover:text-gray-900 font-medium">Meet Morayo</a>
            <a href="https://themorayoshow.com/join-us/" className="text-gray-700 hover:text-gray-900 font-medium">Join Us</a>
            <a href="https://themorayoshow.com/contact" className="text-gray-700 hover:text-gray-900 font-medium">Contact</a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 text-gray-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Reserve Button */}
          <div className="hidden md:block">
            <Button className="bg-[#FD690C] text-white px-6 py-4 rounded-full hover:bg-orange-600 font-bold flex items-center space-x-2">
              <ShoppingCart fill="#fff" />
              <span>RESERVE SEAT</span>
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Transition */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="flex flex-col space-y-4 mt-4">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">Home</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">About the Show</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">Prizes</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">Contact</a>
            <Button className="bg-[#FD690C] text-white px-6 py-4 rounded-full hover:bg-orange-600 font-bold flex items-center justify-center space-x-2">
              <ShoppingCart fill="#fff" />
              <span>RESERVE SEAT</span>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;