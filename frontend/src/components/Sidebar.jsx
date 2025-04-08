import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Settings,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ collapsed, setCollapsed, headerHeight }) => {
    const navigate = useNavigate();

    return (
        <div
            className={`bg-[#E5E4E2] fixed top-0 left-0 z-50 shadow-md transition-all duration-300 flex flex-col ${collapsed ? "w-[60px]" : "w-48"
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