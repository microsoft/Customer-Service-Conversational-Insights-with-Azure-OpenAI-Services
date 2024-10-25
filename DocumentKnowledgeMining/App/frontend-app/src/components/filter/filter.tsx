import React, { useEffect, useState, memo, useRef } from "react"; 
import { Checkbox } from "@fluentui/react-checkbox";
import { useTranslation } from "react-i18next";
import { Button, Accordion, AccordionHeader, AccordionItem, AccordionPanel, makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
    clearAll: { 
        fontSize: "12px", 
        fontWeight: "600" 
    },
    accordionWrapper: {
        height: "calc(82vh - 90px)",
        overflowY: "auto",
        transition: "max-height 0.3s ease",
    },
    accordionPanel: {
        paddingRight: "10px",
    }
});

interface MemoizedCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, data: { checked: string | boolean }) => void;
}

const MemoizedCheckbox = memo(({ label, checked, onChange }: MemoizedCheckboxProps) => (
    <Checkbox
        label={label}
        checked={checked}
        onChange={onChange}
    />
));

interface FilterProps {
    className?: string;
    keywordFilterInfo: { [key: string]: string[] } | undefined;  
    onFilterChanged: (selectedKeywords: { [key: string]: string[] }) => void;  
    prevSelectedFilters: { [key: string]: string[] };
    clearFilters: boolean; // New prop to trigger filter clearing
    onFilterCleared: () => void; // New prop to notify parent that filters have been cleared
}

export function Filter({ 
    className, 
    keywordFilterInfo = {}, 
    onFilterChanged, 
    prevSelectedFilters, 
    clearFilters, 
    onFilterCleared 
}: FilterProps) {
    const { t } = useTranslation();
    const classes = useStyles();

    const localStorageKey = "selectedKeywords";

    const getInitialSelectedKeywords = () => {
        try {
            const storedFilters = localStorage.getItem(localStorageKey);
            return storedFilters ? JSON.parse(storedFilters) : prevSelectedFilters || {};
        } catch (error) {
            console.error("Error parsing localStorage data", error);
            return prevSelectedFilters || {};
        }
    };

    const [selectedKeywords, setSelectedKeywords] = useState<{ [key: string]: string[] }>(getInitialSelectedKeywords);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            try {
                localStorage.setItem(localStorageKey, JSON.stringify(selectedKeywords));
                onFilterChanged(selectedKeywords);
            } catch (error) {
                console.error("Error saving data to localStorage", error);
            }
        }
    }, [selectedKeywords]);

    // New useEffect to handle clearFilters prop
    useEffect(() => {
        if (clearFilters) {
            setSelectedKeywords({});
            localStorage.removeItem(localStorageKey);
            onFilterCleared(); // Notify parent that filters have been cleared
        }
    }, [clearFilters, onFilterCleared]);

    const handleCheckboxChange = (checked: boolean, category: string, keyword: string) => {
        setSelectedKeywords((prevKeywords) => {
            const newKeywords = { ...prevKeywords };

            if (checked) {
                if (!newKeywords[category]) {
                    newKeywords[category] = [];
                }
                if (!newKeywords[category].includes(keyword)) {
                    newKeywords[category].push(keyword);
                }
            } else {
                if (newKeywords[category]) {
                    newKeywords[category] = newKeywords[category].filter((k) => k !== keyword);
                    if (newKeywords[category].length === 0) {
                        delete newKeywords[category];
                    }
                }
            }

            return newKeywords;
        });
    };

    return (
        <div className={`${className || ""} flex flex-col`}>
            <div className={classes.accordionWrapper}>
                <Accordion multiple collapsible>
                    {keywordFilterInfo && Object.entries(keywordFilterInfo).slice(0,10).map(([category, keywords], index) => (
                        <AccordionItem key={index} value={index.toString()}>
                            <AccordionHeader inline>{category}</AccordionHeader>
                            <AccordionPanel className={classes.accordionPanel}>
                                {keywords.map((keyword, keywordIndex) => {
                                    const isChecked = selectedKeywords[category]?.includes(keyword) || false;

                                    return (
                                        <div key={keywordIndex}>
                                            <MemoizedCheckbox
                                                label={keyword}
                                                checked={isChecked}
                                                onChange={(event, data) =>
                                                    handleCheckboxChange(data.checked === 'true' || data.checked === true, category, keyword)
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}