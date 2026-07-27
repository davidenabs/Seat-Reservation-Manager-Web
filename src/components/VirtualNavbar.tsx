import { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { AuthService } from "../services/authService";
import { Menu, X } from "lucide-react";

const VirtualNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authenticated = AuthService.isAuthenticated();

  const navLinks = [
    { label: "Home", href: "https://themorayoshow.com/" },
    { label: "Meet Morayo", href: "https://themorayoshow.com/meet-morayo/" },
    { label: "Join Us", href: "https://themorayoshow.com/join-us/" },
    { label: "Contact", href: "https://themorayoshow.com/contact" },
  ];

  const handleAuthAction = () => {
    if (authenticated) {
      AuthService.logout();
      navigate("/login");
    } else {
      navigate("/login");
    }
    setIsMenuOpen(false);
  };
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[1000] backdrop-blur-[20px] border-b border-white/8 px-5 md:px-10 py-4 flex justify-between items-center">
        <div className="">
          <Link to="/">
            <img src="/tmas-logo-dark.png" alt="TMAS Logo" className="h-12 object-contain" />
          </Link>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-1 bg-white/10 border border-white/10 rounded-full p-[3px]">
            {navLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.href}
                className="px-5 py-2 text-[13px] font-medium rounded-full transition-all"
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Dashboards */}
          {authenticated && (
            <Link to="/member" className="text-[13px] font-medium transition-colors underline underline-offset-4">
              Dashboard
            </Link>
          )}

          <button
            onClick={handleAuthAction}
            className="text-[13px] font-medium text- bg-[#E8593C]/10 border border-[#E8593C]/20 px-6 py-2.5 rounded-full hover:bg-[#E8593C] hover:text-white transition-all duration-300"
          >
            {authenticated ? "Logout" : "Login"}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-[#C9C9C4] p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-[80px] left-0 right-0 bg-white border-b border-gray-200 z-[999] p-5 flex flex-col gap-4 shadow-lg">
          {navLinks.map((link, index) => (
            <NavLink 
              key={index} 
              to={link.href} 
              className="text-[15px] font-medium text-gray-800" 
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          
          {authenticated && (
            <Link to="/member" className="text-[15px] font-medium text-gray-800 underline" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          )}

          <button
            onClick={handleAuthAction}
            className="text-[15px] font-medium text-white bg-[#E8593C] px-6 py-3 rounded-full mt-2 w-full text-center transition-all duration-300"
          >
            {authenticated ? "Logout" : "Login"}
          </button>
        </div>
      )}
    </>
  );
};

export default VirtualNavbar;
