export interface SingleTabProps {
    icon: React.ReactNode;
    text: string;
    sidebarOpen: boolean;
    onClick?: () => void;
    className?: string;
}