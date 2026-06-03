import React from 'react'
import NaveBar from './common/NaveBar'
import Footer from './common/Footer'
import Banner from './component/Banner'
import AboutUs from './component/AboutUs'
import Features from './component/Features'
import FeaturesSticky from './component/FeaturesSticky'
import WhyChooseUs from './component/WhyChooseUs'
import HowItWorks from './component/HowItWorks'
import Testimonials from './component/Testimonials'
import CTA from './component/CTA'
import Stats from './component/Stats'
import UseCases from './component/UseCases'
import FAQ from './component/FAQ'



const Main = () => {
    return (
        <section>

            <div>
                <NaveBar />
            </div>

            <section>
                <div id="home"><Banner /></div>
                <div id="about"><AboutUs /></div>
                <div id="features">
                    <Features />
                    <FeaturesSticky />
                </div>
                <WhyChooseUs />
                <div id="how-it-works"><HowItWorks /></div>
                <div id="testimonials"><Testimonials /></div>
                <CTA />
                <div id="stats"><Stats /></div>
                <UseCases />
                <div id="faq"><FAQ /></div>
            </section>

            <div>
                <Footer />
            </div>


        </section>
    )
}

export default Main