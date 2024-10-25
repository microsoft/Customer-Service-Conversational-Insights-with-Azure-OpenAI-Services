import { Select, SelectProps, useId } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface OrderByProps {
    onSortSelected: (sort: string) => void;
}                                                                                                                                                                                                                                                                                                       

export function OrderBy({ onSortSelected }: OrderByProps) {
    const { t } = useTranslation();
    
    const selectId = useId();
    const [value, setValue] = useState("");
    const [viewValue, setViewValue] = useState("Sort by...");

    useEffect(() => {
        onSortSelected(value);
    }, [value]);

    const onChange: SelectProps["onChange"] = (event, data) => {
        switch (data.value) {
            case 'Title':
                setViewValue('Title');
                setValue('title');
                break;
            case 'Creation Date':
                setViewValue('Creation Date');
                setValue('creation_date');
                break;
            case 'Last Modified':
                setViewValue('Last Modified');
                setValue('last_modified');
                break;
            case 'Processing Date':
                setViewValue('Processing Date');
                setValue('processing_date');
                break;
            case 'Source Processing Date':
                setViewValue('Source Processing Date');
                setValue('source_processing_date');
                break;
            case 'Source Last Modified':
                setViewValue('Source Last Modified');
                setValue('source_last_modified');
                break;
            default:
                setViewValue('Sort by...');
                setValue('');
                break;
        }
    };

    return (
        <>
            <Select id={selectId} onChange={onChange} value={viewValue}>
                <option>{t('components.order-by.sort-by')}</option>
                <option>{t('components.order-by.title')}</option>
                <option>{t('components.order-by.creation-date')}</option>
                <option>{t('components.order-by.last-modified')}</option>
                <option>{t('components.order-by.processing-date')}</option>
                <option>{t('components.order-by.source-processing-date')}</option>
                <option>{t('components.order-by.source-last-modified')}</option>
            </Select>
        </>
    );
}
