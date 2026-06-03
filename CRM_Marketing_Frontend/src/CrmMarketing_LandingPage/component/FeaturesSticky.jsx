import React from "react";

const FeaturesSticky = () => {
    const features = [
        {
            title: "Centralized Lead Management",
            desc: "View, organize, and manage all your leads from a single dashboard.",
        },
        {
            title: "Marketing Automation",
            desc: "Automate emails, follow-ups, and customer journeys effortlessly.",
        },
        {
            title: "Sales Pipeline Visibility",
            desc: "Track deals across stages and never miss an opportunity.",
        },
        {
            title: "Real-Time Analytics",
            desc: "Measure performance with live reports and actionable insights.",
        },
    ];

    return (
        <section className="py-20  px-6 bg-[#f1f5f9]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">

                {/* Image - Not sticky on mobile */}
                <div className="relative order-2 md:order-1">
                    <div className="md:sticky md:top-32">
                        <img
                            src="/FeaturesSticky.jpg"
                            alt="CRM Dashboard"
                            className="rounded-2xl shadow-xl md:shadow-2xl w-full"
                        />
                    </div>
                </div>

                {/* Scrolling Content */}
                <div className="space-y-12 md:space-y-24 order-1 md:order-2">
                    {features.map((item, index) => (
                        <div key={index} className="text-center md:text-left">
                            <h3 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">
                                {item.title}
                            </h3>
                            <p className="text-[#64748b] text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeaturesSticky;
