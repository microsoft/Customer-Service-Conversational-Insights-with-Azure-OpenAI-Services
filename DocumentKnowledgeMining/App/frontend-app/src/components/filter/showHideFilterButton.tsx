import React from "react";
import { Button } from "@fluentui/react-components";
import { Filter20Filled } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

interface FilterButtonProps {
    className?: string;
    onFilterPress?: () => void;
}

export function FilterButton({ className, onFilterPress }: FilterButtonProps) {
    const { t } = useTranslation();
    return (
        <>
            <Button className="h-full" onClick={onFilterPress} icon={<Filter20Filled />} appearance="subtle">
                {t('components.filter.title')}
            </Button>
        </>
    );
}
