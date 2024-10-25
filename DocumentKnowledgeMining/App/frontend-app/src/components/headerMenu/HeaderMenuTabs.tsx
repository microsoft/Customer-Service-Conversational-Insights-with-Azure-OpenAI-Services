import {
    Button,
    Menu,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    Tab,
    TabList,
} from "@fluentui/react-components";
import { Search20Regular, Dismiss24Regular, ChatSparkle20Filled } from "@fluentui/react-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Tokens } from "../../api/apiTypes/documentResults";
import { useState } from "react";
import { DocDialog } from "../documentViewer/documentViewer";
import { useTranslation } from "react-i18next";

interface HeaderMenuTabsTabsProps {
    className?: string;
    searchResultDocuments?: Document[];
    selectedDocuments: Document[];
    tokens: Tokens | undefined;
    updateSelectedDocuments: (document: Document) => void;
}

export function HeaderMenuTabs({
    className,
    searchResultDocuments,
    selectedDocuments,
    tokens,
    updateSelectedDocuments,
}: HeaderMenuTabsTabsProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.substring(1);

    const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
    const [isDocToBeOpened, setIsDocToBeOpened] = useState<Document | null>(null);

    const tabs = [
        { value: "search", label: "Search", icon: <Search20Regular /> },
        { value: "chat", label: "Chat", icon: <ChatSparkle20Filled /> },
    ];

    const commonTabClassName = "mr-2";

    const handleClick = (path: string) => {
        if (path === "/chat") {
            navigate(path, {
                state: {
                    searchResultDocuments: searchResultDocuments,
                    selectedDocuments: selectedDocuments,
                    tokens: tokens,
                },
            });
            return;
        }
        navigate(path, {
            state: {
                selectedDocuments: selectedDocuments,
            },
        });
    };

    const openDocumentViewer = (document: Document) => {
        setIsDocToBeOpened(document);
        setIsDocViewerOpen(true);
    };

    const handleDocumentViewerClose = () => {
        setIsDocViewerOpen(false);
    };

    return (
        <>
            <div className={`flex justify-between ${className || ""}`}>
                <TabList
                    defaultSelectedValue={currentPath === "" || currentPath === "search" ? "search" : currentPath}
                    appearance="subtle"
                >
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.value}
                            value={tab.value}
                            icon={tab.icon}
                            className={commonTabClassName}
                            onClick={() => handleClick("/" + tab.value)}
                        >
                            {tab.label}
                        </Tab>
                    ))}
                </TabList>

                {selectedDocuments && selectedDocuments.length > 0 && (
                    <Button appearance="subtle">
                        {selectedDocuments && selectedDocuments.length > 0 && (
                            <Menu>
                                <MenuTrigger>
                                    <div>{t('components.header-menu.selected-documents')} {`(${selectedDocuments.length})`}</div>
                                </MenuTrigger>

                                <MenuPopover>
                                    <MenuList>
                                        {selectedDocuments.map((document) => (
                                            <MenuItem key={document.documentId}>
                                                <div className="flex items-center">
                                                    <span
                                                        onClick={() => {
                                                            openDocumentViewer(document);
                                                        }}
                                                    >
                                                        {document.fileName.substring(0, 35)}{" "}
                                                        {document.fileName.length > 35 ? "..." : ""}
                                                    </span>

                                                    <Button
                                                        icon={<Dismiss24Regular />}
                                                        iconPosition="after"
                                                        appearance="subtle"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateSelectedDocuments(document);
                                                        }}
                                                    />
                                                </div>
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </MenuPopover>
                            </Menu>
                        )}
                    </Button>
                )}

                {selectedDocuments && selectedDocuments.length > 0 && isDocViewerOpen && tokens && (
                    <DocDialog
                        metadata={isDocToBeOpened}
                        isOpen={isDocViewerOpen}
                        onClose={handleDocumentViewerClose}
                        allChunkTexts={[]} clearChatFlag={false}                    />
                )}
            </div>
        </>
    );
}
