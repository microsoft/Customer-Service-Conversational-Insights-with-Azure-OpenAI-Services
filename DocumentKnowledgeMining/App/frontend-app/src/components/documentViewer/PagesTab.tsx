import React from 'react';
import { Text } from '@fluentui/react-components';
import { Document } from "../../api/apiTypes/embedded";
import { useTranslation } from 'react-i18next';

interface IPagesTabProps {
  className?: string;
  pageMetadata?: Document[] | null
  handlePageClick: (selectedPageMetadata: Document) => (event: React.MouseEvent<HTMLDivElement>) => void;
}

export function PagesTab({ className, pageMetadata, handlePageClick }: IPagesTabProps) {
  const { t } = useTranslation();
  
  return (

    <div
      className="grid w-full grid-cols-4 justify-between max-h-[800px] gap-4 overflow-y-auto"
      style={{ width: "200%" }}
    >
      {pageMetadata?.map((selectedPageMetadata, idx) => (
        <div
          key={idx}
          className="h-full w-full px-5 py-5"
          onClick={handlePageClick(selectedPageMetadata)}
        >
          <div className="shadow-xl">
            {/* <img
              src={`data:image/jpeg;base64,${selectedPageMetadata.image.thumbnail_medium}`}
              className="h-full w-full transition-shadow duration-300 ease-in-out hover:shadow-2xl"
              alt={`Page ${selectedPageMetadata.page_number}`}
            /> */}
          </div>
          <div className="mt-2 text-center">
            <Text size={300} weight="semibold">
              {t('components.pages-tab.page')} {selectedPageMetadata.page_number}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
}