## Data upload format

### Audio File Format
Azure AI Speech Service is utilized for transcription of conversation audio files. The code is currently configured to support WAV files only, but the code can be modified to support other formats supported by Azure Speech Service. Full details can be found [here](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/).

We have seen successful transcription of files up to 15MB in size but some very large files may experience processing challenges.

Contact center conversations may be uploaded directly as audio to the `audio_input` folder in the Fabric lakehouse along with an associated conversation audio metadata .CSV file. Below is a sample structure of a conversation audio metadata .CSV file:
```csv
ConversationId,StartTime,EndTime,CallerId,CallReason,ResolutionStatus,AgentId,AgentName,Team,FileName
19d35564-fbc7-4491-8c77-57ec63c5be75,4/7/2024 2:28:36 PM, 4/7/2024 2:30:36 PM,999-304-5535,Tech Support,Unresolved,Q8BBAU,Amelia Hernandez,West, Travel_20240407142802.wav
341aee84-da8b-4630-8ff3-4fc8ffb99aa7,4/13/2024 7:28:21 AM, 4/13/2024 7:30:21 AM,999-994-9470,Transactions,Resolved,7J8IBO,Aiden Clark,Midwest, Travel_20240413072810.wav
acb6e950-0aa6-442f-b863-fad3234938c2,4/17/2024 1:28:53 AM, 4/17/2024 1:31:53 PM,999-167-6915,Complaints,Unresolved,WVBORA,Emma Davis,Southeast, Travel_20240417132839.wav
```


### JSON File Format
Contact center conversations may be uploaded directly as text to the `conversation_input` folder in the Fabric lakehouse provided they are in the proper JSON file format. Below is a sample structure of a conversation file. Each sentence or phrase is an individual node followed by summary information for the entire call. These formatted conversation files are smaller size, less costly to process, and faster to process.
```json
{
  "AgentName": "Aiden Clark",
  "AgentId": "7J8IBO",
  "Team": "Northeast",
  "ResolutionStatus": "Unresolved",
  "CallReason": "Transactions",
  "CallerID": "999-909-3647",
  "Conversation": {
    "ConversationId": "996e0643-8fff-496c-9944-49884da2a89f",
    "Messages": [
      {
        "Id": "e482c66b-9ea7-405d-915f-ddede94628c0",
        "ReferenceId": null,
        "EventType": "MessageFromBotOrAgent",
        "EventTime": "2024-01-31T13:23:53.0679497-06:00",
        "ConversationId": "996e0643-8fff-496c-9944-49884da2a89f",
        "Value": "Thank you for calling ABC Travel, my name is Aiden, how can I assist you today?",
        "UserId": "7J8IBO",
        "CustomProperties": {
          "Offset": "",
          "Duration": "",
          "OffsetInTicks": 0,
          "DurationInTicks": 0
        }
      },
      {
        "Id": "645d505e-25d4-4402-b06b-932d7452ec42",
        "ReferenceId": null,
        "EventType": "MessageFromUser",
        "EventTime": "2024-01-31T13:24:03.0679497-06:00",
        "ConversationId": "996e0643-8fff-496c-9944-49884da2a89f",
        "Value": "Hi Aiden, my name is Lisa Smith and I'm having trouble with my travel plans. I'm supposed to fly from New York City to Los Angeles next week but I'm having trouble deciding on a flight and hotel. Can you help me with some options?",
        "UserId": "999-909-3647",
        "CustomProperties": {
          "Offset": "",
          "Duration": "",
          "OffsetInTicks": 0,
          "DurationInTicks": 0
        }
      },
      {
        "Id": "6e27be93-82be-4be8-855d-e24a8d93ab41",
        "ReferenceId": null,
        "EventType": "MessageFromBotOrAgent",
        "EventTime": "2024-01-31T13:24:16.0679497-06:00",
        "ConversationId": "996e0643-8fff-496c-9944-49884da2a89f",
        "Value": "Of course Lisa, I'd be happy to help you. Can you give me a little more information about your travel preferences? What time of day do you prefer to fly and what's your budget for a hotel?",
        "UserId": "7J8IBO",
        "CustomProperties": {
          "Offset": "",
          "Duration": "",
          "OffsetInTicks": 0,
          "DurationInTicks": 0
        }
      },
      {
        "Id": "c2914fd9-d3f9-47be-a3ed-108cdce93817",
        "ReferenceId": null,
        "EventType": "MessageFromUser",
        "EventTime": "2024-01-31T13:24:32.0679497-06:00",
        "ConversationId": "996e0643-8fff-496c-9944-49884da2a89f",
        "Value": "I'm flexible on the flight time, but I don't want to spend more than $150 a night on a hotel. Can you give me some options?",
        "UserId": "999-909-3647",
        "CustomProperties": {
          "Offset": "",
          "Duration": "",
          "OffsetInTicks": 0,
          "DurationInTicks": 0
        }
      },
      {
        "Id": "74de2f3f-32d7-4ae1-af7c-f817df15e967",
        "ReferenceId": null,
        "EventType": "MessageFromBotOrAgent",
        "EventTime": "2024-01-31T13:24:51.0679497-06:00",
        "ConversationId": "996e0643-8fff-496c-9944-49884da2a89f",
        "Value": "Sure Lisa, for your flight options, I would recommend Delta Airlines flight 123 departing JFK at 10am and arriving in LAX at 1pm or United Airlines flight 456 departing JFK at 2pm and arriving in LAX at 5pm. For your hotel options, there's the Hilton Los Angeles Airport with a reservation number of XYZ123 and arriving on April 1st or the Marriott LAX with a reservation number of ABC456 and arriving on March 31st. Would you like any more information or would you like me to book any of these options for you?",
        "UserId": "7J8IBO",
        "CustomProperties": {
          "Offset": "",
          "Duration": "",
          "OffsetInTicks": 0,
          "DurationInTicks": 0
        }
      },
      {
        "Id": "a8506497-3de9-459a-a844-f46a9d99e3c5",
        "ReferenceId": null,
        "EventType": "MessageFromUser",
        "EventTime": "2024-01-31T13:25:03.0679497-06:00",
        "ConversationId": "996e0643-8fff-496c-9944-49884da2a89f",
        "Value": "Hmm, I'm not sure. Can you tell me more about the hotels and their amenities? And are there any other flight options?",
        "UserId": "999-909-3647",
        "CustomProperties": {
          "Offset": "",
          "Duration": "",
          "OffsetInTicks": 0,
          "DurationInTicks": 0
        }
      },
      {
        "Id": "b57bcb32-1b4c-48f5-ab1b-f2876ee2c5ca",
        "ReferenceId": null,
        "EventType": "MessageFromBotOrAgent",
        "EventTime": "2024-01-31T13:25:15.0679497-06:00",
        "ConversationId": "996e0643-8fff-496c-9944-49884da2a89f",
        "Value": "Absolutely, Lisa. The Hilton offers complimentary airport shuttle service and a fitness center, while the Marriott offers a pool and spa. As for flight options, there's also American Airlines flight 789 departing JFK at 1pm and arriving in LAX at 4pm. Would you like me to check for any other options or book any of these for you?",
        "UserId": "7J8IBO",
        "CustomProperties": {
          "Offset": "",
          "Duration": "",
          "OffsetInTicks": 0,
          "DurationInTicks": 0
        }
      },
      {
        "Id": "81dbbe4b-88fe-49f5-9570-4671e84376c7",
        "ReferenceId": null,
        "EventType": "MessageFromUser",
        "EventTime": "2024-01-31T13:25:29.0679497-06:00",
        "ConversationId": "996e0643-8fff-496c-9944-49884da2a89f",
        "Value": "Yes, I think I would like to book the Delta flight and the Marriott hotel. Can you please assist me with that?",
        "UserId": "999-909-3647",
        "CustomProperties": {
          "Offset": "",
          "Duration": "",
          "OffsetInTicks": 0,
          "DurationInTicks": 0
        }
      },
      {
        "Id": "cd98d4c5-63ec-43e7-b552-322b18c2b7b3",
        "ReferenceId": null,
        "EventType": "MessageFromBotOrAgent",
        "EventTime": "2024-01-31T13:25:46.0679497-06:00",
        "ConversationId": "996e0643-8fff-496c-9944-49884da2a89f",
        "Value": "Absolutely, Lisa. Let me just pull up that information and I'll get you booked. Can I have your full name and payment information?",
        "UserId": "7J8IBO",
        "CustomProperties": {
          "Offset": "",
          "Duration": "",
          "OffsetInTicks": 0,
          "DurationInTicks": 0
        }
      }
    ],
    "StartTime": "2024-01-31T13:23:34.0679497-06:00",
    "EndTime": "2024-01-31T13:25:46.0679497-06:00",
    "Merged_content": "Thank you for calling ABC Travel, my name is Aiden, how can I assist you today?Hi Aiden, my name is Lisa Smith and I'm having trouble with my travel plans. I'm supposed to fly from New York City to Los Angeles next week but I'm having trouble deciding on a flight and hotel. Can you help me with some options?Of course Lisa, I'd be happy to help you. Can you give me a little more information about your travel preferences? What time of day do you prefer to fly and what's your budget for a hotel?I'm flexible on the flight time, but I don't want to spend more than $150 a night on a hotel. Can you give me some options?Sure Lisa, for your flight options, I would recommend Delta Airlines flight 123 departing JFK at 10am and arriving in LAX at 1pm or United Airlines flight 456 departing JFK at 2pm and arriving in LAX at 5pm. For your hotel options, there's the Hilton Los Angeles Airport with a reservation number of XYZ123 and arriving on April 1st or the Marriott LAX with a reservation number of ABC456 and arriving on March 31st. Would you like any more information or would you like me to book any of these options for you?Hmm, I'm not sure. Can you tell me more about the hotels and their amenities? And are there any other flight options?Absolutely, Lisa. The Hilton offers complimentary airport shuttle service and a fitness center, while the Marriott offers a pool and spa. As for flight options, there's also American Airlines flight 789 departing JFK at 1pm and arriving in LAX at 4pm. Would you like me to check for any other options or book any of these for you?Yes, I think I would like to book the Delta flight and the Marriott hotel. Can you please assist me with that?Absolutely, Lisa. Let me just pull up that information and I'll get you booked. Can I have your full name and payment information?",
    "Merged_content_user": "Hi Aiden, my name is Lisa Smith and I'm having trouble with my travel plans. I'm supposed to fly from New York City to Los Angeles next week but I'm having trouble deciding on a flight and hotel. Can you help me with some options?I'm flexible on the flight time, but I don't want to spend more than $150 a night on a hotel. Can you give me some options?Hmm, I'm not sure. Can you tell me more about the hotels and their amenities? And are there any other flight options?Yes, I think I would like to book the Delta flight and the Marriott hotel. Can you please assist me with that?",
    "Merged_content_agent": "Thank you for calling ABC Travel, my name is Aiden, how can I assist you today?Of course Lisa, I'd be happy to help you. Can you give me a little more information about your travel preferences? What time of day do you prefer to fly and what's your budget for a hotel?Sure Lisa, for your flight options, I would recommend Delta Airlines flight 123 departing JFK at 10am and arriving in LAX at 1pm or United Airlines flight 456 departing JFK at 2pm and arriving in LAX at 5pm. For your hotel options, there's the Hilton Los Angeles Airport with a reservation number of XYZ123 and arriving on April 1st or the Marriott LAX with a reservation number of ABC456 and arriving on March 31st. Would you like any more information or would you like me to book any of these options for you?Absolutely, Lisa. The Hilton offers complimentary airport shuttle service and a fitness center, while the Marriott offers a pool and spa. As for flight options, there's also American Airlines flight 789 departing JFK at 1pm and arriving in LAX at 4pm. Would you like me to check for any other options or book any of these for you?Absolutely, Lisa. Let me just pull up that information and I'll get you booked. Can I have your full name and payment information?",
    "Full_conversation": "Agent: Thank you for calling ABC Travel, my name is Aiden, how can I assist you today?\nCustomer: Hi Aiden, my name is Lisa Smith and I'm having trouble with my travel plans. I'm supposed to fly from New York City to Los Angeles next week but I'm having trouble deciding on a flight and hotel. Can you help me with some options?\nAgent: Of course Lisa, I'd be happy to help you. Can you give me a little more information about your travel preferences? What time of day do you prefer to fly and what's your budget for a hotel?\nCustomer: I'm flexible on the flight time, but I don't want to spend more than $150 a night on a hotel. Can you give me some options?\nAgent: Sure Lisa, for your flight options, I would recommend Delta Airlines flight 123 departing JFK at 10am and arriving in LAX at 1pm or United Airlines flight 456 departing JFK at 2pm and arriving in LAX at 5pm. For your hotel options, there's the Hilton Los Angeles Airport with a reservation number of XYZ123 and arriving on April 1st or the Marriott LAX with a reservation number of ABC456 and arriving on March 31st. Would you like any more information or would you like me to book any of these options for you?\nCustomer: Hmm, I'm not sure. Can you tell me more about the hotels and their amenities? And are there any other flight options?\nAgent: Absolutely, Lisa. The Hilton offers complimentary airport shuttle service and a fitness center, while the Marriott offers a pool and spa. As for flight options, there's also American Airlines flight 789 departing JFK at 1pm and arriving in LAX at 4pm. Would you like me to check for any other options or book any of these for you?\nCustomer: Yes, I think I would like to book the Delta flight and the Marriott hotel. Can you please assist me with that?\nAgent: Absolutely, Lisa. Let me just pull up that information and I'll get you booked. Can I have your full name and payment information?\n"
  }
}
```
