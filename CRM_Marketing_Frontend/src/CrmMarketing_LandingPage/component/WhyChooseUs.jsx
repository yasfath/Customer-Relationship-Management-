import React from "react";

const WhyChooseUs = () => {
  const reasons = [
    {
      title: "Easy to Use",
      desc: "Clean and intuitive interface that requires minimal training.",
    },
    {
      title: "Powerful Automation",
      desc: "Automate repetitive tasks and focus on closing deals.",
    },
    {
      title: "Real-Time Insights",
      desc: "Make data-driven decisions with live analytics.",
    },
    {
      title: "24/7 Support",
      desc: "Our team is always available to help you succeed.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-[#f1f5f9]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#1e293b] mb-4">
            Why Choose CRM Marketing?
          </h2>
          <p className="text-[#64748b] max-w-2xl mx-auto">
            We help businesses build stronger customer relationships and grow faster.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="
                bg-white
                p-8
                rounded-xl
                border border-[#e2e8f0]
                hover:shadow-lg
                transition
                text-center
              "
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#e7e6f6] text-[#6d68b0] flex items-center justify-center font-bold">
                ★
              </div>

              <h3 className="text-xl font-semibold text-[#0f172a] mb-2">
                {reason.title}
              </h3>

              <p className="text-[#64748b]">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
