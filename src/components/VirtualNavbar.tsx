import { NavLink, useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";

const VirtualNavbar = () => {
  const navigate = useNavigate();
  const authenticated = AuthService.isAuthenticated();

  const handleAuthAction = () => {
    if (authenticated) {
      AuthService.logout();
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] bg-[#0A0A0A]/92 backdrop-blur-[20px] border-b border-white/8 px-4 md:px-8 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
        <span className="font-fraunces italic text-[22px] text-[#E8593C] tracking-[-0.5px]">Morayo</span>
        <span className="text-[#C9C9C4] text-[10px] tracking-[2px] pt-1">SHOW</span>
      </div>
      
      {/* Pills */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1 bg-white/4 border border-white/8 rounded-full p-[3px]">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `px-[14px] py-[7px] text-[12px] rounded-full transition-all duration-200 select-none ${
                isActive ? 'bg-[#E8593C] text-white' : 'text-[#C9C9C4] hover:text-[#FAFAF7]'
              }`
            }
          >
            Reserve
          </NavLink>
          <NavLink 
            to="/member" 
            className={({ isActive }) => 
              `px-[14px] py-[7px] text-[12px] rounded-full transition-all duration-200 select-none ${
                isActive ? 'bg-[#E8593C] text-white' : 'text-[#C9C9C4] hover:text-[#FAFAF7]'
              }`
            }
          >
            Member
          </NavLink>
          {/* <NavLink 
            to="/waiting" 
            className={({ isActive }) => 
              `px-[14px] py-[7px] text-[12px] rounded-full transition-all duration-200 select-none ${
                isActive ? 'bg-[#E8593C] text-white' : 'text-[#C9C9C4] hover:text-[#FAFAF7]'
              }`
            }
          >
            Pre-show
          </NavLink> */}
        </div>

        <button 
          onClick={handleAuthAction}
          className="text-[12px] text-[#C9C9C4] hover:text-white bg-white/5 border border-white/10 px-4 py-2 rounded-full transition"
        >
          {authenticated ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default VirtualNavbar;
