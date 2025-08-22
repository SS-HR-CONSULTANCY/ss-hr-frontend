import React from 'react';
import Heading from '../common/Heading';
import { packages } from '@/utils/constants';
import { LayoutGrid } from '../ui/layout-grid';
import type { PackageContent } from '@/types/componentTypes/imageGridTypes';

const ImageGrid: React.FC = () => {
    return (
        <div className="h-screen py-20 w-full">
            <Heading
                heading='Package Destinations'
                dataaos='fade-down'
                headingDescription='Checkout our plans destinations' mainDivClassName="text-center mx-auto max-w-2xl" />
            <LayoutGrid cards={cards} />
        </div>
    )
}

export default ImageGrid

const PackageContent: React.FC<PackageContent> = ({ title, description }) => {
    return (
        <div>
            <p className="font-bold md:text-4xl text-xl text-white">
                {title}
            </p>
            <p className="font-normal text-base text-white"></p>
            <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
                {description}
            </p>
        </div>
    );
};

const cards = packages.map((pkg) => ({
    id: pkg.id,
    content: <PackageContent title={pkg.content.title} description={pkg.content.description} />,
    className: pkg.className,
    thumbnail: pkg.thumbnail,
}));