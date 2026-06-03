import React from "react";

const Features = () => {
  const features = [
    {
      title: "Lead Management",
      desc: "Capture, organize, and track leads across multiple channels.",
    },
    {
      title: "Marketing Automation",
      desc: "Automate emails, follow-ups, and customer journeys.",
    },
    {
      title: "Sales Pipeline",
      desc: "Visualize and manage deals through every sales stage.",
    },
    {
      title: "Analytics & Reports",
      desc: "Get real-time insights into campaigns and sales performance.",
    },
    {
      title: "Team Collaboration",
      desc: "Assign leads, track tasks, and collaborate efficiently.",
    },
    {
      title: "Secure & Scalable",
      desc: "Enterprise-grade security with scalable infrastructure.",
    },
  ];

  return (
    <section className="py-10 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#1e293b] mb-4">
            Powerful CRM Features
          </h2>
          <p className="text-[#64748b] max-w-2xl mx-auto">
            Everything you need to manage customers, automate marketing,
            and increase conversions.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="
                bg-white
                p-8
                rounded-xl
                border border-[#e2e8f0]
                hover:shadow-xl
                transition
              "
            >
              {/* Icon Placeholder */}
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#e7e6f6] text-[#6d68b0] mb-4 font-bold">
                ✓
              </div>

              <h3 className="text-xl font-semibold text-[#0f172a] mb-2">
                {feature.title}
              </h3>

              <p className="text-[#64748b] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
