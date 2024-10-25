import { SearchRequest } from "../types/searchRequest";
import { httpClient } from "../utils/httpClient/httpClient";
import { DocumentResults } from "./apiTypes/documentResults";
import { Embedded } from "./apiTypes/embedded";
import { SingleDocument } from "./apiTypes/singleDocument";



export async function searchDocuments(payload: SearchRequest): Promise<DocumentResults> {
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT + '/Documents/GetDocuments'; // Ensure this is the correct endpoint
    
    const requestBody = {
        pageNumber: payload.currentPage || 1,
        ...(payload.startDate && { startDate: payload.startDate }),
        ...(payload.endDate && { endDate: payload.endDate }),
        pageSize: 10,
        keyword: payload.queryText, // Assuming queryText is a part of your SearchRequest
        tags: {
            // Here we ensure that tags is formatted correctly
            ...payload.filters // Spread the filters directly into tags
        },

        //Change to json body
    };
    
    
    try {
        const response: DocumentResults = await httpClient.post(
            apiEndpoint || '',
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json' // Ensure the correct content type
                }
            }
        );
        
        
        return response;
    } catch (error) {
        console.error('Error searching documents:', error);
        throw error; // Re-throw the error if needed for further handling
    }
}

// Modify the importDocuments function to accept a FormData object instead of File[]
export const importDocuments = async (formData: FormData): Promise<any> => {
    const apiEndpoint = `${import.meta.env.VITE_API_ENDPOINT}/Documents/ImportDocument`;

    try {
        const response = await httpClient.upload(apiEndpoint, formData);
        return response;
    } catch (error) {
        console.error("Error uploading documents:", error);
        throw error;
    }
};

  
  

function formatKeywords(keywords: { [key: string]: string }): { [key: string]: string } {
    // This function formats keywords into the desired comma-separated string for each category
    const formattedKeywords: { [key: string]: string } = {};

    Object.keys(keywords).forEach((category) => {
        const keywordList = keywords[category];
        if (Array.isArray(keywordList)) {
            // If the keywords are in an array, join them into a comma-separated string
            formattedKeywords[category] = keywordList.join(', ');
        } else {
            // If already a string (or incorrect format), preserve it
            formattedKeywords[category] = keywordList;
        }
    });

    return formattedKeywords;
}

// Update in your documentsService file
export const downloadDocument = async (documentId: string, fileName: string): Promise<Blob> => {
    const apiEndpoint = `${import.meta.env.VITE_API_ENDPOINT}/Documents/${documentId}/${encodeURIComponent(fileName)}`;

    

    const response = await fetch(apiEndpoint, {
        method: 'GET',
        // headers: {
        //     'Accept': 'application/pdf', // Adjust based on the document type
        // },
    });

    // Check if the response is okay
    if (!response.ok) {
        const errorText = await response.text(); // Get error response if any
        console.error(`Failed to download document. Status: ${response.status} - ${errorText}`);
        throw new Error(`Failed to download document: ${response.statusText}`);
    }

    const blob = await response.blob(); // Convert response to Blob
    

    // Check if blob is valid
    if (!(blob instanceof Blob)) {
        throw new Error('Response is not a Blob');
    }

    return blob; // Return the Blob directly
};


  
// export async function getCoverImage(indexKey: string) {
//     const response: CoverImage = await httpClient.get(`${window.ENV.API_URL}/api/Documents/${indexKey}/Cover`);

//     return response;
// }

export async function getEmbedded(indexKey: string) {

    const response: Embedded = await httpClient.post(
        `${window.ENV.API_URL}/api/Documents/${indexKey}/Embedded`
    );

    return response;
}

// export async function getDocument(documentId: string) {
//     const response: SingleDocument = await httpClient.get(`${window.ENV.API_URL}/api/Documents/${documentId}`);

//     return response;
// }

// export async function getMyDocuments(){
//     const response: any = await httpClient.post(`${window.ENV.API_URL}/api/Documents/MyDocuments?currentPage=1&rowCount=20`);

//     return response;
// }

// export async function toggleVisibility(documentId: string, isRestricted: boolean) {

//     const response: Response = await httpClient.post(
//         `${window.ENV.API_URL}/api/Documents/${documentId}/Visibility?isRestricted=${isRestricted}`
//     );

//     return response;
// }

// export async function deleteDocument(documentId: string) {
//     const response: Response = await httpClient.delete(`${window.ENV.API_URL}/api/Documents/${documentId}`);

//     return response;
// }
    
    