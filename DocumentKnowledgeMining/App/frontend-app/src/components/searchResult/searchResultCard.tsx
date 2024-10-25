import { Button, Checkbox, Text } from "@fluentui/react-components";
import { Tag, TagGroup } from "@fluentui/react-tags-preview";
import { Document48Regular } from "@fluentui/react-icons";
import { Icon } from "@fluentui/react";
import { getFileTypeIconProps } from "@fluentui/react-file-type-icons";
import { KMBrandRamp } from "../../styles";
import { DocDialog } from "../documentViewer/documentViewer";
import { useEffect, useState } from "react";
import { Document, Tokens } from "../../api/apiTypes/documentResults";
import { downloadFile } from "../../api/storageService";
import "./searchResultCard.scss";
interface SearchResultCardProps {
    document: Document;
    coverImageUrl: string | undefined;
    selectedDocuments: Document[];
    chatWithDocument: (document: Document) => void;
    updateSelectedDocuments: (document: Document) => void;
}

export function SearchResultCard({
    document,
    coverImageUrl,
    selectedDocuments,
    updateSelectedDocuments,
    chatWithDocument,
}: SearchResultCardProps) {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [checked, setChecked] = useState(false);
    const [clearChatFlag, setClearChatFlag] = useState(false);


    let fileType = "";
    switch (document.mimeType) {
        case "application/pdf":
        case "application/x-pdf":
            fileType = "pdf";
            break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword":
            fileType = "docx";
            break;
        case "application/vnd.ms-powerpoint":
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            fileType = "pptx";
            break;
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "application/vnd.ms-excel":
            fileType = "xlsx";
            break;
        case "image/jpeg":
            fileType = "jpg";
            break;
        case "image/png":
            fileType = "png";
            break;
        case "image/gif":
            fileType = "gif";
            break;
        default:
            fileType = "default";
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleOpenDialog = async () => {
        setIsDialogOpen(true);
        setClearChatFlag(true);
    };

    useEffect(() => {
        setChecked(selectedDocuments.some(selectedDocument => selectedDocument.documentId === document.documentId));
    }, [selectedDocuments, document]);

    // Utility function to truncate the summary
    const truncateSummary = (summary: string, wordLimit: number) => {
        const words = summary.split(' ');
        if (words.length <= wordLimit) return summary;
        return `${words.slice(0, wordLimit).join(' ')}...`;
    };

    return (
        <>
            <div className="flex flex-row items-start p-4 border-gray-200">
                <div className="-ml-5 -mt-5 h-1" />
                <div className="flex flex-col flex-grow">
                    <div className={`flex items-center mb-2`} onClick={() => updateSelectedDocuments(document)}>
                        <div
                            className={`flex items-center ${
                                selectedDocuments.includes(document) ? "shadow-xl shadow-neutral-500/50" : ""
                            }`}
                            style={{ width: "200px", overflow: "hidden" }}
                        >
                            {/* Optional cover image rendering logic here */}
                        </div>
                    </div>
                    
                    <div className="flex items-center mt-3">
                        <Checkbox 
                            checked={checked}
                            onChange={() => updateSelectedDocuments(document)}
                            className="mr-3"
                        />
                        <Icon
                            style={{ minWidth: 22}}
                            {...getFileTypeIconProps({ extension: fileType, size: 24, imageFileType: "svg", })}
                        />
                        <div className="flex-grow ml-3 flex items-center justify-between">
                            <Text as="h1" size={500} weight="bold" className="truncate filename" title={document.fileName}>
                                {document.fileName}
                            </Text>
                            {isDialogOpen && (
                                <DocDialog
                                    metadata={document}
                                    isOpen={isDialogOpen}
                                    onClose={handleDialogClose}
                                    allChunkTexts={[]}
                                    clearChatFlag={clearChatFlag}                               />
                            )}
                            <Button appearance="outline" onClick={() => handleOpenDialog()}>
                                Details
                            </Button>
                        </div>
                    </div>

                    <div className="ml-5 flex-col">
                        <div className="mb-2 mt-1 flex min-h-[80px] flex-1 text-ellipsis pt-2"> {/* Reduced margins */}
                            <Text className="line-clamp-2" title={document.summary}>
                                {truncateSummary(document.summary, 30)} {/* Limit to 30 words */}
                            </Text>
                        </div>

                        {/* Tag group displayed side by side under the summary */}
                        <div className="mt-1 flex flex-wrap items-center border-b bottom-container"> {/* Reduced margin here as well */}
                            <TagGroup role="list" className="flex flex-wrap">
                                {Object.entries(document.keywords)
                                    .flatMap(([category, phrases]) => phrases.split(", ")) // Split phrases into an array
                                    .slice(0, 4) // Take only the first 4 phrases
                                    .map((phrase, index) => (
                                        <Tag key={index} role="listitem" size="extra-small" className="mb-2 mr-2">
                                            {phrase}
                                        </Tag>
                                    ))}
                            </TagGroup>
                        </div>
                    </div>
                </div>
                

                <div className="border-b border-b-neutral-300 pb-5" />
            </div>
        </>
    );
}
