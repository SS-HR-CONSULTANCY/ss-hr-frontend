export interface ContentCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  hoverDescription?: string;
  buttonText: string;
  buttonUrl: string;
}


export interface ServiceProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  hoverDescription?: string;
  href?: string;

  showButton?: boolean;
  buttonText: string;
  buttonUrl: string;

  banner: string;
  bannerTitle: string;
  points: string[];
  contactText: string;
  contactUrl: string;
  contactButtonText: string;
}