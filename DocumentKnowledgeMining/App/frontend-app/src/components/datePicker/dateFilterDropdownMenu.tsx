import React, { useState, useEffect, useCallback } from "react";
import { Dropdown, Option, makeStyles } from "@fluentui/react-components";
import { CustomDatePicker } from "./customDatePicker";

const useStyles = makeStyles({
    root: {
        maxWidth: "300px",
    },
    dropdown: {
        height: "48px",
        lineHeight: "48px",
        width:"100%",
        minWidth:"auto"
    },
});

interface DateFilterDropdownMenuProps {
    onFilterChange: (filter: { option: string, startDate: Date | null, endDate: Date | null }) => void;
    selectedFilter: string;
    reset: boolean;
}

export function DateFilterDropdownMenu({
    onFilterChange,
    selectedFilter,
    reset,
}: DateFilterDropdownMenuProps) {
    const styles = useStyles();

    const [selectedOption, setSelectedOption] = useState<string>(selectedFilter || "");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleOptionSelect = useCallback((event: any, data: any) => {
        const selectedValue = data.optionValue;
        setSelectedOption(selectedValue);
        onFilterChange({ option: selectedValue, startDate, endDate });
    }, [onFilterChange, startDate, endDate]);

    // Effect to reset the values when the "Clear All" button is pressed
    useEffect(() => {
        if (reset) {
            setSelectedOption("");
            setStartDate(null);
            setEndDate(null);
            
            onFilterChange({ option: "", startDate: null, endDate: null });
        }
    }, [reset, onFilterChange]);

    // Effect to update selectedOption when selectedFilter changes
    useEffect(() => {
        setSelectedOption(selectedFilter || "");
    }, [selectedFilter]);

    return (
        <div className={styles.root}>
            <Dropdown
                className={styles.dropdown}
                aria-labelledby="dropdown-label"
                placeholder="Anytime"
                appearance="outline"
                selectedOptions={selectedOption ? [selectedOption] : []}
                onOptionSelect={handleOptionSelect}
            >
                <Option key="1" value="All">All</Option>
                <Option key="2" value="Past 24 hours">Past 24 hours</Option>
                <Option key="3" value="Past week">Past week</Option>
                <Option key="4" value="Past month">Past month</Option>
                <Option key="5" value="Past year">Past year</Option>
            </Dropdown>
        </div>
    );
}