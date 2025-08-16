// import { AppRoutes } from "@/types/route.type";
// import { useNavigate } from "react-router-dom";

// export const useNavigation = () => {
//   const navigate = useNavigate();

//   const goTo = (path: AppRoutes) => {
//     navigate(path);
//   };

//   const goBack = () => {
//     navigate(-1);
//   };

//   return { goTo, goBack };
// };

// // For test: a proper middleware or authorization logic to handle this
// export const getUserRoleFromPath = (pathname: string, navItems: object) => {
//   const roleKeys = Object.keys(navItems); // Get all available roles
//   return (
//     roleKeys.find((role) => pathname.includes(role.toLowerCase())) || "DEFAULT"
//   ); // Fallback role
// };
