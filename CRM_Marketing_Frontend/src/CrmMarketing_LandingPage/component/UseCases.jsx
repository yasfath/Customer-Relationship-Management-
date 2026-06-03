import React from "react";

const UseCases = () => {
    const cases = [
        {
            title: "Sales Teams",
            desc: "Track pipelines, automate follow-ups, and close deals faster.",
        },
        {
            title: "Marketing Teams",
            desc: "Run campaigns, analyze performance, and optimize conversions.",
        },
        {
            title: "Small Businesses",
            desc: "Manage customers efficiently without complex tools.",
        },
    ];

    return (
        <section className="py-8 px-6 bg-white">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-24">
                    <h2 className="text-5xl font-bold text-[#0f172a] mb-4">
                        One Platform. Multiple Use Cases.
                    </h2>
                    <p className="text-[#64748b] text-lg max-w-2xl mx-auto">
                        CRM Marketing adapts to different teams without changing workflows.
                    </p>
                </div>

                {/* Center Focus */}
                <div className="relative flex flex-col items-center">

                    {/* Center Circle */}
                    <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-[#e7e6f6] to-[#6d68b0] flex items-center justify-center text-center shadow-xl">
                        <h3 className="text-xl md:text-2xl font-bold text-[#0f172a]">
                            CRM<br />Marketing
                        </h3>
                    </div>

                    {/* Use Cases */}
                    <div className="mt-16 md:mt-24 w-full max-w-4xl space-y-12 md:space-y-20">
                        {cases.map((item, index) => (
                            <div
                                key={index}
                                className={`flex justify-center ${index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                                    }`}
                            >
                                <div className="max-w-md text-center md:text-left">
                                    <h4 className="text-2xl md:text-3xl font-bold text-[#1e293b] mb-3">
                                        {item.title}
                                    </h4>
                                    <p className="text-[#64748b] text-base md:text-lg leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
};

export default UseCases;
