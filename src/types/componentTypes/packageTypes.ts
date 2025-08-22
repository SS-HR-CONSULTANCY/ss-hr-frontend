
export interface PackageProps {
  id: number;
  name: string;
  description: string;
  features: string[];
  price: number;
  popular?: boolean;
  className: string;
  thumbnail: string;
  content: {
    title: string;
    description: string;
  };
}