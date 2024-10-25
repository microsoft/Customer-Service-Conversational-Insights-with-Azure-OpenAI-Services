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

interface SearchResultCardProps {
    document: Document;
    tokens: Tokens;
    coverImageUrl: string | undefined;
    selectedDocuments: Document[];
    chatWithDocument: (document: Document) => void;
    updateSelectedDocuments: (document: Document) => void;
}

export function SearchResultCard({
    document,
    tokens,
    coverImageUrl,
    selectedDocuments,
    updateSelectedDocuments,
    chatWithDocument,
}: SearchResultCardProps) {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [checked, setChecked] = useState(false);

    const documentToken: string | undefined = tokens?.["documents"];

    let fileType = "";
    switch (document.mimeType) {
        case "application/pdf":
            fileType = "pdf";
            break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            fileType = "docx";
            break;
        case "application/vnd.ms-powerpoint":
            fileType = "pptx";
            break;
        case "application/vnd.ms-excel":
            fileType = "xlsx";
            break;
        default:
            fileType = "default";
    }

    const chatWithSearchResult = (document: Document) => {
        chatWithDocument(document);
    };

    const handleDownload = async (documentUrl: string, fileName: string) => {
        await downloadFile(documentUrl, fileName);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleOpenDialog = async () => {
        setIsDialogOpen(true);
    };

    useEffect(() => {
        setChecked(selectedDocuments.some(selectedDocument => selectedDocument.documentId === document.documentId));
    }, [selectedDocuments, document]);

    return (
        <>
            <div className="flex flex-row items-start p-4 border-b border-gray-200">
                <div className="-ml-5 -mr-4 -mt-5 h-1" />
                <div className="flex flex-col flex-grow">
                    <div className={`flex items-center mb-2`} onClick={() => updateSelectedDocuments(document)}>
                        <div
                            className={`flex items-center ${
                                selectedDocuments.includes(document) ? "shadow-xl shadow-neutral-500/50" : ""
                            }`}
                            style={{ width: "200px", overflow: "hidden" }}
                        >
                            {/* {coverImageUrl ? (
                                <img
                                    src={coverImageUrl}
                                    alt="Document cover"
                                    width={200}
                                    style={{ objectFit: "cover", objectPosition: "center" }}
                                />
                            ) : (
                                <div className="ml-20">
                                    <Document48Regular />
                                </div>
                            )} */}
                        </div>
                    </div>
                    
                    <div className="flex items-center mt-3">
                        <Checkbox 
                            checked={checked}
                            onChange={() => updateSelectedDocuments(document)}
                            className="mr-3"
                        />
                        <Icon
                            {...getFileTypeIconProps({ extension: fileType, size: 24, imageFileType: "svg" })}
                        />
                        <div className="flex-grow ml-3 flex items-center justify-between">
                            <Text as="h1" size={500} weight="bold" className="truncate" title={document.fileName}>
                                {document.fileName}
                            </Text>
                            <Button appearance="outline" onClick={() => handleOpenDialog()}>
                                Details
                            </Button>
                        </div>
                    </div>

                    <div className="ml-5 flex-col">
                        <div className="space-x-2 flex mt-2">
                            {isDialogOpen && (
                                <DocDialog
                                    metadata={document}
                                    isOpen={isDialogOpen}
                                    onClose={handleDialogClose}
                                    allChunkTexts={[]} clearChatFlag={false}                                />
                            )}


                            {/* <Button appearance="outline" onClick={() => chatWithSearchResult(document)}>
                                Chat
                            </Button>
                            <Button
                                appearance={checked ? "primary" : "outline"}
                                onClick={() => updateSelectedDocuments(document)}
                            >
                                {checked ? "Selected" : "Select"}
                            </Button> */}
                        </div>
                        <div className="mb-5 mt-5 flex min-h-[80px] flex-1 text-ellipsis pt-2">
                            {document.summary}
                        </div>
                    </div>
                    
                </div>

                <div className="mt-3 flex flex-wrap items-center">
                    <TagGroup role="list" className="flex flex-wrap">
                        {Object.entries(document.keywords)
                            .flatMap(([category, phrases]) => phrases.split(", ").slice(0, 2)) // Take 2 phrases from each category
                            .map((phrase, index) => (
                                <Tag key={index} role="listitem" size="extra-small" className="mb-2">
                                    {phrase}
                                </Tag>
                            ))}
                    </TagGroup>
                </div>
                <div className="border-b border-b-neutral-300 pb-5" />
            </div>
        </>
    );
}
