export interface ContentCardProps {
  title: string;
  description: string;
  hoverDescription?: string;
  imageUrl: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonAction?: string;
}

export interface ServiceProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  points?: string[];
  banner?: string;
  bannerTitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonAction?: string;
  showButton?: boolean;
  contactText?: string;
  contactButtonText?: string;
  contactUrl?: string;
  hoverDescription?: string;
  heroTitle?: string;
}
