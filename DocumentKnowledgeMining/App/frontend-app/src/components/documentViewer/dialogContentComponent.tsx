import { Document } from "../../api/apiTypes/embedded";
import { DialogContent, Tag } from "@fluentui/react-components";
import { Text } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

interface IDialogContentComponentProps {
    className?: string;
    metadata: Document | null;
    allChunkTexts: string[];
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
}

export function DialogContentComponent({
    className,
    metadata,
    allChunkTexts,
    isExpanded,
    setIsExpanded,
}: IDialogContentComponentProps) {
    const { t } = useTranslation();
    
    return (
        <DialogContent className={`${className} `}>
            {metadata?.summary && metadata.summary.length > 0 && (
                <div className="mb-4">
                    <Text size={500} weight="semibold">
                        {t("components.dialog-content.extractive-summary")}
                    </Text>
                </div>
            )}

            {metadata?.summary.split('\n').map((item, index) => (
                <div key={index} className="mb-4">
                    <Text size={300} weight="regular">
                        {item}
                    </Text>
                </div>
            ))}
            
            {metadata?.summary && (
                <div className="mb-4 ">
                    <Tag className="shadow-md" size="extra-small">{t("components.dialog-content.ai-generated-tag")}</Tag>
                </div>
            )}

            {allChunkTexts && allChunkTexts.length > 0 && allChunkTexts.some((item) => item !== null) && (
                <div className="mb-4 flex justify-between">
                    <Text size={500} weight="semibold">
                    {t("components.dialog-content.chunk-texts")}
                    </Text>
                </div>
            )}

            <div className="mb-4 h-96 overflow-y-auto">
                {allChunkTexts.map(
                    (item, index) =>
                        item && (
                            <div key={index} className="mb-4">
                                <div
                                    className="rounded-md border border-neutral-500 p-3"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    <Text size={300} weight="regular">
                                        {isExpanded ? item : `${item.substring(0, 200)}...`}
                                    </Text>
                                </div>
                            </div>
                        )
                )}
            </div>
        </DialogContent>
    );
}
