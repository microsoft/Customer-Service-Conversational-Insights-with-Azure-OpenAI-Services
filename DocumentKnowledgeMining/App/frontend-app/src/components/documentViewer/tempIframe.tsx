import React from 'react';
import { useTranslation } from "react-i18next";
import { Document } from "../../api/apiTypes/embedded";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import * as pdfjs from 'pdfjs-dist';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



interface IFrameComponentProps {
  className?: string;
  metadata: Document | null;
  urlWithSasToken: string | undefined;
  iframeKey: number;
}

const MIME_TYPES = {
  EXCEL: [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel.sheet.macroEnabled.12"
  ],
  WORD: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  POWERPOINT: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  PDF: ["application/pdf"],
  IMAGE: ["image/jpeg", "image/png", "image/gif", "image/svg+xml"]
};

export function IFrameComponent({ className, metadata, urlWithSasToken, iframeKey }: IFrameComponentProps) {
  const { t } = useTranslation();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const getTitle = (mimeType: string): string => {
    if (MIME_TYPES.EXCEL.includes(mimeType)) return "Excel viewer";
    if (MIME_TYPES.POWERPOINT.includes(mimeType)) return "PowerPoint viewer";
    if (MIME_TYPES.WORD.includes(mimeType)) return "Word viewer";
    return "Doc visualizer";
  };

  const getOfficeViewer = () => (
    <iframe
      key={iframeKey}
      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(urlWithSasToken!)}`}
      width="100%"
      height="100%"
      title={getTitle(metadata!.mimeType)}
    />
  );

  const getPDFViewer = () => (
    <Worker workerUrl={`//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`}>
      <div style={{ height: '750px' }}>
        <Viewer fileUrl={urlWithSasToken!} plugins={[defaultLayoutPluginInstance]} />
      </div>
    </Worker>
  );

  const getImageViewer = () => (
    <img
      src={urlWithSasToken}
      alt={"Document image"}
      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
    />
  );

  const getDefaultViewer = () => (
    <iframe
      key={iframeKey}
      src={urlWithSasToken}
      width="100%"
      height="100%"
      title="Doc visualizer"
    />
  );

  const getContentComponent = () => {
    if (!metadata || !urlWithSasToken) {
      return <div>{t('components.iframe.error')}</div>;
    }

    const { mimeType } = metadata;

    if (MIME_TYPES.EXCEL.includes(mimeType) || MIME_TYPES.WORD.includes(mimeType) || MIME_TYPES.POWERPOINT.includes(mimeType)) {
      return getOfficeViewer();
    }
    if (MIME_TYPES.PDF.includes(mimeType)) {
      return getPDFViewer();
    }
    if (MIME_TYPES.IMAGE.includes(mimeType)) {
      return getImageViewer();
    }
    return getDefaultViewer();
  };

  return (
    <div className={className}>
      {getContentComponent()}
    </div>
  );
}