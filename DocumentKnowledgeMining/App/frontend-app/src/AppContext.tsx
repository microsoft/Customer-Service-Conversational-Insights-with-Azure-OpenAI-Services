import { ReactNode, createContext, useState } from 'react';
import { ChatApiResponse } from './api/apiTypes/chatTypes';
import { SearchFacet } from './types/searchRequest';

export interface IAppContext {
    conversationAnswers: [prompt: string, response: ChatApiResponse, userTimestamp?: Date, answerTimestamp?: Date][];
    setConversationAnswers: (
        value: (
            prevState: [prompt: string, response: ChatApiResponse, userTimestamp?: Date, answerTimestamp?: Date][]
        ) => [prompt: string, response: ChatApiResponse, userTimestamp?: Date, answerTimestamp?: Date][]
    ) => void;
    query: string;
    setQuery: (value: string) => void;
    filters: { [key: string]: string[] };  // Change this line
    setFilters: (value: { [key: string]: string[] }) => void; // Change this line
}

export const AppContext = createContext({} as IAppContext);

export const AppContextProvider = ({ children }: { children?: ReactNode }) => {
    const [conversationAnswers, setConversationAnswers] = useState<[prompt: string, response: ChatApiResponse, userTimestamp?: Date, answerTimestamp?: Date][]>([]);
    const [query, setQuery] = useState<string>("");
    const [filters, setFilters] = useState<{ [key: string]: string[] }>({}); // Change this line

    const appContext: IAppContext = {
        conversationAnswers,
        setConversationAnswers,
        query,
        setQuery,
        filters,
        setFilters,
    };

    return (
        <AppContext.Provider value={appContext}>
            {children}
        </AppContext.Provider>
    );
};
