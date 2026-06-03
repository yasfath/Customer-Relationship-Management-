import React from "react";

const CTA = () => {
    return (
        <section className="relative overflow-hidden py-24 px-6 bg-gradient-to-r from-[#e7e6f6] via-[#c9c6e6] to-[#6d68b0]">

            {/* Decorative Blobs */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>

            <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left Content */}
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-6">
                        Turn Leads Into Loyal Customers
                    </h2>

                    <p className="text-[#334155] text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0">
                        Automate your CRM workflow, track performance, and grow revenue with a platform built for modern teams.
                    </p>

                    
                </div>

                {/* Right Stats (NO CARDS) */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-8 lg:gap-12 mt-8 md:mt-0 justify-center">
                    <div className="text-center md:text-left">
                        <h3 className="text-3xl md:text-4xl font-bold text-[#0f172a]">
                            +42%
                        </h3>
                        <p className="text-[#334155] text-sm md:text-base">
                            Lead conversion increase
                        </p>
                    </div>

                    <div className="text-center md:text-left">
                        <h3 className="text-3xl md:text-4xl font-bold text-[#0f172a]">
                            3x
                        </h3>
                        <p className="text-[#334155] text-sm md:text-base">
                            Faster follow-ups
                        </p>
                    </div>

                    <div className="text-center md:text-left">
                        <h3 className="text-3xl md:text-4xl font-bold text-[#0f172a]">
                            99.9%
                        </h3>
                        <p className="text-[#334155] text-sm md:text-base">
                            Platform uptime
                        </p>
                    </div>
                </div>            </div>
        </section>
    );
};

export default CTA;
