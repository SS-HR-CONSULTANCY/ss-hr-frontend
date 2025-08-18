import { Link } from "react-router-dom"

interface CustomLinkProps {
    href: string;
    text: string;
}
const CustomLink:React.FC<CustomLinkProps> = ({
    href,
    text
}) => {
  return (
    <Link
              to={href}
              className="w-full flex justify-center items-center py-2 rounded-md border text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 
                 0h-3m-2-5a4 4 0 11-8 0 
                 4 4 0 018 0zM3 20a6 6 0 
                 0112 0v1H3v-1z"
                />
              </svg>
              {text}
            </Link>
  )
}

export default CustomLink