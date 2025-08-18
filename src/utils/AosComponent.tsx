import AOS from "aos";
import 'aos/dist/aos.css';
import { useEffect, type ReactElement, type ReactNode } from "react";

interface AoscompoProps {
    children: ReactNode | ReactElement;
}

const AosComponent = ({ children }: AoscompoProps) => {
    useEffect(() => {
        AOS.init({
            duration: 1200,
            once: false,
        })
    }, [])
    return (
        <div>
            {children}
        </div>
    )
}

export default AosComponent
