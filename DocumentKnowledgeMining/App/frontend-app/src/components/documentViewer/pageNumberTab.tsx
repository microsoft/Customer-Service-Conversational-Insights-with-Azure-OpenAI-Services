import React from 'react';
import { Text, Image } from '@fluentui/react-components';
import { Document } from "../../api/apiTypes/embedded";

interface IPageNumberTabProps {
  selectedTab: string;
  selectedPageMetadata: Document | null;
  documentUrl: string | undefined;
}

export const PageNumberTab: React.FC<IPageNumberTabProps> = ({ selectedTab, selectedPageMetadata, documentUrl}) => {
  if (selectedTab !== "Page Number" || !selectedPageMetadata || !documentUrl) {
    return null;
  }

  const imageUrl = window.ENV.STORAGE_URL +
    selectedPageMetadata.document_url.replace(/^(?:\/\/|[^/]+)*\//, "") +
    "/" 

  return (
    <div className="grid w-full grid-cols-4 justify-between gap-4 overflow-y-auto" style={{ width: "200%" }}>
      <div className="col-span-3 grid justify-between gap-4 overflow-y-auto h-[80%] shadow-xl">
        <div className="flex w-full justify-between">
          <Image
            alt="Image of selected page number"
            src={imageUrl}
          />
        </div>
      </div>
      <div className="col-span-1">
        <div className="flex-auto">
          <Text size={300} weight="semibold">
            {selectedPageMetadata.summary}
          </Text>
        </div>
      </div>
    </div>
  );
};