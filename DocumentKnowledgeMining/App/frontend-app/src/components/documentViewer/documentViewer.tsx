import {
    Dialog,
    DialogBody,
    DialogSurface,
    Divider,
    SelectTabData,
    SelectTabEvent,
    TabListProps,
    Text,
    makeStyles,
    shorthands,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { MetadataTable } from "./metadataTable";
import TableTab from "./tableTab";
import { Embedded, Result } from "../../api/apiTypes/embedded";
import { Document } from "../../api/apiTypes/embedded";
import { downloadDocument, getEmbedded } from "../../api/documentsService";
import { Tokens } from "../../api/apiTypes/documentResults";
import { IFrameComponent } from "./iFrameComponent";
import { DialogContentComponent } from "./dialogContentComponent";
import { PagesTab } from "./PagesTab";
import { PageNumberTab } from "./pageNumberTab";
import { DialogTitleBar } from "./dialogTitleBar";
import { AIKnowledgeTab } from "./aIKnowledgeTab";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
    dialog: {
        maxHeight: "none",
        height: "95%",
        maxWidth: "none",
        width: "95%",
        ...shorthands.borderRadius("1rem"),
    },
    tabList: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        ...shorthands.padding("0px", "0px"),
        rowGap: "20px",
    },
});

interface DocDialogProps {
    metadata: Document | null;
    isOpen: boolean;
    allChunkTexts: string[];
    clearChatFlag: boolean;
    onClose: () => void;
}

interface Cell {
    text: string;
    rowIndex: number;
    rowSpan: number;
    colIndex: number;
    colSpan: number;
    is_header: boolean;
}

export function DocDialog(
    { metadata, isOpen, allChunkTexts, clearChatFlag, onClose }: DocDialogProps,
    props: Partial<TabListProps>
) {
    const {t} = useTranslation();
    const styles = useStyles();
    
    const [selectedTab, setSelectedTab] = useState<string>("Document");
    const [urlWithSasToken, setUrlWithSasToken] = useState<string | undefined>(undefined);
    const [selectedPage, setSelectedPage] = useState<number | null>(null);
    const [tablesData, setTablesData] = useState<string[]>([]);
    const [pageMetadata, setPageMetadata] = useState<Document[] | null>(null);
    const [iframeKey, setIframeKey] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [clearedChatFlag, setClearChatFlag] = useState(false);
    // const [aiKnowledgeMetadata, setAIKnowledgeMetadata] = useState<Document | null>(null);



    const documentUrl: string | undefined = metadata?.document_url;

    useEffect(() => {
        if (metadata) {
            const apiString = `${import.meta.env.VITE_API_ENDPOINT}/Documents/${metadata.documentId}/${encodeURIComponent(metadata.fileName)}`;
            metadata.document_url = apiString;
            setUrlWithSasToken(apiString);
        } else {
            setUrlWithSasToken(undefined);
        }
    }, [metadata]); // Only run when metadata changes
    

    const downloadFile = () => {
        if (urlWithSasToken) {
            window.open(urlWithSasToken, "_blank");
        }
    };

    // useEffect(() => {
    //     const fetchDocument = async () => {
    //         
    //         if (metadata) {
    //             try {
    //                 const { documentId, fileName } = metadata;
    //                 const blob = await downloadDocument(documentId, fileName); // Fetch the document Blob

    //                 // Create an object URL for the Blob and set it to state
    //                 const objectURL = URL.createObjectURL(blob);
    //                 //setUrlWithSasToken(resp.apiEndpoint);
    //                 

    //                 // Cleanup the object URL when the component unmounts or the metadata changes
    //                 return () => URL.revokeObjectURL(objectURL);
    //             } catch (error) {
    //                 console.error(`Error fetching document:`, error);
    //             }
    //         }
    //     };

    //     fetchDocument();
    // }, [metadata]);

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedTab(data.value as string);
    };

    const handleDialogClose = () => {
        onClose();
    };

    // const handleIsOpen = async () => {
    //     if (metadata) {
    //         //const response: Embedded = await getEmbedded(metadata.index_key);

    //         const response: Embedded = await getEmbedded(metadata.documentId);
    //         const pageMetadata: Document[] = response.results.map((page: Result) => page.Document);
    //         setPageMetadata(pageMetadata);
    //     } else {
    //         console.error("Document is undefined");
    //     }
    // };

    // useEffect(() => {
    //     if (isOpen) {
    //         handleIsOpen();
    //     }
    // }, [isOpen]);

    const handlePageClick = (page: Document) => (event: React.MouseEvent<HTMLDivElement>) => {
        setSelectedPage(Number(page.page_number));
        setSelectedTab("Page Number");
        //setTablesData(page.tables);
    };

    // const nextPageTables = (pageNumber: number) => {
    //     const page = pageMetadata?.find((page) => page.page_number === pageNumber + 1);
    //     if (page) {
    //         setSelectedPage(page.page_number);
    //         setTablesData(page.tables);
    //         setSelectedTab("Page Number");
    //     }
    // };

    // const previousPageTables = (pageNumber: number) => {
    //     const page = pageMetadata?.find((page) => page.page_number === pageNumber - 1);
    //     if (page) {
    //         setSelectedPage(page.page_number);
    //         setTablesData(page.tables);
    //     }
    // };

    const selectedPageMetadata =
        selectedPage != null ? pageMetadata?.find((page) => page.page_number === selectedPage) : null;

    const handleReturnToDocumentTab = () => {
        setSelectedPage(null);
        setIframeKey((prevKey) => prevKey + 1);
    };

    // useEffect(() => {
    //     setSelectedTab("Page Number");
    // }, [selectedPageMetadata?.tables]);

    useEffect(() => {
        setSelectedTab("Document");
    }, [iframeKey]);

    const AI_KNOWLEDGE_FIELDS = window.ENV.AI_KNOWLEDGE_FIELDS;
    const METADATA_EXCLUSION_LIST = window.ENV.METADATA_EXCLUSION_LIST;

    let aiKnowledgeMetadata = {};

    AI_KNOWLEDGE_FIELDS.forEach((field: keyof typeof metadata) => {
        if (metadata?.hasOwnProperty(field)) {
            aiKnowledgeMetadata[field] = metadata[field];
        }
    });

    // let newMetadata: Partial<Document> = {};
    // if (metadata) {
    //     Object.keys(metadata).forEach((key) => {
    //         if (!METADATA_EXCLUSION_LIST.includes(key)) {
    //             newMetadata[key as keyof Document] = metadata[key as keyof Document];
    //         }
    //     });
    // }

    return (
        <Dialog open={isOpen}>
            <DialogSurface className={styles.dialog}>
                <div className="flex">
                    <DialogTitleBar
                        metadata={metadata}
                        selectedPage={selectedPage}
                        selectedTab={selectedTab}
                        pageMetadata={pageMetadata}
                        onTabSelect={onTabSelect}
                        handleReturnToDocumentTab={handleReturnToDocumentTab}
                        downloadFile={downloadFile}
                        urlWithSasToken={urlWithSasToken}
                        handleDialogClose={handleDialogClose}
                        selectedPageMetadata={selectedPageMetadata}
                        styles={styles}
                        props={props}
                        clearChatFlag={clearChatFlag} 
                        setClearChatFlag={setClearChatFlag}
                        />
                </div>

                <DialogBody style={{ height: "100%", width: "100%" }}>
                    {selectedTab === "Document" && (
                        <div className="flex h-[150%] w-[200%] justify-between" style={{height:'100vh'}}>
                            <div className="mr-5 h-[80%] w-[75%] shadow-xl">
                                <IFrameComponent
                                    className="h-[100%]"
                                    metadata={metadata}
                                    urlWithSasToken={urlWithSasToken}
                                    iframeKey={iframeKey}
                                />
                            </div>
                            <div className="w-[25%]" style={{height:'80vh', overflowX: 'hidden'}}>
                                <DialogContentComponent
                                    className=""
                                    metadata={metadata}
                                    allChunkTexts={allChunkTexts}
                                    isExpanded={isExpanded}
                                    setIsExpanded={setIsExpanded}
                                />
                            </div>
                        </div>
                    )}
{/* 
                    {selectedTab === "Metadata" && (
                        <div className="flex w-full justify-between" style={{ width: "200%" }}>
                            <MetadataTable metadata={newMetadata} />
                        </div>
                    )} */}

                    {selectedTab === "Pages" && (
                        <>
                            <PagesTab className="" pageMetadata={pageMetadata} handlePageClick={handlePageClick} />
                        </>
                    )}

{selectedTab === "AI Knowledge" && (
    <AIKnowledgeTab 
        metadata={metadata?.keywords ? Object.fromEntries(
            Object.entries(metadata.keywords).map(([key, value]) => [
                key, 
                Array.isArray(value) ? value : [value]  // Ensure all values are arrays
            ])
        ) : {}}
    />
)}




                    {selectedTab === "Page Number" && selectedPageMetadata && documentUrl != undefined && (
                        <>
                            <PageNumberTab
                                selectedTab={selectedTab}
                                selectedPageMetadata={selectedPageMetadata}
                                documentUrl={documentUrl}
                            />
                        </>
                    )}

                    {/* {selectedTab === "Tables" && selectedPageMetadata && (
                        <div className="h-[80%] w-[200%] justify-between overflow-y-auto">
                            {selectedPageMetadata.tables?.map((tableData, index) => (
                                <div
                                    style={{
                                        display: "block",
                                        padding: "10px",
                                        margin: "10px",
                                    }}
                                    key={index}
                                >
                                    <Text size={400} weight="bold">
                                        Table {index + 1}
                                    </Text>
                                    <TableTab tableValues={JSON.parse(tableData)} />
                                    {index < tablesData.length - 1 && <Divider appearance="strong" />}
                                </div>
                            ))}
                        </div>
                    )} */}

                    {selectedTab === "PageMetadata" && selectedPageMetadata && (
                        <div className="flex w-full justify-between" style={{ width: "200%" }}>
                            <MetadataTable metadata={selectedPageMetadata} />
                        </div>
                    )}
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
