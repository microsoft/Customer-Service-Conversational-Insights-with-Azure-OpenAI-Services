import { ChatApiResponse, ChatRequest, FeedbackRequest } from "./apiTypes/chatTypes";
import { httpClient } from "../utils/httpClient/httpClient";


// export async function Completion(request: ChatRequest){
//     const response: ChatApiResponse = await httpClient.post(`https://dpsapi.eastus2.cloudapp.azure.com/chat`, request);

//     return response;
// }

export async function Completion(request: ChatRequest): Promise<ChatApiResponse> {
    try {
      // Assuming httpClient is similar to Axios, we pass the request body and expect a ChatApiResponse
      const response: ChatApiResponse = await httpClient.post(
        `${import.meta.env.VITE_API_ENDPOINT}/chat`, 
        request,
        {
            headers: {
              'Content-Type': 'application/json', // Ensure JSON format
            },
          }
      );
  
      // Return the actual response data (assuming Axios-style response structure)
      return response;
    } catch (error) {
      console.error('Error during API request:', error);
      throw new Error('Failed to fetch the API response.');
    }
  }
  

export async function PostFeedback(request: FeedbackRequest){
    const response: boolean = await httpClient.post(`${window.ENV.API_URL}/api/Chat/Feedback`, request);

    return response;
}