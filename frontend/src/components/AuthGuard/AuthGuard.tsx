import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

const AuthGuard: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        const tokenCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='));

        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];

            try {
                const decodedToken = jwtDecode<JwtPayload>(token);
                if (decodedToken.exp && decodedToken.exp > Date.now() / 1000) {
                    setIsAuthenticated(true);
                    return;
                }
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }

        setIsAuthenticated(false);
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated && location.pathname.startsWith("/auth")) {
        return <Navigate to="/home" replace />;
    }

    if (!isAuthenticated && !location.pathname.startsWith("/auth")) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};

export default AuthGuard;
