import logging
import azure.functions as func
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import json
from operator import itemgetter
import os

def main(myblob: func.InputStream):
    logging.info(f"Python blob trigger function processed blob \n"
                 f"Name: {myblob.name}\n"
                 f"Blob Size: {myblob.length} bytes")

    connection_string = os.environ['conversationalkm_STORAGE']
    container = os.environ['telemetry_processed']

    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    # Read Blob and split it by new lines
    INPUT_data = myblob.read().decode("utf-8").split('\n')

    # Processing
    messages = []
    for line in INPUT_data:
        try:
            messages.append(process_line(json.loads(line)))
        except ValueError as e:
            print(e)
    messages = list(filter(None, messages))
    # messages

    # Extract all ConversationId
    conversation_ids = set(map(lambda x: x['ConversationId'], messages))
    for conv in conversation_ids:
        save_conversation(conv, messages= list(filter(lambda x: x['ConversationId'] == conv,messages)), blob_service_client=blob_service_client, container=container)


# Support Functions

# Event type 
event_type = {
        "BotMessageSend" : "MessageFromBotOrAgent",
        "BotMessageReceived": "MessageFromUser",
        "LuisResult": "IntentRecognized"
    }

# Value for specific Event Type
message_value = {
    "BotMessageSend" : "text",
    "BotMessageReceived" : "text",
    "LuisResult" : "intent"
}

# Process single line in the JSON telemetry
def process_line(line):
    if line['event'][0]['name'] in list(event_type.keys()):
        message = {}
        message['Id'] = line['internal']['data']['id']
        message['ReferenceId'] = None
        message['EventType'] = event_type.get(line['event'][0]['name'])
        message['EventTime'] = line['context']['data']['eventTime']
        custom_dimensions = { k : v for x in line['context']['custom']['dimensions'] for k,v in x.items()}
        message['ConversationId'] = line['context']['session']['id']
        # message['ConversationId'] = custom_dimensions.get('conversationId')
        message['Value'] = custom_dimensions.get(message_value.get(line['event'][0]['name']))
        message['UserId'] = custom_dimensions.get('userId', None)
        message['CustomProperties'] = custom_dimensions
        message['CustomProperties']['sentiment'] = message['CustomProperties'].pop('TXTANALYTICSscore', None)
        return message
    return None
    
# Update existing conversation with new message
def update_conversation(data, messages):
    # Extract existing conversation Messages
    o_msg = data['Messages']
    # Filter all None messages
    messages = list(filter(None, messages))

    # If no previous conversation Messages -> Return current Messages
    if len(o_msg) == 0:
        return messages

    # Extract all conversation Messages Id
    o_ids = list(map(lambda x: x.get('Id'), o_msg))

    # For each new message check if already present and delete it. Then add to list
    for m in messages:
        if (m.get('Id') in o_ids):
            o_msg.remove(list(filter(lambda x: x.get('Id') == m.get('Id'), o_msg))[0])
            print(f"Found match for message {m.get('Id')}")
        else:
            print(f"Not found match for message {m.get('Id')}")
        o_msg.append(m)

    return o_msg

# Process Full conversation
def process_conversation(messages):
    # Remove all None objects
    messages = list(filter(None, messages))
    # Order messages by EventTime
    messages = sorted(messages, key=itemgetter('EventTime'), reverse= False) 

    # Generate ReferenceId for IntentRecognized messages and MessageFromBotOrAgent
    for i, msg in enumerate(messages):
        j = i - 1 if i > 0 else 0
        if msg['EventType'] in ('IntentRecognized', 'MessageFromBotOrAgent'):
            while messages[j]['EventType'] != 'MessageFromUser' and j > 0:
                j = j - 1
            # print(messages[j]['Id'])
            msg['ReferenceId'] = messages[j]['Id'] if j > 0 else None

    return messages

# Save conversation in Azure Blob Storage
def save_conversation(conversation_id, messages, blob_service_client, container):
    # Define structure for conversational data
    data = {
        "ConversationId" : conversation_id,
        "Messages" : []
    }
    blob = f"{conversation_id}.json"
    # Read already existing conversation from Azure Blob Storage
    blob_client = blob_service_client.get_blob_client(container=container, blob=blob)
    try:
        data = json.loads(blob_client.download_blob().readall().decode("utf-8"))
        print(f"Found blob for conversation {conversation_id}")
    except:
        print(f"Blob not found for conversation {conversation_id}")

    # Update conversation in Blob Storage with new messages
    updated_messages = update_conversation(data, messages)

    # Process Conversation to enrich content
    data['Messages'] = process_conversation(updated_messages)

    # Write results on Azure Blob Storage
    blob_client.upload_blob(json.dumps(data), overwrite=True)