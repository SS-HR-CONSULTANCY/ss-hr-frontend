import React from 'react';
import {
    Select,
    SelectItem,
    SelectValue,
    SelectContent,
    SelectTrigger,
} from "@/components/ui/select";
import { dateSelectList } from '@/utils/constants';
import type { DateSelectInterface } from '@/types/componentTypes/chartTypes';

const DateSelect: React.FC<DateSelectInterface> = ({
    onValueChange,
    value
}) => {

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger
                className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                aria-label="Select a value"
            >
                <SelectValue placeholder="Last 7 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                {dateSelectList.map((item, index) => (
                    <SelectItem key={index} value={item.value} className="rounded-lg">
                        {item.content}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default DateSelect