## Data upload format

### Audio File Format
Azure AI Services are utilized for batch transcription of conversation audio files. This service supports MPS, WAV and more. Full details can be found [here](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/batch-transcription-audio-data?tabs=portal).

We have seen successful transcription of files up to 15MB in size but some very large files may experience processing challenges.


### JSON File Format
Contact center conversations may be uploaded directly as text provided they are in the proper JSON file format. Below is a sample structure of an abbreviated conversation file. Each sentence or phrase is an individual node followed by summary information for the entire call. These format conversation files are smaller size, less costly to process, and faster to process.
```json
{
   "ConversationId":"190d77d6-6227-49bd-8eec-da8ebfb37d4a",
   "Messages":[
      {
         "Id":"4d8a986d-d975-4034-a70f-bdf2727916d3",
         "ReferenceId":null,
         "EventType":"Message FromBotOrAgent",
         "EventTime":"2023-07-01T17:53:36.3410369-07:00",
         "ConversationId":"190d77d6-6227-49bd-8eec-da8ebfb37d4a",
         "Value":"Thank you for calling Travel Time, my name is Emily Johnson. How may I assist you today?",
         "UserId":"WWEU7Z",
         "CustomProperties":{
            "offset":"",
            "duration":"",
            "offsetInTicks":0,
            "durationInTicks":0
         }
      },
      {
         "Id":"c7d9150d-4d5c-46eb-845d-7c8d6df2255d",
         "ReferenceId":null,
         "EventType":"MessageFromUser",
         "EventTime":"2023-07-01T17:53:36.3410369-07:00",
         "ConversationId":"190d77d6-6227-49bd-8eec-da8ebfb37d4a",
         "Value":"This is a complete disaster! My name is Jessica Adams and I recently traveled from San Francisco to Tokyo for a business trip. I am extremely dissatisf",
         "UserId":"QEHIFV",
         "CustomProperties":{
            "offset":"",
            "duration":"",
            "offsetInTicks":0,
            "durationInTicks":0
         }
      },
      {
         "Id":"c9aba9ec-9a25-4eda-8f72-a2f02fcfaldd",
         "ReferenceId":null,
         "EventType":"Message FromBotOrAgent",
         "EventTime":"2023-07-01T17:53:36.3410369-07:00",
         "ConversationId":"190d77d6-6227-49bd-8eec-da8ebfb37d4a",
         "Value":"I'm sorry to hear about your experience, Jessica. Can you please let me know what happened?",
         "UserId":"WWEU7Z",
         "CustomProperties":{
            "offset":"",
            "duration":"",
            "offsetInTicks":0,
            "durationInTicks":0
         }
      },
      {
         "Id":"790cclad-47d1-48fe-a502-d5eb433d72c7",
         "ReferenceId":null,
         "EventType":"MessageFromUser",
         "EventTime":"2023-07-01T17:53:36.3410369-07:00",
         "ConversationId":"190d77d6-6227-49bd-8eec-da8ebfb37d4a",
         "Value":"Well, first of all, I had booked a flight with Skylux Airlines, and it was delayed for more than two hours without any explanation. I missed an importa",
         "UserId":"QEHIFV",
         "CustomProperties":{
            "offset":"",
            "duration":"",
            "offsetInTicks":0,
            "durationInTicks":0
         }
      }
   ],
   "StartTime":"2023-07-01T17:53:36.3410369-07:00",
   "EndTime":"2023-07-01T17:53:36.3410369-07:00",
   "merged_content":"Thank you for calling Travel Time, my name is Emily Johnson. How may I assist you today? This is a complete disaster! My name is Jessica Adams and",
   "merged_content_user":"This is a complete disaster! My name is Jessica Adams and I recently traveled from San Francisco to Tokyo for a business trip. I am extremely",
   "merged_content_agent":"Thank you for calling Travel Time, my name is Emily Johnson. How may I assist you today? I'm sorry to hear about your experience, Jessica. Ca",
   "full_conversation":"Agent: Thank you for calling Travel Time, my name is Emily Johnson. How may I assist you today?\nCustomer: This is a complete disaster! My name"
}
```
