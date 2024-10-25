import {
    Button,
    Dialog,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Field,
    Radio,
    RadioGroup,
    Textarea,
    Text,
    Checkbox
} from "@fluentui/react-components";
import { AddCircle24Regular, Dismiss24Regular, SubtractCircle24Regular } from "@fluentui/react-icons";
import { useState } from "react";
import { ChatMessage, History, Reference } from "../../api/apiTypes/chatTypes";
import { ChatOptions } from "../../api/apiTypes/chatTypes";
import { PostFeedback } from "../../api/chatService";
import { useTranslation } from "react-i18next";

interface FeedbackFormProps {
    history: History;
    chatOptions: ChatOptions;
    sources: Reference[];
    filterByDocumentIds: string[];
    isOpen: boolean;
    onClose: () => void;
    setSubmittedFeedback: (submitted: boolean) => void;
}

export function FeedbackForm({
    isOpen,
    history,
    chatOptions,
    sources,
    filterByDocumentIds,
    onClose,
    setSubmittedFeedback,
}: FeedbackFormProps) {
    const { t } = useTranslation();
    
    const [isPositive, setIsPositive] = useState<boolean | undefined>(false);
    const [reason, setReason] = useState<string | undefined>("");
    const [comment, setComment] = useState<string | undefined>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<boolean>(false);
    const [errorSubmitting, setErrorSubmitting] = useState<boolean>(false);
    const [groundTruthAnswer, setGroundTruthAnswer] = useState<string>("");
    const [documentURLFields, setDocumentURLFields] = useState<number>(1);
    const [documentURLs, setDocumentURLs] = useState<string[]>([]);
    const [chunkTexts, setChunkTexts] = useState<string[]>([]);
    const [chunktextFields, setChunkTextFields] = useState<number>(1);
    // const [rating, setRating] = useState<number>(2.5);

    const handleFormClose = () => {
        setSubmittedFeedback(false);
        onClose();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (reason === "") {
            setValidationError(true);
        } else {
            await SubmitFeedback();
            onClose();
        }
    };

    const SubmitFeedback = async () => {
        setIsSubmitting(true);

        const request = {
            isPositive: isPositive,
            reason: reason,
            comment: comment,
            history: history,
            options: chatOptions,

            sources: sources.map((ref) => ({ ...ref })),
            filterByDocumentIds: filterByDocumentIds,
            groundTruthAnswer: groundTruthAnswer,
            documentURLs: documentURLs,
            chunkTexts: chunkTexts,
        };

        try {
            const response = await PostFeedback(request);

            if (response) {
                setIsSubmitting(false);
                if (!isPositive) {
                    setSubmittedFeedback(true);
                }
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error("An error occurred while submitting the feedback:", error);
            setErrorSubmitting(true);
        }
    };

    const addAdditionalChunkTextField = () => {
        setChunkTextFields(chunktextFields + 1);
        setChunkTexts((prevChunkTexts) => [...prevChunkTexts, ""]);
    };

    const removeAdditionalChunkTextField = () => {

        if (chunktextFields > 1) {
            setChunkTextFields(chunktextFields - 1);

            setChunkTexts((prevChunkTexts) => {
                const updatedChunkTexts = [...prevChunkTexts];
                updatedChunkTexts.pop();
                return updatedChunkTexts;
            });
        }
    };

    const addChunkTexts = (chunkText: string, index: number) => {

        if (chunkText !== undefined) {
            let updatedChunkTexts = [...chunkTexts];
            updatedChunkTexts[index] = chunkText;
            setChunkTexts(updatedChunkTexts);
        }
    };

    const addAdditionalDocumentURLField = () => {
        setDocumentURLFields(documentURLFields + 1);
        setDocumentURLs((prevDocumentURLs) => [...prevDocumentURLs, ""]);
    };

    const removeAdditionalDocumentURLField = () => {
        if (documentURLFields > 1) {
            setDocumentURLFields(documentURLFields - 1);

            setDocumentURLs((prevDocumentURLs) => {
                const updatedDocumentURLs = [...prevDocumentURLs];
                updatedDocumentURLs.pop();
                return updatedDocumentURLs;
            });
        }
    };

    return (
        <Dialog open={isOpen}>
            <DialogSurface className="">
                <DialogBody className="h-full w-full">
                    <DialogTitle
                        action={
                            <DialogTrigger action="close">
                                <Button
                                    appearance="subtle"
                                    aria-label="Close"
                                    icon={<Dismiss24Regular />}
                                    onClick={handleFormClose}
                                />
                            </DialogTrigger>
                        }
                    >
                        {t('components.feedback-form.title')}
                    </DialogTitle>

                    <form onSubmit={handleSubmit}>
                        {validationError && (
                            <div className="mb-4 mt-4">
                                <Text style={{ color: "red" }}>
                                {t('components.feedback-form.required-fields')}
                                </Text>
                            </div>
                        )}
                        {errorSubmitting && (
                            <div className="mb-4 mt-4">
                                <Text style={{ color: "red" }}>
                                {t('components.feedback-form.feedback-error')}
                                </Text>
                            </div>
                        )}
                        <DialogContent className="">
                            {/* <Field label="Rate your experience" required>
                                <Rating step={0.5} onChange={(_, data) => setRating(data.value)} />
                            </Field> */}

                            <div className="mt-4" />

                            <Field label={t('components.feedback-form.justification-title')} required>
                                <RadioGroup
                                    layout="horizontal"
                                    onChange={(e) => setReason((e.target as HTMLInputElement).value)}
                                >
                                    <Radio label="Search Result" value="Search Result" />
                                    <Radio label="Answer" value="Answer" />
                                    <Radio label="Both" value="Both" />
                                    <Radio label="Other" value="Other" />
                                </RadioGroup>
                            </Field>

                            <div className="mt-4" />

                            <Field label={t('components.feedback-form.why-not')}>
                                <Textarea
                                    placeholder={t('components.feedback-form.leave-comment')}
                                    resize="vertical"
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </Field>

                            <div className="mt-2">
                                <Checkbox
                                    label={t('components.feedback-form.advanced-feedback-title')}
                                    onChange={(e) => setIsPositive(e.target.checked)}
                                ></Checkbox>
                            </div>

                            {isPositive && (
                                <div className="mt-2">
                                    <Field label={t('components.feedback-form.ground-truth-title')} required>
                                        <Textarea
                                            placeholder={t('components.feedback-form.ground-truth-placeholder')}
                                            resize="vertical"
                                            onChange={(e) => setGroundTruthAnswer(e.target.value)}
                                        />
                                    </Field>

                                    <div className="mt-2" />

                                    <Field label={t('components.feedback-form.doc-urls')}>
                                        {documentURLFields > 0 &&
                                            Array.from({ length: documentURLFields }, (_, i) => i).map((index) => (
                                                <Textarea
                                                    key={index}
                                                    style={{ marginTop: "10px" }}
                                                    placeholder={t('components.feedback-form.text-area-placeholder')}
                                                    resize="vertical"
                                                    onChange={(e) => {
                                                        const updatedDocumentURLs = [...documentURLs];
                                                        updatedDocumentURLs[index] = e.target.value;
                                                        setDocumentURLs(updatedDocumentURLs);
                                                    }}
                                                />
                                            ))}
                                    </Field>

                                    <div className="mt-2">
                                        <Button
                                            appearance="transparent"
                                            shape="circular"
                                            size="small"
                                            onClick={addAdditionalDocumentURLField}
                                            style={{ marginRight: "-25px", marginLeft: "-20px" }}
                                        >
                                            <AddCircle24Regular />
                                        </Button>
                                        {documentURLFields > 1 && (
                                            <Button
                                                appearance="transparent"
                                                shape="circular"
                                                size="small"
                                                onClick={removeAdditionalDocumentURLField}
                                            >
                                                <SubtractCircle24Regular />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="mt-2" />

                                    <Field label={t('components.feedback-form.chunk-texts-title')}>
                                        {chunktextFields > 0 &&
                                            Array.from({ length: chunktextFields }, (_, i) => i).map((index) => (
                                                <Textarea
                                                    key={index}
                                                    style={{ marginTop: "10px" }}
                                                    placeholder={t('components.feedback-form.chunk-texts-placeholder')}
                                                    resize="vertical"
                                                    onChange={(e) => addChunkTexts(e.target.value, index)}
                                                />
                                            ))}
                                    </Field>

                                    <div className="mt-2">
                                        <Button
                                            appearance="transparent"
                                            shape="circular"
                                            size="small"
                                            onClick={addAdditionalChunkTextField}
                                            style={{ marginRight: "-25px", marginLeft: "-20px" }}
                                        >
                                            <AddCircle24Regular />
                                        </Button>
                                        {chunktextFields > 1 && (
                                            <Button
                                                appearance="transparent"
                                                shape="circular"
                                                size="small"
                                                onClick={removeAdditionalChunkTextField}
                                            >
                                                <SubtractCircle24Regular />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </form>
                </DialogBody>

                <div className="mt-8 flex justify-end">
                    <Button appearance="primary" onClick={handleSubmit}>
                        {isSubmitting && !errorSubmitting ? t('components.feedback-form.submitting') : t('components.feedback-form.submit')}
                    </Button>
                </div>
            </DialogSurface>
        </Dialog>
    );
}
