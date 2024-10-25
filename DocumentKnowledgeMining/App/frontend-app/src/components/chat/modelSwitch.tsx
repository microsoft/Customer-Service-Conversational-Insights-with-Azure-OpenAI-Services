import { useState } from "react";
import { Text, Tooltip } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

interface ModelSwitchProps {
    onSwitchChange: (model: string) => void;
}

export function ModelSwitch({ onSwitchChange }: ModelSwitchProps) {
    const { t } = useTranslation();
    const GPT35 = "chat_35";
    const GPT4 = "chat_4";
    const GPT4O = "chat_4o";

    const [activeSwitch, setActiveSwitch] = useState(GPT4O);

    const handleClick = (model: string) => {
        setActiveSwitch(model);
        onSwitchChange(model);
    };

    return (
        <div className="flex h-[70px] w-[210px] items-center justify-center rounded-lg ">
            {/* <div className="align-center flex h-[50px] w-[240px] items-center justify-center rounded-full bg-neutral-300 shadow-md">
                <Tooltip content={t('components.model-switch.gpt35')} relationship="description" positioning="above-end">
                    <div
                        onClick={() => handleClick(GPT35)}
                        className={`flex h-[50px] w-[70px] items-center justify-center rounded-full border border-neutral-300 ${
                            activeSwitch === GPT35 ? "bg-neutral-50 shadow-lg" : "bg-neutral-300"
                        }`}
                    >
                        <Text
                            className={`${activeSwitch === GPT35 ? "font-bold" : ""}`}
                            weight={activeSwitch === GPT35 ? "bold" : "regular"}
                        >
                            GPT3.5
                        </Text>
                    </div>
                </Tooltip>
                <Tooltip
                    content={t('components.model-switch.gpt4')}
                    relationship="description"
                    positioning="above-start"
                >
                    <div
                        onClick={() => handleClick(GPT4)}
                        className={`flex h-[50px] w-[70px] items-center justify-center rounded-full border border-neutral-300 ${
                            activeSwitch === GPT4 ? "bg-neutral-50 shadow-lg" : "bg-neutral-300"
                        }`}
                    >
                        <Text
                            className={`${activeSwitch === GPT4 ? "font-bold" : ""}`}
                            weight={activeSwitch === GPT4 ? "bold" : "regular"}
                        >
                            GPT4
                        </Text>
                    </div>
                </Tooltip>
                <Tooltip
                    content={t('components.model-switch.gpt4-0')}
                    relationship="description"
                    positioning="above-start"
                >
                    <div
                        onClick={() => handleClick(GPT4O)}
                        className={`flex h-[50px] w-[70px] items-center justify-center rounded-full border border-neutral-300 ${
                            activeSwitch === GPT4O ? "bg-neutral-50 shadow-lg" : "bg-neutral-300"
                        }`}
                    >
                        <Text
                            className={`${activeSwitch === GPT4O ? "font-bold" : ""}`}
                            weight={activeSwitch === GPT4O ? "bold" : "regular"}
                        >
                            GPT4-O
                        </Text>
                    </div>
                </Tooltip>
            </div> */}
        </div>
    );
}
