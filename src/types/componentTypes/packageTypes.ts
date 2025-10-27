export interface PackageProps {
  id: number;
  name: string;
  description: string;
  features: string[];
  price: number;
  popular?: boolean;
}
