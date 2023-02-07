import logging
import azure.functions as func
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import json
import os
from isodate import parse_duration
import dateutil.parser


def main(myblob: func.InputStream):
    logging.info(f"Python blob trigger function processed blob \n"
                 f"Name: {myblob.name}\n"
                 f"Blob Size: {myblob.length} bytes")

    connection_string = os.environ['conversationalkm_STORAGE']
    container = os.environ['telemetry_processed']

    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    # Processing
    get_transcript(myblob, blob_service_client, container)


def get_transcript(blob, blob_service_client, container):
    # speechtotext/v3.0/transcriptions/{id}

    transcript_id = blob.name.split('/')[-1]

    transcript= json.loads(blob.read())

    timestamp = transcript['timeStamp']
    recognizedPhrases = transcript['recognizedPhrases']
    single_channel = True if len(set(map(lambda x: x['channel'], recognizedPhrases))) == 1 else False
    phrases = list(map(lambda x: extract_data(x, timestamp, single_channel), recognizedPhrases))

    save_conversation(transcript_id, phrases, blob_service_client, container)

# Extract date from Speech Data
def extract_data(x, timestamp, single_channel):
    return {
        "speaker" : x['channel'] if not single_channel else x['speaker'] if x['speaker'] == 1 else 0,
        "phrase" : x['nBest'][0]['display'],
        "offset" : x['offset'],
        "duration": x['duration'],
        "offsetInTicks" : x['offsetInTicks'],
        "durationInTicks" : x['durationInTicks'],
        "timestamp" : timestamp
    }


# Format single phrase as message
def format_message(id, phrase):
    event_time = dateutil.parser.parse(phrase['timestamp']) + parse_duration(phrase['offset'])
    return  {
        "Id": f"{id}_{phrase['offset']}",
        "ReferenceId": None,
        "EventType": "MessageFromUser" if phrase['speaker'] == 0 else "MessageFromBotOrAgent",
        "EventTime": str(event_time),
        "ConversationId": id,
        "Value": phrase['phrase'],
        "UserId": phrase['speaker'],
        "CustomProperties": {
            "offset": phrase['offset'],
            "duration": phrase['duration'],
            "offsetInTicks": phrase['offsetInTicks'],
            "durationInTicks": phrase['durationInTicks']
            }
        }


# Save conversation in Azure Blob Storage
def save_conversation(conversation_id, messages, blob_service_client, container):
    # Define structure for conversational data
    data = {
        "ConversationId" : conversation_id,
        "Messages" : []
    }
    blob = f"{conversation_id}.json"
    # Define Azure Blob Storage client
    blob_client = blob_service_client.get_blob_client(container=container, blob=blob)

    data['Messages'] = list(map(lambda x: format_message(conversation_id, x),messages))
    data['Messages'] = sorted(data['Messages'], key = lambda x:x['EventTime'])


    # Extract Min and Max EventTime for conversation
    data["StartTime"] = min(list(map(lambda x: x['EventTime'], data['Messages'])))
    data["EndTime"]   = max(list(map(lambda x: x['EventTime'], data['Messages'])))


    audio_user_channel = int(os.getenv('audio_user_channel', 1))
    audio_agent_channel = 0 if audio_user_channel == 1 else 1
    data["merged_content"]         = "".join(list(filter(None, map(lambda x: x['Value'] , data['Messages']))))
    data["merged_content_user"]    = "".join(list(filter(None, map(lambda x: x['Value'] if x['UserId'] == audio_user_channel else None, data['Messages']))))
    data["merged_content_agent"]   = "".join(list(filter(None, map(lambda x: x['Value'] if x['UserId'] == audio_agent_channel else None, data['Messages']))))

    data["full_conversation"] = "\n".join(list(filter(None, map(lambda x: "User: " + x['Value'] if x['UserId'] == audio_user_channel else"Agent: " + x['Value'] if x['UserId'] == audio_agent_channel else None, data['Messages']))))

    # Write results on Azure Blob Storage
    blob_client.upload_blob(json.dumps(data), overwrite=True)
