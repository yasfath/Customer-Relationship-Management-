import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const slides = [
    {
      image: "/Banner1.jpg",
      title: "Smart CRM Marketing Platform",
      desc: "Manage leads, automate campaigns, and grow your business with ease.",
    },
    {
      image: "/Banner2.jpg",
      title: "Automate Your Marketing",
      desc: "Save time by automating emails, follow-ups, and customer journeys.",
    },
    {
      image: "/Banner3.jpg",
      title: "Increase Conversions",
      desc: "Track performance with analytics and convert more leads into sales.",
    },
  ];

  return (
    <section>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div
              className="min-h-[70vh] flex items-center justify-center text-center px-6 relative"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-[#e7e6f6]/90 via-[#c9c6e6]/80 to-[#6d68b0]/80"></div>

              {/* Content */}
              <div className="relative z-10 max-w-4xl px-4">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-[#0f172a] mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-[#334155] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 font-medium">
                  {slide.desc}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate("/signin")}
                    className="px-8 py-4 cursor-pointer bg-[#6d68b0] text-white! rounded-full font-bold text-lg hover:bg-[#5a5598]  shadow-xl"
                  >
                    Start Free Trial
                  </button>
                  {/* <button className="px-8 py-4 border-2 border-[#6d68b0] text-[#6d68b0] rounded-full font-bold text-lg hover:bg-[#6d68b0] hover:text-white! ">
                    Watch Demo
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Banner;
