import React from 'react';
import AosComponent from '@/utils/AosComponent';
import Contact from '@/components/sections/Contact';

const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <AosComponent>
                <Contact />
            </AosComponent>
        </div>
    )
}

export default ContactPage