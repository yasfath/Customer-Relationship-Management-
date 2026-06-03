import React from 'react'
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegBell } from 'react-icons/fa';


const NavBar = ({ toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Hello, Anil!';
      case '/Campaigns':
        return 'Campaign Dashboard';
      case '/Leads':
        return 'Leads';
      default:
        // Capitalize the first letter and remove the slash
        {
          const path = location.pathname.substring(1);
          return path.charAt(0).toUpperCase() + path.slice(1) || 'Hello, Anil!';
        }
    }
  };
  return (
    <header className="w-full rounded-2xl px-2 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center gap-4 lg:gap-28">
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiMenu className="h-6 w-6 text-slate-800" />
            </button>

            <img src="/Logo.png" alt="MARKETING Logo" className="h-6 w-6 sm:h-9 sm:w-9" />
            <span className="text-base sm:text-2xl font-semibold tracking-wide text-slate-800">Marketing</span>
          </div>
          <span className="mt-0.5 text-xl sm:text-2xl font-medium hidden sm:block whitespace-nowrap">{getTitle()}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end lg:flex-initial">
          <div className="relative w-full max-w-50 sm:max-w-[320px]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full border border-white/70 bg-white/80 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-700 shadow-inner outline-none ring-0 placeholder:text-slate-500 focus:border-[#b9b4df] focus:bg-white"
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 flex h-7 w-7 sm:h-8 sm:w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#6d68b0] text-white shadow"
              aria-label="Search"
            >
              <CiSearch className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate('/ChatModule')}
              className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/80 bg-white text-slate-600 shadow-sm"
              aria-label="Messages"
            >
              <IoChatbubbleEllipsesOutline className='h-4 w-4 sm:h-5 sm:w-5' />
              <span className="absolute right-1 sm:right-2 top-1 sm:top-2 h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-rose-500" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/Notifications')}
              className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/80 bg-white text-slate-600 shadow-sm"
              aria-label="Notifications"
            >
              <FaRegBell className='h-4 w-4 sm:h-5 sm:w-5' />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar;
