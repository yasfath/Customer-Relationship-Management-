import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Arun Kumar",
      role: "Sales Manager",
      feedback:
        "CRM Marketing helped us automate our lead follow-ups and increased our conversion rate significantly.",
    },
    {
      name: "Priya Sharma",
      role: "Marketing Lead",
      feedback:
        "The analytics and automation features saved our team hours every week. Highly recommended!",
    },
    {
      name: "Ravi Patel",
      role: "Business Owner",
      feedback:
        "Simple to use, powerful features, and great support. Perfect CRM for growing businesses.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-[#e7e6f6]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#1e293b] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-[#64748b]">
            Trusted by businesses across industries.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="
                bg-white
                p-8
                rounded-xl
                border border-[#e2e8f0]
                hover:shadow-lg
                transition
              "
            >
              <p className="text-[#334155] mb-6">
                “{item.feedback}”
              </p>

              <div>
                <h4 className="font-semibold text-[#0f172a]">
                  {item.name}
                </h4>
                <span className="text-[#64748b] text-sm">
                  {item.role}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
