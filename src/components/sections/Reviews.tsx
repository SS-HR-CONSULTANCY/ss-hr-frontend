import React from 'react';
import { motion } from "framer-motion";
import Heading from '../common/Heading';
import { reviews } from '@/utils/constants';
import { AuroraBackground } from '../ui/aurora-background';
import { InfiniteMovingCards } from '../ui/infinite-moving-cards';

const Reviews: React.FC = () => {
    return (
        <section id="reviews" className="py-16">
            <Heading
                heading='Reviews'
                headingDescription='See what our customers are saying about us.'
                mainDivClassName='text-center mx-auto max-w-2xl'
            />
            <AuroraBackground>
                <div className="w-full overflow-hidden leading-[0]">
                    <svg
                        className="relative block rotate-y-180"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="fill-[#01487e]"></path>
                        <path d="M1250 120L0 12.48 0 0 1200 0 1200 120z" className="fill-white dark:fill-black"></path>
                    </svg>
                </div>
                <motion.div
                    initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="relative flex flex-col gap-4 items-center justify-center px-4"
                >
                    <div className="relative w-full max-w-screen overflow-hidden">
                        <InfiniteMovingCards
                            items={reviews}
                            direction="right"
                            speed="normal"
                        />
                    </div>
                    <div className="relative w-full max-w-screen overflow-hidden mt-4 hidden md:block">
                        <InfiniteMovingCards
                            items={reviews}
                            direction="left"
                            speed="normal"
                        />
                    </div>
                </motion.div>
                <div className="w-full overflow-hidden leading-[0] rotate-180">
                    <svg
                        className="relative block"
                        style={{ transform: 'rotateY(180deg)' }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="fill-[#01487e]"></path>
                        <path d="M1250 120L0 13.48 0 0 1200 0 1200 120z" className="fill-white dark:fill-black"></path>
                    </svg>
                </div>
            </AuroraBackground>
        </section>
    )
}

export default Reviews