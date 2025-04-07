import Sidebar from './Sidebar';
import { useState } from 'react';

const HEADER_HEIGHT = '3rem'; // 64px

export default function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} headerHeight={HEADER_HEIGHT} />

            <div
                className="flex-1"
                style={{ marginLeft: collapsed ? '70px' : '256px', paddingTop: HEADER_HEIGHT }}
            >
                {/* HEADER */}
                <header
                    className="fixed top-0 left-0 w-full bg-[#efe5fc] h-16 z-40 shadow-md flex items-center px-4"
                >
                    <h1 className="text-xl font-bold text-[#302b27]">UniPlanner</h1>
                </header>

                {/* MAIN PAGE CONTENT */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
