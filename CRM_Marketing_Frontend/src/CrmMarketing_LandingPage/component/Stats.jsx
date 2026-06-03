import React from "react";

const Stats = () => {
    return (
        <section className="py-14  px-6 bg-white">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 text-center">

                <div>
                    <h3 className="text-4xl md:text-5xl font-bold text-[#0f172a]">1,200+</h3>
                    <p className="text-[#64748b] mt-2 font-medium">Active Businesses</p>
                </div>

                <div>
                    <h3 className="text-4xl md:text-5xl font-bold text-[#0f172a]">4M+</h3>
                    <p className="text-[#64748b] mt-2 font-medium">Leads Managed</p>
                </div>

                <div>
                    <h3 className="text-4xl md:text-5xl font-bold text-[#0f172a]">99.9%</h3>
                    <p className="text-[#64748b] mt-2 font-medium">Uptime</p>
                </div>

                <div>
                    <h3 className="text-4xl md:text-5xl font-bold text-[#0f172a]">24/7</h3>
                    <p className="text-[#64748b] mt-2 font-medium">Support</p>
                </div>

            </div>
        </section>
    );
};

export default Stats;
