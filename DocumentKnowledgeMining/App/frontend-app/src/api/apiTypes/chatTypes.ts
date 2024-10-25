export interface ChatOptions {
    model?: string;
    source?: string;
    temperature?: number;
    maxTokens?: number;
}

export type ChatMessage = {
    role?: string;
    content: string;
};

export type HistoryItem = {
    role: string;
    content: string;
    datetime?: Date;
  };
  
export type History = HistoryItem[];

export type ChatRequest = {
    Question: string;
    chatSessionId: string;
    DocumentIds: string[];
};

export type ChatApiResponse = {
    answer: string;
    documentIds: string[];
    suggestingQuestions: string[];
    keywords: string[];
}

export type Reference = {
    title: string;
    parent_id: string;
    chunk_id: string;
    chunk_text: string;
};

export type AskResponse = {
    answer: string;
};

export interface FeedbackRequest {
    history: History;
    options: ChatOptions;
    sources: Reference[];    
    filterByDocumentIds?: string[];
    isPositive?: boolean;
    comment?: string;
    reason?: string;
    groundTruthAnswer?: string;
    documentURLs?: string[];
    chunkTexts?: string[];    
}


