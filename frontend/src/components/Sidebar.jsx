import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Settings,
    ChevronsLeft,
    ChevronsRight,
    LogOut,
    ShieldAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useState, useEffect } from "react";

const Sidebar = ({ collapsed, setCollapsed, headerHeight }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    // Check if the user is an admin
    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) return;
            try {
                const idToken = await user.getIdToken(true);
                const res = await fetch("http://localhost:8000/users/settings", {
                    headers: { Authorization: `Bearer ${idToken}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    setIsAdmin(data.role === "admin");
                }
            } catch (err) {
                console.error("Failed to fetch user settings:", err);
            }
        };

        checkAdmin();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div
            className={`bg-[#E5E4E2] fixed top-0 left-0 z-50 shadow-md transition-all duration-300 flex flex-col justify-between ${collapsed ? "w-[60px]" : "w-48"}`}
            style={{
                paddingTop: headerHeight,
                height: `calc(100vh - ${headerHeight})`,
                marginTop: headerHeight,
            }}
        >
            <nav className={`flex flex-col gap-6 px-3 ${collapsed && "items-center"}`}>
                {/* Collapse/Expand Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="bg-white rounded-full p-1 shadow transition-transform hover:scale-105"
                >
                    {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                </button>

                {/* Student/User Only Links */}
                {!isAdmin && (
                    <>
                        <NavItem
                            icon={<LayoutDashboard />}
                            label="UniPlanner"
                            collapsed={collapsed}
                            onClick={() => navigate("/dashboard")}
                        />
                        <NavItem
                            icon={<CalendarDays />}
                            label="Future Due Dates"
                            collapsed={collapsed}
                            onClick={() => navigate("/future-due-dates")}
                        />
                        <NavItem
                            icon={<Users />}
                            label="Study Buddy / Shared Calendar"
                            collapsed={collapsed}
                            onClick={() => navigate("/study-buddy")}
                        />
                        <NavItem
                            icon={<Settings />}
                            label="Settings"
                            collapsed={collapsed}
                            onClick={() => navigate("/settings")}
                        />
                    </>
                )}

                {/* Admin Only Link */}
                {isAdmin && (
                    <NavItem
                        icon={<ShieldAlert />}
                        label="Admin"
                        collapsed={collapsed}
                        onClick={() => navigate("/admin")}
                    />
                )}
            </nav>

            {/* Logout Button */}
            <div className="px-3 pb-4">
                <NavItem
                    icon={<LogOut />}
                    label="Logout"
                    collapsed={collapsed}
                    onClick={handleLogout}
                />
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, collapsed, onClick }) => (
    <div
        className="flex items-center gap-3 cursor-pointer hover:text-blue-700 text-sm font-medium"
        onClick={onClick}
    >
        <span>{icon}</span>
        {!collapsed && <span>{label}</span>}
    </div>
);

export default Sidebar;
