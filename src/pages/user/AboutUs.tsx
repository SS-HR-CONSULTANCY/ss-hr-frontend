import React from 'react';
import Lottie from 'lottie-react';
import { mdData, words } from '@/utils/constants';
import { Card } from '@/components/ui/card';
import Heading from '@/components/common/Heading';
import world from '../../assets/lotteFiles/world.json';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

const AboutUs: React.FC = () => {

    return (
        <section id="aboutus" className="py-16 min-h-screen">

            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 px-4 md:px-0">
                <div className="col-span-12 md:col-span-8" data-aos="fade-right">
                    <Heading
                        heading="About Us"
                        headingDescription="Know more about us"
                        mainDivClassName="text-left"
                        headingClassName="w-[60%]"
                    />
                    <TextGenerateEffect duration={2} filter={false} words={words} />
                </div>
                <div className="col-span-12 md:col-span-4 flex justify-center items-center">
                    <Lottie
                        animationData={world}
                        loop={true}
                        className="w-64 h-64"
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-16">
                <Heading
                    heading="Our Managing Directors"
                    headingDescription=""
                    mainDivClassName="text-left"
                    headingClassName="w-[60%]"
                />

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {mdData.map(data => (

                        <Card className="flex flex-col items-center p-6 shadow-md">
                            <img
                                src={data.profileImage}
                                alt="Managing Director 1"
                                className="w-32 h-32 rounded-full object-cover mb-4"
                            />
                            <h3 className="text-xl font-semibold">{data.name}</h3>
                            <p className="text-center italic  mt-2">{data.quote}</p>
                        </Card>
                    ))}

                </div>

                <div className="max-w-7xl mx-auto">
                    <Heading
                        heading="Our Acheivements"
                        headingDescription=""
                        mainDivClassName="text-left"
                        headingClassName="w-[60%]"
                    />
                    <ul className="list-disc list-inside text-lg space-y-2 text-left">
                        <li>Successfully placed 10,000+ candidates globally</li>
                        <li>Partnered with 200+ leading companies worldwide</li>
                        <li>Awarded for excellence in overseas recruitment</li>
                        <li>Launched tech-driven travel & visa solutions</li>
                        <li>Expanding into multiple industries including IT & tourism</li>
                    </ul>
                </div>
            </div>

        </section>
    )
}

export default AboutUs