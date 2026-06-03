import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-[#e7e6f6] py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left Content */}
        <div>
          <h2 className="text-5xl font-bold text-[#1e293b] mb-6">
            Built for Modern CRM Marketing
          </h2>

          <p className="text-[#334155] text-lg mb-6 leading-relaxed">
            CRM Marketing helps businesses streamline customer interactions,
            automate campaigns, and improve sales performance using one unified
            platform.
          </p>

          <p className="text-[#64748b] text-lg leading-relaxed">
            We focus on simplicity, automation, and actionable insights so your
            team can spend less time managing data and more time closing deals.
          </p>
        </div>

        {/* Right Image */}
        <div className="relative">
          <img
            src="/aboutus.jpg"
            alt="CRM Marketing Dashboard"
            className="w-full rounded-2xl shadow-xl"
          />

          {/* Decorative Accent */}
          <div className="absolute -bottom-6 -right-6 w-full h-full rounded-2xl border-2 border-[#6d68b0] -z-10"></div>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
