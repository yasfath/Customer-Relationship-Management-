import { FaRegIdCard, FaRegLightbulb } from 'react-icons/fa'
import {
  FiGrid,
  FiBriefcase,
  FiTrendingUp,
  FiActivity,
  FiCalendar,
  FiTarget,
  FiUsers,
  FiMail,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'


const SideBar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()
  const userSession = JSON.parse(sessionStorage.getItem("userSession"));

  const name = userSession?.name || userSession?.userName || "User";
const role = userSession?.role || "User";
const image = userSession?.profileImageUrl || "";
  const menuItems = [
    { name: 'Dash Board', path: '/DashBoard', icon: FiGrid },
    { name: 'Campaigns', path: '/Campaigns', icon: FiBriefcase },
    { name: 'Leads', path: '/Leads', icon: FiTrendingUp },
    { name: 'Activity', path: '/Activity', icon: FiActivity },
    { name: 'Events', path: '/Events', icon: FiCalendar },
    { name: 'Deals', path: '/Deals', icon: FaRegLightbulb },
    { name: 'Contacts', path: '/Contacts', icon: FaRegIdCard },
    { name: 'Email Response', path: '/EmailResponse', icon: FiMail },
  { name: 'Staff (User/Owner)', path: '/Staff', icon: FiUser, roles: ['ADMIN'] },
  ]

  return (
    <aside className={`
      fixed inset-y-4 left-4 z-50 lg:static lg:inset-0
      flex w-64 lg:w-48 flex-col justify-between self-stretch rounded-2xl border border-slate-200 bg-white px-3 py-4 shadow-xl lg:shadow-none
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'}
    `}>
      <div className="space-y-2">
        <div className="flex items-center justify-between lg:hidden px-2 mb-4">
          <span className="font-bold text-slate-800">Menu</span>
          <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {menuItems
  .map((item) => {
    const Icon = item.icon
    const isActive = location.pathname === item.path

    return (
      <div key={item.path}>
        <Link
          to={item.path}
          onClick={() => window.innerWidth < 1024 && toggleSidebar()}
          style={isActive ? { backgroundColor: '#b6b4d6' } : {}}
          className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm lg:text-xs font-medium transition-all ${
            isActive
              ? 'text-slate-800'
              : 'text-slate-800 hover:bg-slate-100'
          }`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>{item.name}</span>
        </Link>
      </div>
    )
})}
      </div>

      <Link
        to="/Profile"
        className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-3 py-3 mt-4 hover:bg-slate-100 transition-all cursor-pointer group"
      >
        {image ? (
          <img
            src={image}
            alt="User"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-white group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7e6f6] text-[#6d68b0] ring-2 ring-white">
            <FiUser className="h-4 w-4" />
          </div>
        )}
        <div className='flex flex-col' >
          <span className="text-sm font-bold text-slate-800 leading-none group-hover:text-[#6d68b0] transition-colors">
            {name}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">
           {role}
          </span>
        </div>
      </Link>

    </aside>
  )
}

export default SideBar;
