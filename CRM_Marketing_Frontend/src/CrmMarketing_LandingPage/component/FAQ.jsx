import React, { useState } from "react";

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            q: "Is my data secure?",
            a: "Yes, we use industry-standard encryption and security practices to protect your data.",
        },
        {
            q: "Can I cancel anytime?",
            a: "Absolutely. You can cancel your subscription anytime with no hidden charges.",
        },
        {
            q: "Do you offer customer support?",
            a: "Yes, our support team is available 24/7 to assist you whenever needed.",
        },
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-10 px-6 bg-white">
            <div className="max-w-4xl mx-auto">

                <h2 className="text-5xl font-bold text-[#1e293b] mb-16 text-center">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-8">
                    {faqs.map((item, index) => {
                        const isOpen = activeIndex === index;

                        return (
                            <div key={index} className="border-b border-[#e2e8f0] pb-6">

                                {/* Question */}
                                <div
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex justify-between items-center text-left group cursor-pointer"
                                >
                                    <span className="text-xl font-semibold text-[#0f172a]">
                                        {item.q}
                                    </span>

                                    <span
                                        className={`
                      text-2xl text-[#6d68b0]
                      transition-transform duration-300
                      ${isOpen ? "rotate-45" : ""}
                    `}
                                    >
                                        +
                                    </span>
                                </div>

                                {/* Answer Wrapper */}
                                <div
                                    className={`
                    overflow-hidden
                    transition-all duration-500 ease-in-out
                    ${isOpen ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"}
                  `}
                                >
                                    <p className="text-[#64748b] text-lg leading-relaxed">
                                        {item.a}
                                    </p>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default FAQ;
