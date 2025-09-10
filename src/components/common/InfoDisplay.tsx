import { Copy } from "lucide-react";

const formatBoolean = (val: boolean) => (val ? "Yes" : "No");

export interface InfoDisplayProps {
  label: string;
  value: string | boolean | number | string[] | Date | undefined | null;
  formatDate?: (dateString: string) => string;
  copyToClipboard?: (text: string) => void;
  link?: boolean;
  isBoolean?: boolean;
  isPrice?: boolean;
  isLast?: boolean;
  isRadioGroup?: boolean;
  selectedRadioValue?: string | null;
  onRadioChange?: (value: string) => void;
  role?: string;
}

const InfoDisplay: React.FC<InfoDisplayProps> = ({
    label,
    value,
    formatDate,
    copyToClipboard,
    isBoolean,
    link,
    isPrice,
    isLast,
}) => {

    let displayValue: React.ReactNode;

    if (value === null || value === undefined) {
        displayValue = "Not Yet added";
    } else if (isBoolean) {
        displayValue = formatBoolean(value as boolean);
    } else if (isPrice) {
        displayValue = `₹ ${value as string} INR`;
    } else if (copyToClipboard && typeof value === "string") {
        displayValue = (
            <div className="flex items-center">
                <p className="mr-2">{value}</p>
                {value !== "Not Yet added" && (
                    <button
                        className="text-[var(--mainColor)] hover:text-[var(--mainColorHover)] cursor-pointer"
                        onClick={() => copyToClipboard(value)}
                    >
                        <Copy />
                    </button>
                )}
            </div>
        );
    } else if (formatDate && typeof value === "string") {
        displayValue = formatDate(value);
    } else if (link && typeof value === "string") {
        displayValue = (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {value}
            </a>
        );
    } else {
        displayValue = value as string;
    }

    return (
        <tr className={`${!isLast ? "border-b border-[var(--boxBorder)]" : ""}`}>
            <td className="p-4 font-medium text-[var(--infoDataLabel)] w-4/12">{label}</td>
            <td className="p-4 w-8/12">{displayValue}</td>
        </tr>
    );
}

export default InfoDisplay