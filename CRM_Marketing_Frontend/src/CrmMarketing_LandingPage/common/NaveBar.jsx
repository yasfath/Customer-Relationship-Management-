import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (e, id) => {
    e.preventDefault();
    setIsOpen(false);

    const element = document.getElementById(id);
    if (!element) return;

    const yOffset = -90; // height of navbar
    const y =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  const menuItems = [
    ["Home", "home"],
    ["About", "about"],
    ["Features", "features"],
    ["FAQ", "faq"],
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="
          sticky top-0 z-50
          flex items-center justify-between
          px-10 py-4
          bg-[#e7e6f6]/90
          backdrop-blur-md
          border-b border-[#e2e8f0]
        "
      >
        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-bold text-[#1e293b]">
          CRM Marketing
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-[#334155] font-medium">
          {menuItems.map(([label, id]) => (
            <li
              key={id}
              className="hover:text-[#6d68b0] transition cursor-pointer"
              onClick={(e) => handleScroll(e, id)}
            >
              {label}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl text-[#1e293b]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`
          fixed inset-0 z-40 bg-[#e7e6f6]
          flex flex-col items-center justify-center gap-8
          transition-transform duration-300 md:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <ul className="flex flex-col items-center gap-8 text-[#334155] text-xl font-semibold">
          {menuItems.map(([label, id]) => (
            <li
              key={id}
              className="cursor-pointer hover:text-[#6d68b0] transition"
              onClick={(e) => handleScroll(e, id)}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
