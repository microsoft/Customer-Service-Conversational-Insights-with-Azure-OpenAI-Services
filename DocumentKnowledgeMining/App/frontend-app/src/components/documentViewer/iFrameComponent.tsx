import React from "react";
import { useTranslation } from "react-i18next";
import { Document } from "../../api/apiTypes/embedded";
import { TIFFViewer } from "react-tiff";

interface IIFrameComponentProps {
    className?: string;
    metadata: Document | null;
    urlWithSasToken: string | undefined;
    iframeKey: number;
}

export function IFrameComponent({ className, metadata, urlWithSasToken, iframeKey }: IIFrameComponentProps) {
    const { t } = useTranslation();

    const getContentComponent = () => {
        if (!metadata || !urlWithSasToken) {
            return <div>{t("components.iframe.error")}</div>;
        }

        switch (metadata.mimeType) {
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            case "application/vnd.ms-excel.sheet.macroEnabled.12":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
                return (
                    <iframe
                        key={iframeKey}
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                            urlWithSasToken
                        )}`}
                        width="100%"
                        height="100%"
                        title={getTitle(metadata.mimeType)}
                    />
                );
            }
            case "application/pdf": {
                const url = new URL(urlWithSasToken);
                url.searchParams.append("embed", "True");

                return <iframe title="PDF Viewer" key={iframeKey} src={url.toString()} width="100%" height="100%" />;
            }
            case "image/jpeg":
            case "image/png":
            case "image/gif":
            case "image/svg+xml": {
                return <img src={urlWithSasToken} alt={"Document"} className="document-image" />;
            }
            case "image/tiff": {
                return (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            overflowX: "scroll",
                            overflowY: "auto",
                        }}
                    >
                        <TIFFViewer tiff={urlWithSasToken} style={{ width: 100, height: 100, objectFit: "contain" }} />
                    </div>
                );
            }

            default: {
                return (
                    <iframe key={iframeKey} src={urlWithSasToken} width="100%" height="100%" title="Doc visualizer" />
                );
            }
        }
    };

    const getTitle = (mimeType: string) => {
        switch (mimeType) {
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            case "application/vnd.ms-excel.sheet.macroEnabled.12":
                return "Excel viewer";
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                return "PowerPoint viewer";
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return "Word viewer";
            case "application/pdf":
                return "PDF Viewer";
            default:
                return "Doc visualizer";
        }
    };

    return <div className={`${className}`}>{getContentComponent()}</div>;
}
