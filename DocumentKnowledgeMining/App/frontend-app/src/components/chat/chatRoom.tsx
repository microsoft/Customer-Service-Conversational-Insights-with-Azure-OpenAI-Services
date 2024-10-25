import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { ChatApiResponse, ChatOptions, ChatRequest, History, Reference } from "../../api/apiTypes/chatTypes";
import { OptionsPanel } from "./optionsPanel";
import {
    Button,
    Dialog,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    Tag,
    Tooltip,
    makeStyles,
} from "@fluentui/react-components";
import { DocDialog } from "../documentViewer/documentViewer";
import { Textarea } from "@fluentai/textarea";
import type { TextareaSubmitEvents, TextareaValueData } from "@fluentai/textarea";
import { CopilotChat, UserMessage, CopilotMessage } from "@fluentai/react-copilot-chat";
import { ChatAdd24Regular, DocumentOnePageLink20Regular } from "@fluentui/react-icons";
import { AttachmentTag } from "@fluentai/attachments";
import styles from "./chatRoom.module.scss";
import { CopilotProvider, FeedbackButtons, Suggestion } from "@fluentai/react-copilot";
import { Result, SingleDocument, Tokens } from "../../api/apiTypes/singleDocument";
//import { getDocument } from "../../api/documentsService";
import { Completion, PostFeedback } from "../../api/chatService";
import { FeedbackForm } from "./FeedbackForm";
import { Document } from "../../api/apiTypes/documentResults";
import { AppContext } from "../../AppContext";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { renderToStaticMarkup } from "react-dom/server";
import { marked } from 'marked';
const DefaultChatModel = "chat_4o";

const useStyles = makeStyles({
    tooltipContent: {
        maxWidth: "500px",
    },
});

interface ChatRoomProps {
    searchResultDocuments: Document[];
    disableOptionsPanel?: boolean;
    selectedDocuments: Document[];
    chatWithDocument: Document[];
    clearChatFlag: boolean;

}

export function ChatRoom({ searchResultDocuments, selectedDocuments, chatWithDocument, disableOptionsPanel, clearChatFlag }: ChatRoomProps) {
    const customStyles = useStyles();
    const { t } = useTranslation();
    const [chatSessionId, setChatSessionId] = useState<string | null>(null); 
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [disableSources, setDisableSources] = useState<boolean>(false);
    const [error, setError] = useState<unknown>();
    const [model, setModel] = useState<string>("chat_35");
    const [source, setSource] = useState<string>("rag");
    const [temperature, setTemperature] = useState<number>(0.8);
    const [maxTokens, setMaxTokens] = useState<number>(750);
    const [selectedDocument, setSelectedDocument] = useState<Document[]>(chatWithDocument);
    const [button, setButton] = useState<string>("");
    const [dialogMetadata, setDialogMetadata] = useState<Document | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [tokens, setTokens] = useState<Tokens | null>(null);
    const [open, setOpen] = useState(false);
    const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState<boolean>(false);
    const [options, setOptions] = useState<ChatOptions>({
        model: model,
        source: source,
        temperature: temperature,
        maxTokens: maxTokens,
    });
    const [referencesForFeedbackForm, setReferencesForFeedbackForm] = useState<Reference[]>([]);
    const [textAreaValue, setTextAreaValue] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [allChunkTexts, setAllChunkTexts] = useState<string[]>([]);

    const { conversationAnswers, setConversationAnswers } = useContext(AppContext);
    const [isSticky, setIsSticky] = useState(false);
    const optionsBottom = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setOptions({
            model: model,
            source: source,
            temperature: temperature,
            maxTokens: maxTokens,
        });
    }, [model, source, temperature, maxTokens]);

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }, []);

    useEffect(() => {
        handleModelChange(DefaultChatModel)
    }, []);
    
        // Effect to clear chat when clearChat prop changes
    useEffect(() => {
        if (clearChatFlag) {
            clearChat();
        }
    }, [clearChatFlag]); // Runs whenever clearChat changes


    
    const chatContainerRef = useRef<HTMLDivElement>(null);
    function scrollToBottom() {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }

    useEffect(scrollToBottom, [conversationAnswers]);

    function removeNewlines(text: string) {
        return text.replace(/\\n/g, '\n');
    }

    const makeApiRequest = async (question: string) => {
        setTextAreaValue("");
        setDisableSources(true);
        setIsLoading(true);
        
        // A simple function to check if the text contains Markdown
        const isMarkdown = (text: string) => {
            const markdownPattern = /(^|\s)(#{1,6}|\*\*|__|[-*]|\d+\.\s|\[.*\]\(.*\)|```|`[^`]*`)/;
            return markdownPattern.test(text);
        };        

        const userTimestamp = new Date();
        // Ensure we have a chatSessionId or create one if null/undefined
        
        
        let currentSessionId = chatSessionId; // Get the current value of chatSessionId
        if (!currentSessionId) {
            const newSessionId = uuidv4(); // Generate a new UUID if no session exists
            setChatSessionId(newSessionId); // Save it for future renders
            currentSessionId = newSessionId; // Immediately use the new session ID in this function
            
        }
        const markdownToHtmlString = (markdown: string) => {
            return renderToStaticMarkup(<ReactMarkdown>{markdown}</ReactMarkdown>);
        };
        const markdown = `| Data Point | Value | Document Name | Page Number |
|----------------|-----------|-------------------|------------------|
| Households with accessibility needs | 23.1 million | Accessibility in Housing Report | Page 1 |
| Households with mobility-related disabilities | 19% of U.S. households | Accessibility in Housing Report | Page 1 |
| Households without entry-level bedroom or full bathroom planning to add features | 1% | Accessibility in Housing Report | Page 3 |
| Households planning to make homes more accessible | 5% | Accessibility in Housing Report | Page 3 |
| Households with someone using mobility devices | 13% | Accessibility in Housing Report | Page 1 |
| Households with serious difficulty hearing | 12% | Accessibility in Housing Report | Page 24 |
| Households with serious difficulty seeing | 12% | Accessibility in Housing Report | Page 24 |
| Households with difficulty walking or climbing stairs | 12% | Accessibility in Housing Report | Page 24 |
| Households with difficulty dressing or bathing | 12% | Accessibility in Housing Report | Page 24 |
| Households with difficulty doing errands alone | 12% | Accessibility in Housing Report | Page 24 |
| Households with full bathrooms on entry level | 58% | Accessibility in Housing Report | Page 11 |
| Households with bedrooms on entry level | 46% | Accessibility in Housing Report | Page 11 |
| Total single-family loans acquired by Fannie Mae in 2021 | $2.6 trillion | Annual Housing Report 2022 | Page 36 |
| Total single-family loans acquired by Freddie Mac in 2021 | $2.6 trillion | Annual Housing Report 2022 | Page 36 |
| Percentage of loans with LTV > 95% | 13.5% | Annual Housing Report 2022 | Page 44 |
| Percentage of loans with LTV <= 60% | 15.6% | Annual Housing Report 2022 | Page 44 |
| Total NPLs sold by Enterprises through December 2023 | 168,364 | FHFA Non-Performing Loan Sales Report | Page 2 |
| Average delinquency of NPLs sold | 2.8 years | FHFA Non-Performing Loan Sales Report | Page 2 |
| Average current mark-to-market LTV ratio of NPLs | 83% | FHFA Non-Performing Loan Sales Report | Page 2 |`;
        
        const htmlString = await marked.parse(markdown);
        const htmlString2 = markdownToHtmlString(markdown);

        setConversationAnswers((prevAnswers) => [
            ...prevAnswers,
            [question, {
                answer: t('components.chat.fetching-answer'), suggestingQuestions: [],
                documentIds: [],
                keywords: []
            }],
        ]);

        
        


        let filterByDocumentIds: string[] = [];
        
        
        const transformDocuments = (documents: any[]) => {
            return documents.map(doc => doc.documentId); // Extracting documentId from each document
        };
        const formattedDocuments = transformDocuments(selectedDocuments);
        

        if (button === "Selected Document" && selectedDocument) {
            filterByDocumentIds = [selectedDocument[0].documentId];
        } else if (button === "Search Results") {
            filterByDocumentIds = searchResultDocuments.map((document) => document.documentId);
        } else if (button === "Selected Documents") {
            filterByDocumentIds = selectedDocuments.map((document) => document.documentId);
        }

        try {
            
            
            
            const request: ChatRequest = {
                Question: question,
                chatSessionId: currentSessionId,
                DocumentIds: button === "All Documents" ? [] : formattedDocuments 
                // cha: history,
                // options: {
                //     model: model,
                //     source: source,
                //     temperature: temperature,
                //     maxTokens: maxTokens,
                // },
                // filterByDocumentIds: filterByDocumentIds,
            };
            
            
            const response: ChatApiResponse = await Completion(request);
            
            

            setIsLoading(false);

            const answerTimestamp = new Date();

            try {
                if (response && response.answer) {
                
                    const formattedAnswer = removeNewlines(response.answer)
                    const chatResp = await marked.parse(formattedAnswer) // Convert to HTML if Markdown detected
                    
                    
                    
                    
                    // Update the conversation with the formatted answer
                    setConversationAnswers((prevAnswers) => {
                        const newAnswers = [...prevAnswers];
                        newAnswers[newAnswers.length - 1] = [question, { ...response, answer: chatResp }, userTimestamp, answerTimestamp];
                        return newAnswers;
                    });
                }
            } catch (error) {
                console.error("Error parsing response body:", error);
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    const history: History = conversationAnswers
        .map(([prompt, response, userTimestamp, answerTimestamp]) => {
            if (response) {
                return [
                    { role: "user", content: prompt, datetime: userTimestamp },
                    { role: "assistant", content: response.answer, datetime: answerTimestamp },
                ];
            } else {
                return [];
            }
        })
        .flat();

    const clearChat = () => {
        setTextAreaValue("");
        setConversationAnswers((prevAnswers) => []);
        setChatSessionId(null);
    };

    const handleModelChange = (model: string) => {        
        setModel(model);
    };

    const handleSourceChange = (button: string, source: string) => {
        setSource(source);
        setButton(button);
    };

    const handleFollowUpQuestion = async (question: string) => {
        await makeApiRequest(question);
    };

    function handleSend(ev: TextareaSubmitEvents, data: TextareaValueData) {
        makeApiRequest(data.value);
    }

    // const handleOpenReference = async (referenceId: string, chunkTexts: string[]) => {
    //     try {
    //         const response: SingleDocument = await getDocument(referenceId);

    //         if (response && response.result) {
    //             setTokens(response.tokens);
    //             setIsDialogOpen(true);
    //             setDialogMetadata(response.result);
    //             setAllChunkTexts(chunkTexts);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data: ", error);
    //     }
    // };

    const handleOpenFeedbackForm = (sources: Reference[]) => {
        setReferencesForFeedbackForm(sources);
        setIsFeedbackFormOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleFeedbackFormClose = () => {
        setIsFeedbackFormOpen(false);
    };

    const handlePositiveFeedback = async (sources: Reference[]) => {
        setIsLoading(true);

        const request = {
            isPositive: true,
            reason: "Correct answer",
            comment: "",
            history: history,
            options: options,
            sources: sources.map((ref) => ({ ...ref })),
            filterByDocumentIds:
                button === "Selected Documents"
                    ? selectedDocuments.map((document) => document.documentId)
                    : button === "Search Results"
                    ? searchResultDocuments.map((document) => document.documentId)
                    : button === "Selected Document"
                    ? [selectedDocument[0]?.documentId || ""]
                    : [],
            groundTruthAnswer: "",
            documentURLs: [],
            chunkTexts: [],
        };

        try {
            const response = await PostFeedback(request);

            if (response) {
                setIsLoading(false);
                setOpen(true);
            }
        } catch (error) {
            setIsLoading(false);
            console.error("An error occurred while submitting the feedback:", error);
        }
    };

    const handleSubmittedFeedback = (submitted: boolean) => {
        if (submitted) {
            setIsFeedbackFormOpen(false);
            setIsLoading(false);
            setOpen(true);
        } else {
            setIsFeedbackFormOpen(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const optionBottomElement = optionsBottom.current;
        const chatContainer = chatContainerRef.current;
        const handleScroll = () => {
            if (!chatContainer || !optionBottomElement) {
                return;
            }
            const containerTop = chatContainer.getBoundingClientRect().top;
            const bottomOffset = 50
            const OptionsBottomElementTop = optionBottomElement.getBoundingClientRect().top - bottomOffset;
            if (OptionsBottomElementTop < containerTop) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };
        if (chatContainer) {
            chatContainer.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (chatContainer) {
                chatContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    return (
        <div className="mx-2 flex w-full flex-1 flex-col items-center grey-background">
            {isDialogOpen && (
                <DocDialog
                    metadata={dialogMetadata as Document}
                    isOpen={isDialogOpen}
                    onClose={handleDialogClose}
                    allChunkTexts={allChunkTexts} clearChatFlag={false}                />
            )}
            <div ref={chatContainerRef} className={`no-scrollbar flex w-full flex-1 flex-col overflow-auto ${styles["chat-container"]}`}>
            {!disableOptionsPanel && (
                <OptionsPanel
                    // className="px-10 mx-auto my-10 flex flex-col items-center justify-center rounded-xl bg-neutral-500 bg-opacity-10 shadow-md outline outline-1 outline-transparent" 
                    className={`px-10 mx-auto my-10 flex flex-col items-center justify-center rounded-xl bg-neutral-500 bg-opacity-10 shadow-md outline outline-1 outline-transparent`}
                    onModelChange={handleModelChange}
                    onSourceChange={handleSourceChange}
                    disabled={disableSources}
                    selectedDocuments={selectedDocuments}
                    isSticky={isSticky}
                />
            )}
            <div ref={optionsBottom}></div>
                <CopilotProvider className={styles.chatMessagesContainer}>
                    <CopilotChat>
                        {conversationAnswers.map(([prompt, response], index) => (
                            <Fragment key={index}>
                                <UserMessage className="my-3 ml-auto" /* key={`${index}-user`} */>
                                    <div dangerouslySetInnerHTML={{ __html: prompt.replace(/\n/g, "<br />") }} />
                                </UserMessage>
                                <CopilotMessage
                                    className="mr-auto"
                                    progress={{ value: undefined }}
                                    // key={`${index}-chat`}
                                    isLoading={index === conversationAnswers.length - 1 && isLoading}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{ __html: response.answer }}
                                    />
                                    {/* <div className={`mr-2 mt-2 ${styles["attachment-tag-container"]}`}>
                                        {response.sources?.map((reference, index) => {
                                            if (reference) {
                                                return (
                                                    <div>
                                                        <Tooltip
                                                            content={{
                                                                children: reference.chunk_text
                                                                    ? reference.chunk_text
                                                                    : t("components.chat.no-information"),
                                                                className: customStyles.tooltipContent,
                                                            }}
                                                            relationship="description"
                                                            positioning="below"
                                                            withArrow
                                                        >
                                                            <div>
                                                                <AttachmentTag
                                                                    key={index}
                                                                    className={`mr-2 mt-2 ${styles["attachment-tag"]}`}
                                                                    onClick={() =>
                                                                        handleOpenReference(
                                                                            reference.parent_id,
                                                                            response.sources?.map(
                                                                                (ref) => ref.chunk_text
                                                                            ) || []
                                                                        )
                                                                    }
                                                                    media={<DocumentOnePageLink20Regular />}
                                                                >
                                                                    {reference.title}
                                                                </AttachmentTag>
                                                            </div>
                                                        </Tooltip>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div> */}
                                    {response.suggestingQuestions?.filter((o) => o).length > 0 && (
                                        <div>
                                            <p className="mt-6">{t("components.chat.suggested-q-title")}</p>
                                            {response.suggestingQuestions.map((followUp, index) => (
                                                <Suggestion
                                                    key={index}
                                                    className="!mr-2 !mt-2 !text-base"
                                                    onClick={() => handleFollowUpQuestion(followUp)}
                                                >
                                                    {followUp}
                                                </Suggestion>
                                            ))}
                                        </div>
                                    )}

                                    {!isLoading && (
                                        <div className="mt-6">
                                            {/* <FeedbackButtons
                                                positiveFeedbackButton={{
                                                    onClick: () =>
                                                        handlePositiveFeedback(
                                                            response.sources ? response.sources : []
                                                        ),
                                                }}
                                                negativeFeedbackButton={{
                                                    onClick: () =>
                                                        handleOpenFeedbackForm(
                                                            response.sources ? response.sources : []
                                                        ),
                                                }}
                                                style={{ display: "flex", flexDirection: "row-reverse" }}
                                            /> */}

                                                        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                                                        {/* <Tag size="extra-small">
                                                            {t("components.dialog-content.ai-generated-tag-incorrect")}
                                                        </Tag> */}
                                                        <Tag 
                                                            size="extra-small" 
                                                            className="!bg-transparent !text-gray-500 !border-none !p-0 !flex !flex-row-reverse"
                                                            >
                                                            {t("components.dialog-content.ai-generated-tag-incorrect")}
                                                        </Tag>
                                                        </div>
                                        </div>
                                    )}

                                    {isFeedbackFormOpen && (
                                        <FeedbackForm
                                            isOpen={isFeedbackFormOpen}
                                            onClose={handleFeedbackFormClose}
                                            history={history}
                                            chatOptions={options}
                                            sources={referencesForFeedbackForm}
                                            filterByDocumentIds={
                                                button === "Selected Document"
                                                    ? selectedDocument.map((document) => document.documentId)
                                                    : button === "Search Results"
                                                    ? searchResultDocuments.map((document) => document.documentId)
                                                    : button === "Selected Documents"
                                                    ? selectedDocuments.map((document) => document.documentId)
                                                    : []
                                            }
                                            setSubmittedFeedback={handleSubmittedFeedback}
                                        />
                                    )}

                                    <Dialog open={open} onOpenChange={(event, data) => setOpen(data.open)}>
                                        <DialogSurface>
                                            <DialogBody>
                                                <DialogTitle>{t('components.feedback-form.feedback-thank-you')}</DialogTitle>
                                                <DialogContent>
                                                {t('components.feedback-form.feedback-info')}
                                                </DialogContent>
                                            </DialogBody>
                                        </DialogSurface>
                                    </Dialog>
                                </CopilotMessage>
                            </Fragment>
                        ))}
                    </CopilotChat>
                </CopilotProvider>
            </div>

            <div className={`${styles.questionContainer} mb-6 mt-6 flex w-full justify-center`}>
                <Button
                    className={styles["new-topic"]}
                    shape="circular"
                    appearance="primary"
                    icon={<ChatAdd24Regular />}
                    onClick={() => {
                        clearChat();
                        setDisableSources(false);
                        setSelectedDocument([]);
                        setIsLoading(false);
                        setChatSessionId(null);
                    }}
                >
                    {t('components.chat.new-topic')}
                </Button>

                <Textarea
                    ref={inputRef}
                    value={textAreaValue}
                    className="!ml-4 max-h-48 w-full !max-w-none"
                    onChange={(_ev, newValue) => setTextAreaValue(newValue.value)}
                    showCount
                    aria-label="Chat input"
                    placeholder={t('components.chat.input-placeholder')}
                    disabled={isLoading}
                    onSubmit={handleSend}
                    contentAfter={undefined}
                />
            </div>
        </div>
    );
}
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

