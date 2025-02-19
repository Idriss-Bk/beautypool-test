"use client"
import React from 'react'
import Hero from '@/app/components/static/sections/Hero'
import Footer from "@/app/components/global/footer/Footer";
import Achievement from './components/static/sections/Achievement';
import WhyUs from './components/static/sections/WhyUs';
import Tranding from './components/static/sections/Tranding';
import NewBeauty from './components/static/sections/NewBeauty';
import Reviews from './components/static/sections/Reviews';


const Home = () => {
  return (
    <>
      <Hero />
      <NewBeauty /> 
      <Tranding />
      <Achievement />
      <Reviews />
      <WhyUs />
      <Footer />
    </>
  )
}

export default Home