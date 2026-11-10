import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "../services/authService";
import { Menu, X } from "lucide-react";

interface VirtualNavbarProps {
  scrollToPackages?: () => void;
}

const VirtualNavbar: React.FC<VirtualNavbarProps> = ({ scrollToPackages }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const authenticated = AuthService.isAuthenticated();

  const isHome = location.pathname === "/" || location.pathname === "";

  const handleAuthAction = () => {
    setIsMobileMenuOpen(false);
    if (authenticated) {
      AuthService.logout();
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const handleBookSeat = () => {
    setIsMobileMenuOpen(false);
    if (scrollToPackages) {
      scrollToPackages();
    } else {
      const el = document.getElementById("packages");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/tmas-logo-dark.png"
            alt="The Morayo Show"
            className="h-10 md:h-11 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={
              isHome
                ? "relative text-[#E8593C] font-semibold text-sm pb-1 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-[#E8593C]"
                : "text-gray-700 hover:text-gray-950 font-medium text-sm transition-colors"
            }
          >
            Home
          </Link>

          <a
            href="https://themorayoshow.com/episodes/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-700 hover:text-gray-950 font-medium text-sm transition-colors"
          >
            Episodes
          </a>

          <a
            href="https://themorayoshow.com/meet-morayo/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-700 hover:text-gray-950 font-medium text-sm transition-colors"
          >
            About
          </a>

          <a
            href="https://themorayoshow.com/contact/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-700 hover:text-gray-950 font-medium text-sm transition-colors"
          >
            Contact
          </a>

          {/* Member Dashboard Link (if logged in) */}
          {authenticated && (
            <Link
              to="/member"
              className="text-gray-700 hover:text-gray-950 font-medium text-sm transition-colors"
            >
              Dashboard
            </Link>
          )}

          {/* Login/Logout Button (if authenticated or needed) */}
          {authenticated && (
            <button
              onClick={handleAuthAction}
              className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
            >
              Logout
            </button>
          )}

          {/* Book A Seat CTA Button */}
          <button
            onClick={handleBookSeat}
            className="bg-[#E8593C] hover:bg-[#D44A2D] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Book A Seat
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-5 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-2">
          <Link
            to="/"
            className={
              isHome
                ? "text-[#E8593C] font-semibold text-sm"
                : "text-gray-700 font-medium text-sm"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>

          <a
            href="https://themorayoshow.com/episodes/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-700 font-medium text-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Episodes
          </a>

          <a
            href="https://themorayoshow.com/meet-morayo/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-700 font-medium text-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </a>

          <a
            href="https://themorayoshow.com/contact/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-700 font-medium text-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </a>

          {authenticated && (
            <Link
              to="/member"
              className="text-gray-700 font-medium text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {authenticated && (
            <button
              onClick={handleAuthAction}
              className="text-left text-xs font-medium text-gray-500 hover:text-gray-800"
            >
              Logout
            </button>
          )}

          <button
            onClick={handleBookSeat}
            className="bg-[#E8593C] hover:bg-[#D44A2D] text-white text-sm font-semibold py-3 rounded-full text-center mt-2 w-full transition-all"
          >
            Book A Seat
          </button>
        </div>
      )}
    </header>
  );
};

export default VirtualNavbar;
