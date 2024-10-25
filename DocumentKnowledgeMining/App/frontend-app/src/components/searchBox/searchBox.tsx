import React, { forwardRef, useImperativeHandle, ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { Input } from "@fluentui/react-input";
import { useTranslation } from "react-i18next";
import { Button, InputOnChangeData, Tooltip, useId } from "@fluentui/react-components";
import { useDebouncedCallback } from "use-debounce";
import {
    Keyboard24Regular,
    Mic24Regular,
    SearchVisual24Regular,
    Search24Regular,
    ArrowUpload24Filled,
} from "@fluentui/react-icons";
import "./searchInput.scss";
import { UploadMultipleFiles } from "../../api/storageService";

export interface SearchBoxHandle {
    setValue(decodedQuery: string): unknown;
    reset: () => void; // Expose the reset method
}

interface SearchBoxProps {
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
    initialValue?: string;
    placeholder?: string;
    onSearchChanged: (searchValue: string) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;  // Include onKeyDown as a prop
}

const MicButton = () => {
    return <Button className="mic_button" icon={<Mic24Regular />} appearance="subtle" />;
};

const KeyBoardButton = () => {
    return <Button className="keyboard_button" icon={<Keyboard24Regular />} appearance="subtle" />;
};

const SearchVisualButton = () => {
    return <Button className="searchVisual_button" icon={<SearchVisual24Regular />} appearance="subtle" />;
};

const UploadButton = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadDocuments = async () => {
        if (fileInputRef.current?.files?.length) {
            const files = Array.from(fileInputRef.current.files);
            const formData = new FormData();

            files.forEach((file, index) => {
                formData.append(`file[${index}]`, file);
            });

            try {
                const response = await UploadMultipleFiles(files);

                if (!response) {
                    throw new Error("Error uploading files");
                }

                alert("Files uploaded successfully");
            } catch (error) {
                console.error("Error:", error);
                alert("Error uploading files");
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            {/* <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={uploadDocuments} multiple />
            <Button
                className="upload_button"
                icon={<ArrowUpload24Filled />}
                appearance="subtle"
                onClick={handleClick}
            /> */}
        </>
    );
};

export const SearchBox = forwardRef<SearchBoxHandle, SearchBoxProps>((
    { className, labelClassName, inputClassName, initialValue = "", placeholder, onSearchChanged, onKeyDown },
    ref
) => {
    const { t } = useTranslation();
    const [value, setValue] = useState(initialValue);
    const inputId = useId("input");
    
    useImperativeHandle(ref, () => ({
        setValue: (value: string) => {
            setValue(value);
            onSearchChanged(value);
        },
        reset: () => {
            setValue("");
            onSearchChanged("");
        },
    }));

    const debounced = useDebouncedCallback(
        (value) => {
            onSearchChanged(value);
        },
        1000
    );

    function onChange(_ev: ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void {
        if (data.value.length <= 300) {
            setValue(data.value);
            debounced(data.value);
        }
    }

    function handleKeyDown(ev: KeyboardEvent<HTMLInputElement>) {
        if (onKeyDown) {
            onKeyDown(ev);  // Call the parent-provided onKeyDown function if it exists
        }

        if (ev.key === "Enter") {
            debounced.cancel();
            setValue((ev.target as HTMLInputElement).value);
            onSearchChanged((ev.target as HTMLInputElement).value);
        }
    }

    return (
        <div className="search_box">
            {/* <label className={labelClassName || ""} htmlFor={inputId}>
                {t("components.search-box.label")}
            </label> */}
            <Tooltip content="Type your search Keyword." relationship="label" withArrow>
                <Input
                    className={`input_wrapper`}
                    contentBefore={<Search24Regular />}
                    contentAfter={
                        <div className="flex">
                            {/* <KeyBoardButton />
                            <MicButton />
                            <SearchVisualButton /> */}
                            <UploadButton />
                        </div>
                    }
                    size="large"
                    placeholder={placeholder || t("components.search-box.placeholder")}
                    id={inputId}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}  // Use the handleKeyDown function
                    value={value}
                    type="search"
                />
            </Tooltip>
        </div>
    );
});

SearchBox.displayName = "SearchBox";
