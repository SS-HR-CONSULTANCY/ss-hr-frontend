import { Link } from "react-router-dom";
import type { CustomLinkProps } from "@/types/componentTypes/customLinkTypes";

const CustomLink: React.FC<CustomLinkProps> = ({ href, text, icon: Icon }) => {
  return (
    <Link
      to={href}
      className="w-full flex justify-center items-center gap-2 py-2 rounded-md border text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </Link>
  );
};

export default CustomLink;
