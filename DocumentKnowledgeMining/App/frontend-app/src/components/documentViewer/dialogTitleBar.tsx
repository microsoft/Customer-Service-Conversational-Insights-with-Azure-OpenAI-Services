import React, { useState, useEffect } from 'react';
import { Button, Divider, Text, Tab, TabList, SelectTabEvent, SelectTabData, DialogTrigger } from '@fluentui/react-components';
import { Dismiss24Regular, ArrowHookDownLeft16Filled, SparkleFilled, DocumentBulletListMultipleRegular, DocumentBulletListRegular, LayerDiagonalSparkle24Regular, InfoRegular } from '@fluentui/react-icons';
import { DialogTitle } from '@fluentui/react-components';
import { KMBrandRamp } from '../../styles';
import { Document } from '../../api/apiTypes/embedded';
import { useTranslation } from 'react-i18next';
import { ChatRoom } from '../chat/chatRoom';
import { Chat24Regular } from '@fluentui/react-icons';
import homeStyles from "../../pages/home/home.module.scss";

interface IDialogTitleBarProps {
  className?: string;
  handleDialogClose: () => void;
  metadata: any; 
  selectedPage: number | null;
  selectedTab: string;
  onTabSelect: (event: SelectTabEvent, data: SelectTabData) => void;
  pageMetadata: Document[] | null; 
  selectedPageMetadata: any; 
  handleReturnToDocumentTab: () => void;
  downloadFile: () => void;
  urlWithSasToken: string | undefined;
  styles: any;
  props: any;
  clearChatFlag: boolean;
  setClearChatFlag: (value: boolean) => void;
}

export function DialogTitleBar({
  handleDialogClose,
  metadata,
  selectedPage,
  selectedTab,
  onTabSelect,
  pageMetadata,
  selectedPageMetadata,
  handleReturnToDocumentTab,
  downloadFile,
  urlWithSasToken,
  styles,
  props,
  clearChatFlag,
  setClearChatFlag
}: IDialogTitleBarProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(selectedTab);

  useEffect(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);

  const handleTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setActiveTab(data.value as string);
    onTabSelect(event, data);
    
    if (data.value === "Chat Room") {
      setClearChatFlag(false);
    }
  };

  return (
    <DialogTitle
      style={{ width: "100%" }}
      action={
        <DialogTrigger action="close">
          <Button
            appearance="subtle"
            aria-label="close"
            icon={<Dismiss24Regular />}
            onClick={handleDialogClose}
          />
        </DialogTrigger>
      }
    >
      <div>{metadata?.title}</div>
      <div>
        <Text weight="semibold" size={200} style={{ color: KMBrandRamp[40] }}>
          {metadata?.source_last_modified}
        </Text>
      </div>
      <div className="-ml-3 mt-5 flex justify-between">
        {selectedPage === null ? (
          <div className={styles.tabList}>
            <TabList
              {...props}
              selectedValue={activeTab}
              onTabSelect={handleTabSelect}
            >
              <Tab value="Document" icon={<DocumentBulletListRegular />}>{t('components.dialog-title-bar.document')}</Tab>
              <Tab value="AI Knowledge" icon={<SparkleFilled />}>{t('components.dialog-title-bar.ai-knowledge')}</Tab>              
              <Tab value="Chat Room" icon={<Chat24Regular />}>{t('Chat')}</Tab>
              {pageMetadata && pageMetadata.length > 0 && <Tab value="Pages" icon={<DocumentBulletListMultipleRegular />}>{t('components.dialog-title-bar.pages')}</Tab>}
            </TabList>
          </div>
        ) : (
          <TabList
            {...props}
            selectedValue={selectedTab}
            onTabSelect={onTabSelect}
          >
            <Tab value="Page Number" icon={<DocumentBulletListRegular />}>{t('components.dialog-title-bar.page')} {selectedPage}</Tab>
            {selectedPageMetadata?.tables && selectedPageMetadata?.tables.length > 0 && (
              <Tab value="Tables" icon={<LayerDiagonalSparkle24Regular />}>{t('components.dialog-title-bar.tables')}</Tab>
            )}
            <Tab value="PageMetadata" icon={<InfoRegular />}>{t('components.dialog-title-bar.page-metadata')}</Tab>
          </TabList>
        )}
        <div className="flex space-x-2">
          {(selectedTab === "Page Number" || selectedTab === "Tables" || selectedTab === "PageMetadata") && (
            <Button
              className="h-8"
              appearance="outline"
              onClick={handleReturnToDocumentTab}
            >
              <ArrowHookDownLeft16Filled /> {t('components.dialog-title-bar.return-to-document')}
            </Button>
          )}
          <Button
            className="h-8"
            appearance="primary"
            onClick={downloadFile}
            disabled={!urlWithSasToken}
          >
            {t('components.dialog-title-bar.download')}
          </Button>
        </div>
      </div>
      <div className="pb-4">
        <Divider />
      </div>

      {activeTab === 'Chat Room' && (
        <div className="flex flex-col h-full items-center" style={{ display: 'flex', width: '70%', margin: '0 auto' }}>
          <Text
            as="h2"
            size={800}
            weight="semibold"
            className="mb-4"
            style={{ textAlign: 'center' }}
          >
            Chat with your selected document.
          </Text>
          <div className="w-full flex-grow">
            <div className="flex flex-col h-full">
              <div
                className={`flex-grow overflow-y-auto overflow-x-hidden p-4 ${homeStyles["dialog-chat-room"]}`}  // Add `overflow-x-hidden` to remove horizontal scrolling
                style={{ backgroundColor: '#f7f7f7', maxHeight: 'calc(75vh - 60px)', height: 'calc(-60px + 75vh)', width: '100%', fontSize: '1rem', fontWeight: 'normal', display: 'flex' }}  // Ensure full width is used
              >
                <ChatRoom
                  disableOptionsPanel={true}
                  searchResultDocuments={[]}
                  selectedDocuments={[metadata]}
                  chatWithDocument={[metadata]}
                  clearChatFlag={clearChatFlag}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogTitle>
  );
}