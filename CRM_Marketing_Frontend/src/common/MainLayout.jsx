import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <main className="min-h-screen bg-linear-to-br from-[#e7e6f6] via-[#c9c6e6] to-[#6d68b0] overflow-x-hidden">
            <section className="flex min-h-screen flex-col p-2 md:p-4">
                <NavBar toggleSidebar={toggleSidebar} />

                <div className="mt-4 flex flex-1 items-stretch gap-4 overflow-hidden relative">
                    <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                            onClick={toggleSidebar}
                        />
                    )}

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <Outlet />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default MainLayout;
