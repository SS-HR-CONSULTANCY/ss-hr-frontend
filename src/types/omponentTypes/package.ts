export interface PackageProps {
    name: string;
    description: string;
    features: string[];
    price: number;
    popular?: boolean;
}