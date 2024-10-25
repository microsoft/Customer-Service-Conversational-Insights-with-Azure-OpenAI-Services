import { CopilotChat, UserMessage, CopilotMessage } from "@fluentai/react-copilot-chat";
import { CopilotProvider, TextareaSubmitEvents, TextareaValueData } from "@fluentai/react-copilot";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../AppContext";
import { OptionsPanel } from "../chat/optionsPanel";
import { Document } from "../../api/apiTypes/documentResults";
import { Button } from "@fluentui/react-components";
import { ChatAdd24Regular } from "@fluentui/react-icons";
import { Textarea } from "@fluentai/textarea";
import { ChatApiResponse, ChatOptions, ChatRequest, History } from "../../api/apiTypes/chatTypes";
import { Completion } from "../../api/chatService";
import styles from "./sidecar.module.scss";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { renderToStaticMarkup } from "react-dom/server";
interface ISidecarCopilotProps {
    className?: string;
    searchResultDocuments: Document[];
    selectedDocuments: Document[];
    chatWithDocument: Document[];
}

export function SidecarCopilot({
    className,
    searchResultDocuments,
    selectedDocuments,
    chatWithDocument,
}: ISidecarCopilotProps) {
    const { t } = useTranslation();
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { conversationAnswers, setConversationAnswers } = useContext(AppContext);
    const [model, setModel] = useState<string>("chat_35");
    const [source, setSource] = useState<string>("rag");
    const [button, setButton] = useState<string>("");
    const [temperature, setTemperature] = useState<number>(0.8);
    const [maxTokens, setMaxTokens] = useState<number>(750);
    const [disableSources, setDisableSources] = useState<boolean>(false);
    const [selectedDocument, setSelectedDocument] = useState<Document[]>([]);

    useEffect(() => {
        setSelectedDocument(chatWithDocument);
    }, [chatWithDocument]);

    const [options, setOptions] = useState<ChatOptions>({
        model: model,
        source: source,
        temperature: temperature,
        maxTokens: maxTokens,
    });

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [textAreaValue, setTextAreaValue] = useState("");

    const makeApiRequest = async (question: string) => {
        setTextAreaValue("");
        setDisableSources(true);
        setIsLoading(true);

        const userTimestamp = new Date();
        const markdownToHtmlString = (markdown: string) => {
            return renderToStaticMarkup(<ReactMarkdown>{markdown}</ReactMarkdown>);
        };
        const markdown = `
        # Dog Breed Comparison: Fluffy Golden Dog vs. Beagle\n\n## Fluffy Golden Dog\n- **Appearance**: Small, light-colored with a fluffy golden coat. Notable features include large brown eyes and prominent ears, one perked and one flopped.\n- **Temperament**: Curious and attentive, suggesting a friendly and engaging personality. The dog's posture indicates comfort and familiarity with its environment.\n- **Collar**: Wears a blue and purple collar with a red identification tag, indicating it is a pet with a caring owner.\n- **Environment**: Typically found in cozy indoor settings, reflecting a strong bond with human companions.\n\n## Beagle\n- **Appearance**: Medium-sized dog with a short, smooth coat that can come in various colors, including tri-color (black, white, and brown). Beagles have long ears and a distinctively expressive face.\n- **Temperament**: Known for being friendly, curious, and energetic. Beagles are often social and enjoy being part of family activities.\n- **Collar**: Commonly wear collars for identification, but styles vary widely.\n- **Environment**: Adaptable to both indoor and outdoor settings, Beagles thrive in active households where they can explore and play.\n\n## Summary\nWhile the fluffy golden dog is characterized by its small size, fluffy coat, and cozy indoor demeanor, the Beagle is a medium-sized, energetic breed known for its short coat and love for outdoor activities. Both breeds exhibit friendly and curious temperaments, making them great companions, but they differ in size, coat type, and typical living environments.`;
        const htmlString = markdownToHtmlString(markdown);
            // return (
            //     <div>
            //         <ReactMarkdown>{markdown}</ReactMarkdown>
            //     </div>
            // );
        setConversationAnswers((prevAnswers) => [
            ...prevAnswers,
            [question, {
                answer: htmlString, suggestingQuestions: [],
                documentIds: [],
                keywords: []
            }],
        ]);

        let filterByDocumentIds: string[] = [];

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
                chatSessionId: "",
                DocumentIds: []
            };

            const response: ChatApiResponse = await Completion(request);

            setIsLoading(false);

            const answerTimestamp = new Date();

            try {
                if (!response || !response.answer) {
                    return;
                } else {
                    setConversationAnswers((prevAnswers) => {
                        const newAnswers = [...prevAnswers];
                        newAnswers[newAnswers.length - 1] = [question, response, userTimestamp, answerTimestamp];

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

    const handleModelChange = (model: string) => {
        setModel(model);
    };

    const handleSourceChange = (button: string, source: string) => {
        setSource(source);
        setButton(button);
    };

    function handleSend(ev: TextareaSubmitEvents, data: TextareaValueData) {
        makeApiRequest(data.value);
    }

    const clearChat = () => {
        setTextAreaValue("");
        setConversationAnswers((prevAnswers) => []);
    };

    return (
        <div className={className}>
            <div className="flex h-[83%] flex-col overflow-auto pb-5">
                <OptionsPanel
                    className="mx-10 my-10 flex flex-col items-center justify-center rounded-xl bg-neutral-500 bg-opacity-10 px-5 shadow-md outline outline-1 outline-transparent"
                    onModelChange={handleModelChange}
                    onSourceChange={handleSourceChange}
                    disabled={disableSources}
                    selectedDocuments={selectedDocuments}
                />

                <CopilotProvider>
                    <CopilotChat>
                        {conversationAnswers.map(([prompt, response], index) => (
                            <Fragment key={index}>
                                <UserMessage className="mx-auto my-3 ml-5 mr-5">
                                    <div dangerouslySetInnerHTML={{ __html: prompt.replace(/\n/g, "<br />") }} />
                                </UserMessage>
                                <CopilotMessage
                                    className="mx-auto ml-5 mr-5"
                                    progress={{ value: undefined }}
                                    isLoading={index === conversationAnswers.length - 1 && isLoading}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{ __html: response.answer.replace(/\n/g, "<br />") }}
                                    />
                                </CopilotMessage>
                            </Fragment>
                        ))}
                    </CopilotChat>
                </CopilotProvider>
            </div>

            <div className="mx-4 mb-5 mt-6 flex w-[85%] justify-between">
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
                    }}
                >
                    {t("components.chat.new-topic")}
                    
                </Button>

                <Textarea
                    ref={inputRef}
                    value={textAreaValue}
                    className="!ml-4 mt-auto max-h-48 w-full"
                    onChange={(_ev, newValue) => setTextAreaValue(newValue.value)}
                    showCount
                    aria-label="Chat input"
                    placeholder="Ask a question or request (ctrl + enter to submit)"
                    disabled={isLoading}
                    onSubmit={handleSend}
                    contentAfter={undefined}
                />
            </div>
        </div>
    );
}
