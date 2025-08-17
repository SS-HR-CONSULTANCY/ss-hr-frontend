import React from 'react';
import Heading from '../common/Heading';
import ContentCard from '../ui/ContentCard';
import { services } from '@/utils/constants';


const Services: React.FC = () => {
  return (
    <section id="services" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Heading heading='Our Services' headingDescription='our services' mainDivClassName="text-center mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <ContentCard 
              key={service.title}
              title={service.title}
              description={service.description}
              hoverDescription={service.hoverDescription}
              imageUrl={service.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services