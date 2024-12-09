// import BookingForm from "../../dynamic/Book/Booking";
// import localFont from "next/font/local";

// const GDSageBold = localFont({
//   src: "../../../fonts/GDSage-Bold.ttf",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// const Hero = () => {
//   return (
//     <div className="gredient-bg pb-0">
//       <div className="pt-20 max-w-5xl mx-auto">
//         <h1
//           className={`${GDSageBold.className} text-gray-900 text-3xl md:text-4xl lg:text-6xl xl:text-6xl text-center mx-auto`}
//         >
//           Explore local <span className="gradient-text">beauty</span> and
//           wellness services tailored for you
//         </h1>
//         <div className="mt-10 px-5 lg:px-0">
//           <BookingForm />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;

import { BackgroundGradientAnimation } from "@/app/ui/background-gradient-animation";
import React from "react";
import BookingForm from "../../dynamic/Book/Booking";
import Navbar from "../../global/header/Navbar";
import LiveCounter from "./LiveCounter";
import { Gruppo } from "next/font/google";

const gruppo = Gruppo({
  subsets: ['latin'],
  variable: "--font-geist-mono",
  weight: "400",
});


const Hero = () => {
  return (
    <BackgroundGradientAnimation>
      <div className="z-50 mb-20 relative">
        <Navbar />
      </div>
      <div className="absolute z-40 inset-0 flex items-center">
        <div className="max-w-5xl mx-auto mt-20">
          <h1
            className={`${gruppo.className} text-gray-900 text-3xl md:text-4xl lg:text-6xl xl:text-6xl text-center mx-auto`}
          >
            Explore local <span className="text-[#f4b8ae]">beauty</span> and
            wellness services tailored for you
          </h1>
          <div className="mt-10 px-5 lg:px-0">
            <BookingForm />
          </div>

          <LiveCounter />
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
};

export default Hero;
