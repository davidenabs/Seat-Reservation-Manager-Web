import { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { AuthService } from "../services/authService";
import { Menu, X } from "lucide-react";

const VirtualNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authenticated = AuthService.isAuthenticated();

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
            <NavLink
              to="https://themorayoshow.com/"
              className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all `}
            >
              Home
            </NavLink>
            <NavLink
              to="https://themorayoshow.com/meet-morayo/"
              className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all `}
            >
              Meet Morayo
            </NavLink>
            <NavLink
              to="https://themorayoshow.com/join-us/"
              className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all `}
            >
              Join Us
            </NavLink>
            <NavLink
              to="https://themorayoshow.com/contact"
              className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all `}
            >
              Contact
            </NavLink>
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
    </>
  );
};

export default VirtualNavbar;
