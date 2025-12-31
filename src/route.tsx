import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFoundPage from "@/pages/NotFoundPage";
import { reservationRoutes } from "./lib/route";
import RouteWrapper from "./components/RouteWrapper";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>

                {reservationRoutes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <RouteWrapper
                                element={route.element}
                                layout={route.layout}
                                layoutProps={route.layoutProps}
                            />
                        }
                    />
                ))}

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
