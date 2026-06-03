import React from "react";

const HowItWorks = () => {
    const steps = [
        {
            step: "01",
            title: "Capture Leads",
            desc: "Collect leads from websites, forms, and campaigns automatically.",
        },
        {
            step: "02",
            title: "Automate Follow-Ups",
            desc: "Send emails and reminders without manual effort.",
        },
        {
            step: "03",
            title: "Track Performance",
            desc: "Monitor campaigns and sales with real-time analytics.",
        },
        {
            step: "04",
            title: "Grow Your Business",
            desc: "Convert more leads into loyal customers.",
        },
    ];

    return (
        <section className="py-28 px-6 bg-white">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-bold text-[#1e293b] mb-4">
                        How It Works
                    </h2>
                    <p className="text-[#64748b] max-w-2xl mx-auto text-lg">
                        A simple and structured process designed to convert leads into customers.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">

                    {/* Center Line (Hidden on Mobile) */}
                    <div className="hidden md:block absolute left-1/2 top-0 h-full w-px bg-[#c9c6e6] -translate-x-1/2"></div>

                    <div className="space-y-16 md:space-y-24">
                        {steps.map((item, index) => (
                            <div
                                key={item.step}
                                className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                                    }`}
                            >
                                {/* Content */}
                                <div className={`w-full md:w-[45%] text-center ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                                    <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-[#64748b] text-base md:text-lg leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>

                                {/* Step Circle */}
                                <div className="
                  mt-8 md:mt-0
                  md:absolute md:left-1/2 md:-translate-x-1/2
                  w-12 h-12 md:w-14 md:h-14
                  rounded-full bg-[#6d68b0] text-white
                  flex items-center justify-center
                  font-bold text-lg shadow-lg
                ">
                                    {item.step}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
};

export default HowItWorks;
