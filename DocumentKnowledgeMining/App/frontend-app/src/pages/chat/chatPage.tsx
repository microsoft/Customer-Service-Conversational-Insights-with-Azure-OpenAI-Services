import { Header } from "../../components/header/header";
import { HeaderBar, NavLocation } from "../../components/headerBar/headerBar";
import { HeaderMenuTabs } from "../../components/headerMenu/HeaderMenuTabs";
import { ChatRoom } from "../../components/chat/chatRoom";
import { Document } from "../../api/apiTypes/documentResults";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export function ChatPage() {
    const location = useLocation();

    const searchResultDocuments = location.state ? location.state.searchResultDocuments : [];
    const selectedDocumentsFromHomePage = location.state ? location.state.selectedDocuments : [];
    const inheritedTokens = location.state ? location.state.tokens : null;
    const chatWithSingleSelectedDocument: Document[] = location.state ? location.state.chatWithSingleSelectedDocument : [];

    const [selectedDocuments, setSelectedDocuments] = useState<Document[]>(selectedDocumentsFromHomePage);

    const updateSelectedDocuments = (document: Document) => {
        setSelectedDocuments((prevDocuments) => {
            const isAlreadySelected = prevDocuments.some(
                (prevDocument) => prevDocument.documentId === document.documentId
            );

            if (isAlreadySelected) {
                return prevDocuments.filter((prevDocument) => prevDocument.documentId !== document.documentId);
            } else {
                return [...prevDocuments, document];
            }
        });
    };

    return (
        <div className="flex w-full flex-1 flex-col bg-neutral-100">
            <Header className="flex flex-col justify-between bg-contain bg-right-bottom bg-no-repeat" size="small">
                <div className="-ml-8">
                    <HeaderBar location={NavLocation.Home} />
                </div>
            </Header>
            <main className="grid flex-1 grid-cols-5 gap-x-2 gap-y-8">
                <div className="col-span-3 col-start-2 flex flex-1 flex-col md:col-span-3 md:col-start-2">
                    <HeaderMenuTabs
                        className=""
                        searchResultDocuments={searchResultDocuments}
                        selectedDocuments={selectedDocuments}
                        tokens={inheritedTokens}
                        updateSelectedDocuments={updateSelectedDocuments}
                    />
                    <div className="absolute left-0 right-0 mt-11 w-full border-b border-b-neutral-300"></div>
                    <ChatRoom
                        searchResultDocuments={searchResultDocuments}
                        selectedDocuments={selectedDocuments}
                        chatWithDocument={chatWithSingleSelectedDocument ? chatWithSingleSelectedDocument : []} clearChatFlag={false}                    />
                </div>
            </main>
        </div>
    );
}
