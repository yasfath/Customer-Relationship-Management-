import React from "react";

const Footer = () => {
  const handleScroll = (e, id) => {
    e.preventDefault();

    const element = document.getElementById(id);
    if (!element) return;

    const yOffset = -90; // navbar height
    const y =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-[#0f172a] text-white overflow-hidden">
      
      {/* Top Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-40 bg-linear-to-r from-[#6d68b0]/30 via-[#c9c6e6]/20 to-[#6d68b0]/30 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-10">

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">

          {/* Brand */}
          <div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">
              CRM <span className="text-[#6d68b0]">Marketing</span>
            </h3>

            <p className="text-slate-400 leading-relaxed max-w-sm mb-6">
              A modern CRM platform to manage leads, automate marketing,
              and scale customer relationships with confidence.
            </p>

            
           
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Explore
            </h4>

            <ul className="space-y-3 text-slate-400">
              {[
                ["Home", "home"],
                ["About Us", "about"],
                ["Features", "features"],
                ["How It Works", "how-it-works"],
                ["Testimonials", "testimonials"],
                ["Stats", "stats"],
                ["FAQ", "faq"],
              ].map(([label, id]) => (
                <li key={id}>
                  <button
                    onClick={(e) => handleScroll(e, id)}
                    className="hover:text-white transition text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Get in Touch
            </h4>

            <div className="space-y-3 text-slate-400">
              <p>support@crmmarketing.com</p>
              <p>+91 98765 43210</p>
              <p>Chennai, India</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
          <span>
            © {new Date().getFullYear()} CRM Marketing. All rights reserved.
          </span>

          <span className="mt-4 md:mt-0">
            Designed & Built with React
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
  