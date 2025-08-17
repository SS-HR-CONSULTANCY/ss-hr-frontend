import React from 'react';
import { motion } from "motion/react";
import { useNavigate } from 'react-router-dom';
import bannerOne from '../../assets/heroImages/bannerOne.png';
import bannerTwo from '../../assets/heroImages/bannerTwo.jpg';
import bannerThree from '../../assets/heroImages/bannerThree.png';
import { ImagesSlider } from "../ui/images-slider";

const Hero: React.FC = () => {

  const navigate = useNavigate();

  const images = [
    bannerOne,
    bannerTwo,
    bannerThree
  ];

  return (
     <ImagesSlider className="h-[40rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-300 py-4">
          We Bridge Talent, Travel, and <br /> Opportunities Worldwide
        </motion.p>
        <button className="text-white px-4 py-2 backdrop-blur-sm border bg-[#0077B6]/10 border-[#0077B6] mx-auto text-center rounded-full relative mt-4 cursor-pointer" onClick={() => {navigate('/register')}}>
          <span>Sign Up →</span>
          <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-[#48CAE4] to-transparent" />
        </button>
      </motion.div>
    </ImagesSlider>
  )
}

export default Hero
