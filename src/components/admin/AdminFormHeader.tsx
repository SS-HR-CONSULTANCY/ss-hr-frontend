import React from 'react';
import { Button } from '../ui/button';
import { X, type LucideIcon } from 'lucide-react';

interface adminFormHeaderProps {
    Icon: LucideIcon;
    title: string;
    closeFn: () => void;
}

const AdminFormHeader: React.FC<adminFormHeaderProps> = ({
    Icon,
    title,
    closeFn
}) => {

    return (
        <div className="px-6 py-4 border-b border-black">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border border-black">
                        <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold ">{title}</h3>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeFn}
                    className="h-8 w-8 p-0 cursor-pointer"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default AdminFormHeader