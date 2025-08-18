import React from 'react';
import { Button } from '../ui/button';
import Heading from '../common/Heading';
import { packages } from '@/utils/constants';
import { useAppSelector } from '@/hooks/redux';
import { CheckIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../ui/card';

const Packages: React.FC = () => {

    const { isAuthenticated } = useAppSelector((state) => state.auth);

    return (
        <section id="packages" className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Heading heading='Packages' headingDescription='Checkout our packages.' mainDivClassName="text-center mx-auto max-w-2xl" />
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-6`} >
                    {packages.map(item => (
                        <Card key={item.name} className={`p-4 rounded-2xl shadow-sm flex flex-col border-2 hover:border-[#01487e] ${item.popular && "border-2 border-[#01487e]"}`}>
                            <CardHeader>
                                <CardTitle className="mb-7">{item.name}</CardTitle>
                                <span className="font-bold text-5xl">{item.price === 0 ? "FREE" : item.price}</span>
                            </CardHeader>
                            <CardDescription className="text-center">
                                {item.description}
                            </CardDescription>
                            <CardContent className="flex-1">
                                <ul className="mt-7 space-y-2.5 text-sm">
                                    {item.features.map((feature, i: number) => (
                                        <li key={i} className="flex space-x-2">
                                            <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            {!isAuthenticated ? (
                                <div className="mt-auto">
                                    <Button className="w-full cursor-pointer" onClick={() => { }}>Choose Plan</Button>
                                </div>
                            ) : (
                                <CardFooter>
                                    <Button className="w-full cursor-pointer hover:bg-[#01487e]" variant={"outline"}>
                                        Sign up
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Packages