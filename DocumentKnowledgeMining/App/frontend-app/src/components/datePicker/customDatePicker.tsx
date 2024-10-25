import React, { useCallback, useState, useRef } from "react";
import { Field, makeStyles } from "@fluentui/react-components";
import { DatePicker, DatePickerProps } from "@fluentui/react-datepicker-compat"; // Latest date picker

// Define styles using Fluent UI's makeStyles
const useStyles = makeStyles({
    control: {
        maxWidth: "90px", // Keep the control compact
    },
});

// Function to format the selected date into "dd/mm/yyyy" format
const onFormatDate = (date?: Date): string => {
    return !date ? "" : `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

// Custom DatePicker component using Fluent UI's latest DatePicker
export function CustomDatePicker(props: Partial<DatePickerProps>) {
    const styles = useStyles();
    
    // Internal state to store the selected date
    const [value, setValue] = useState<Date | null | undefined>(null);
    
    // Reference to the input element (if needed)
    const datePickerRef = useRef<HTMLInputElement>(null);

    // Function to parse the date from string format (e.g., from user input)
    const onParseDateFromString = useCallback(
        (newValue: string): Date => {
            const previousValue = value || new Date();
            const newValueParts = newValue.trim().split("/");
            const day = newValueParts.length > 0 ? Math.max(1, Math.min(31, parseInt(newValueParts[0], 10))) : previousValue.getDate();
            const month = newValueParts.length > 1 ? Math.max(1, Math.min(12, parseInt(newValueParts[1], 10))) - 1 : previousValue.getMonth();
            let year = newValueParts.length > 2 ? parseInt(newValueParts[2], 10) : previousValue.getFullYear();
            
            // If year has only two digits, assume it's within the current century
            if (year < 100) {
                year += previousValue.getFullYear() - (previousValue.getFullYear() % 100);
            }

            return new Date(year, month, day);
        },
        [value]
    );

    return (
        <Field label="">
            <DatePicker
                className={styles.control}
                placeholder="Select a date"
                value={value}
                onSelectDate={setValue as (date?: Date | null) => void} // Set the selected date
                formatDate={onFormatDate} // Custom date formatting function
                parseDateFromString={onParseDateFromString} // Parsing string into Date object
                size="small" // Keeping the input small
                {...props} // Allow any additional props passed from parent
            />
        </Field>
    );
}
