import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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

  const navLinks = [
    { to: "/", label: "Reserve" },
    { to: "/member", label: "Member" },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[1000] bg-[#0A0A0A]/92 backdrop-blur-[20px] border-b border-white/8 px-5 md:px-10 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => navigate("/")}
        >
          <span className="font-fraunces italic text-[24px] text-[#E8593C] tracking-[-0.5px]">Morayo</span>
          <span className="text-[#C9C9C4] text-[10px] tracking-[2px] pt-1.5 hidden sm:inline">SHOW</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-1 bg-white/4 border border-white/8 rounded-full p-[3px]">
            {navLinks.map((link) => (
              <NavLink 
                key={link.to}
                to={link.to} 
                className={({ isActive }) => 
                  `px-[18px] py-[8px] text-[13px] font-medium rounded-full transition-all duration-300 select-none ${
                    isActive ? 'bg-[#E8593C] text-white' : 'text-[#8E8E93] hover:text-[#FAFAF7]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <button 
            onClick={handleAuthAction}
            className="text-[13px] font-medium text-[#FAFAF7] bg-[#E8593C]/10 border border-[#E8593C]/20 px-6 py-2.5 rounded-full hover:bg-[#E8593C] hover:text-white transition-all duration-300"
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

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div 
        className={`fixed top-[73px] left-0 right-0 z-[999] bg-[#0D0D0D] border-b border-white/10 px-6 py-8 transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <NavLink 
              key={link.to}
              to={link.to} 
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => 
                `flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${
                  isActive ? 'bg-[#E8593C] text-white' : 'bg-white/4 text-[#8E8E93]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="text-[15px] font-medium tracking-[0.3px]">{link.label}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-white/10'}`} />
                </>
              )}
            </NavLink>
          ))}
          
          <button 
            onClick={handleAuthAction}
            className="mt-4 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-medium text-[15px] hover:bg-white/10 transition-colors"
          >
            {authenticated ? "Logout Account" : "Login to Account"}
          </button>
        </div>
      </div>
    </>
  );
};

export default VirtualNavbar;
