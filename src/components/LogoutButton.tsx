import { clearTokens } from "@/utils/tokenUtils";
import { Button } from "./ui/button";

interface LogoutButtonProps {
    setIsAuthenticated: (isAuthenticated: boolean) => void
}

export default function LogoutButton({ setIsAuthenticated }: LogoutButtonProps) {
    const handleLogout = () => {
        clearTokens();
        setIsAuthenticated(false);
    };

    return (
        <Button onClick={handleLogout}>Logout</Button>
    );
}

