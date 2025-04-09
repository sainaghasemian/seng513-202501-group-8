import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Settings,
    ChevronsLeft,
    ChevronsRight,
    LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; // Import the AuthContext

const Sidebar = ({ collapsed, setCollapsed, headerHeight }) => {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Access the logout function from AuthContext

    const handleLogout = async () => {
        await logout(); // Log out the user
        navigate("/"); // Redirect to the login page
    };

    return (
        <div
            className={`bg-[#E5E4E2] fixed top-0 left-0 z-50 shadow-md transition-all duration-300 flex flex-col justify-between ${collapsed ? "w-[60px]" : "w-48"
                }`}
            style={{
                paddingTop: headerHeight,
                height: `calc(100vh - ${headerHeight})`,
                marginTop: headerHeight,
            }}
        >
            <nav className={`flex flex-col gap-6 px-3 ${collapsed && "items-center"}`}>
                {/* Collapse/Expand Button – now inline with nav */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="bg-white rounded-full p-1 shadow transition-transform hover:scale-105"
                >
                    {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                </button>

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