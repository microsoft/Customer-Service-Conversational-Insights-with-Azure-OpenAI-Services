import { Label } from "@fluentui/react-components";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import './OptionsPanel.css'; // CSS file for slider

interface OptionsPanelProps {
  className?: string;
  onSourceChange: (button: string, source: string) => void;
  onModelChange: (model: string) => void;
  disabled: boolean;
  selectedDocuments: any[];
  isSticky: boolean
}

export function OptionsPanel({
  className,
  onSourceChange,
  onModelChange,
  disabled,
  selectedDocuments,
  isSticky
}: OptionsPanelProps) {
  const { t } = useTranslation();
  
  const [selectedButton, setSelectedButton] = useState<string>("All Documents");

  useEffect(() => {
    // Automatically switch based on selectedDocuments
    const newSelection = selectedDocuments.length > 0 ? "Selected" : "All Documents";
    setSelectedButton(newSelection);
  }, [selectedDocuments]);

  useEffect(() => {
    onSourceChange(selectedButton, selectedButton);
  }, [selectedButton, onSourceChange]);

  return (
    <div className={`options-panel-container ${className} ${isSticky ? "sticky" : ""}`}>
      <div className="flex items-center justify-center pt-4">
        <h2 className="title">{t('Chat with documents')}</h2>
      </div>

      <div className="slider-container">
        {/* Slider background which moves based on selection */}
        <div className={`slider ${selectedButton}`} />
        
        {/* All Documents button */}
        <button
          className={`slider-button ${selectedButton === "All Documents" ? 'active' : ''}`}
          disabled={disabled}
        >
          All Documents
        </button>

        {/* Selected button */}
        <button
          className={`slider-button ${selectedButton === "Selected" ? 'active' : ''}`}
          disabled={disabled || selectedDocuments.length === 0}
        >
          {selectedDocuments.length > 0 ? `${selectedDocuments.length} Selected` : 'Selected'}
        </button>
      </div>
    </div>
  );
}