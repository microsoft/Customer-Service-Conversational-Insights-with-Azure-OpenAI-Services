import azure.cognitiveservices.speech as speechsdk
import time
import json
import pandas as pd
from azure.core.credentials import AzureKeyCredential
from azure.identity import DefaultAzureCredential 
from datetime import datetime, timedelta 

ai_services_key = ""
ai_services_region = "eastus"
download_path = "audio_files"

from azure.storage.filedatalake import (
    DataLakeServiceClient,
    DataLakeDirectoryClient,
    FileSystemClient
)
account_name = "nc2202storageaccount" #get_secrets_from_kv(key_vault_name, "ADLS-ACCOUNT-NAME")
account_key = "" #get_secrets_from_kv(key_vault_name, "ADLS-ACCOUNT-KEY")

data_file_system_client_name = "data" # container
audio_file_system_client_name = "data" # container

data_directory = "processed_transcripts/" # folder
audio_directory = "audio/" #'audio_transcripts/' # folder

# csv_file_name = '/call_transcripts_metadata/transcripts_metadata.csv'

account_url = f"https://{account_name}.dfs.core.windows.net"
# service_client = DataLakeServiceClient(account_url, credential=credential,api_version='2023-01-03') 
service_client = DataLakeServiceClient(account_url, credential=account_key,api_version='2023-01-03') 

# Create file system clients
data_file_system_client = service_client.get_file_system_client(data_file_system_client_name) 
audio_file_system_client = service_client.get_file_system_client(audio_file_system_client_name)   

data_paths = data_file_system_client.get_paths(path=data_directory)

audio_paths = audio_file_system_client.get_paths(path=audio_directory)

# Function to transcribe speech from an audio file
def transcribe_from_file(ai_services_key, ai_services_region, wav_file_path, conversation_id):
    # List to store the results of the transcription
    all_results = list()
    
    # Configure the speech service
    speech_config = speechsdk.SpeechConfig(subscription=ai_services_key, region=ai_services_region)
    speech_config.speech_recognition_language = "en-US"
    
    # Set up the audio configuration using the provided file path
    audio_config = speechsdk.audio.AudioConfig(filename=wav_file_path)
    
    # Create a conversation transcriber object
    conversation_transcriber = speechsdk.transcription.ConversationTranscriber(speech_config=speech_config, audio_config=audio_config)

    # Flag to indicate when to stop transcribing
    transcribing_stop = False

    # Callback for when the transcription session starts
    def conversation_transcriber_session_started_cb(evt: speechsdk.SessionEventArgs):
        # print('SessionStarted event')
        pass

    # Callback to signal to stop continuous recognition
    def stop_cb(evt: speechsdk.SessionEventArgs):
        nonlocal transcribing_stop
        transcribing_stop = True
        # Log the session ID
        # print(f"Stopping transcription for session id: {evt.session_id}")

        # Check if the event has a result attribute
        if hasattr(evt, 'result'):
            # If the result reason is cancellation, provide the cancellation details
            if evt.result.reason == speechsdk.ResultReason.Canceled:
                cancellation_details = speechsdk.CancellationDetails(evt.result)
                # print(f"Transcription was stopped due to cancellation: {cancellation_details.reason}")
                if cancellation_details.reason == speechsdk.CancellationReason.Error:
                    print(f"Error details: {cancellation_details.error_details}")
            # If the result reason is EndOfStream, indicate the audio stream has ended
            elif evt.result.reason == speechsdk.ResultReason.EndOfStream:
                # print("Transcription stopped because the end of the audio stream was reached.")
                pass
            # If the result reason is NoMatch, indicate no speech could be recognized
            elif evt.result.reason == speechsdk.ResultReason.NoMatch:
                print("Transcription stopped because no speech could be recognized.")
            # For any other reason, log the result reason
            else:
                print(f"Transcription stopped for an unknown reason: {evt.result.reason}")
        else:
            # If there is no result attribute, log that the reason is unknown
            # print("Transcription stopped, but no additional information is available.")
            pass

    # Callback for when the transcription is canceled
    def conversation_transcriber_recognition_canceled_cb(evt: speechsdk.SessionEventArgs):
        # print("Canceled event")
        # Access the cancellation details from the event
        cancellation_details = speechsdk.CancellationDetails(evt.result)
        # Print the reason for the cancellation
        # print(f"Canceled event: {cancellation_details.reason}")

        # If there was an error, print the error details
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            print(f"Error details: {cancellation_details.error_details}")


    # Callback for when the transcription session stops
    def conversation_transcriber_session_stopped_cb(evt: speechsdk.SessionEventArgs):
        # Print the session stopped event with the session id for reference
        # print(f"SessionStopped event for session id: {evt.session_id}")
        pass

        # If the event has a result attribute, we can check if there are any additional details
        if hasattr(evt, 'result') and evt.result:
            # Check if the result has a reason attribute and print it
            if hasattr(evt.result, 'reason'):
                print(f"Reason for stop: {evt.result.reason}")

            # If the result is a cancellation, print the cancellation details
            if evt.result.reason == speechsdk.ResultReason.Canceled:
                cancellation_details = speechsdk.CancellationDetails(evt.result)
                print(f"Cancellation reason: {cancellation_details.reason}")
                if cancellation_details.reason == speechsdk.CancellationReason.Error:
                    print(f"Error details: {cancellation_details.error_details}")


    # Handler for the final result of the transcription
    def handle_final_result(evt):
        nonlocal all_results
      
        # Check if the event's result is speech recognition with a recognized phrase
        if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
            # Parse the JSON result from the transcription
            r = json.loads(evt.result.json)
            all_results.append([conversation_id,
                                r["Id"],
                                r["DisplayText"],
                                r["Offset"],
                                r["Duration"],
                                r["Channel"],
                                r["Type"],
                                r["SpeakerId"]
                                ])
        # If the result reason is not recognized speech, log that no recognized speech was found
        else:
            print("No recognized speech was found.")


    # Connect the callbacks to the events fired by the conversation transcriber
    conversation_transcriber.transcribed.connect(handle_final_result)
    conversation_transcriber.session_started.connect(conversation_transcriber_session_started_cb)
    conversation_transcriber.session_stopped.connect(conversation_transcriber_session_stopped_cb)
    conversation_transcriber.canceled.connect(conversation_transcriber_recognition_canceled_cb)
    conversation_transcriber.session_stopped.connect(stop_cb)
    conversation_transcriber.canceled.connect(stop_cb)

    # Start the asynchronous transcription
    conversation_transcriber.start_transcribing_async()

    # Wait for the transcription to complete
    while not transcribing_stop:
        time.sleep(.5)

    # Stop the asynchronous transcription
    conversation_transcriber.stop_transcribing_async()
    # Return the list of transcribed results
    return(all_results)

import uuid
import os
paths = audio_file_system_client.get_paths(path=audio_directory)
wav_files = []
count = 0
for path in paths: 
    # print(path.name)
    file_client = audio_file_system_client.get_file_client(path.name)
    download_file_path = os.path.join(download_path, os.path.basename(path.name))
    
    with open(download_file_path, "wb") as download_file:
        data_file = file_client.download_file()
        data_file.readinto(download_file)
    wav_files.append(download_file_path)

    wav_file_path = download_file_path
    file_name = wav_file_path.split('/')[-1]

    r = transcribe_from_file(ai_services_key,ai_services_region,wav_file_path,file_name)
    
    json_obj = {}
    content = ""
    start_time = file_name.replace(".wav", "")[-19:]
    
    timestamp_format = "%Y-%m-%d %H_%M_%S"  # Adjust format if necessary
    start_timestamp = datetime.strptime(start_time, timestamp_format)
    start_date = start_timestamp.strftime("%Y-%m-%d")

    # Add milliseconds
    conversation_id = file_name.split('convo_', 1)[1].split('_')[0]
    duration = 0
    endTime = ""
    if len(r) != 0:
        for i in r:
            duration += i[4]
            content += i[2] + " "
            print(duration)
        conversationRow = {
            "ClientId": "10001",
            "ConversationId": conversation_id,
            "ConversationDate": start_date,
            "StartTime": start_time,
            "EndTime": str(start_timestamp + timedelta(milliseconds=duration)),
            "Duration": duration/1000,
            "Content": content,
            }
        #Save the conversation to a file
        filename = 'convo_' + str(conversation_id) + '_'+ str(start_time) + '.json'
        processed_path = 'stt_processed_files/'
        json.dump(conversationRow, open(processed_path + filename, 'w'), indent=4)
        # destination_file_name = data_directory + filename
        # destination_file_client = data_file_system_client.get_file_client(destination_file_name)
        # # print(conversationRow)
        # destination_file_client.upload_data(json.dumps(conversationRow, indent=4) , overwrite=True)

        # # df_columns = ["conversation_id","Id","DisplayText","Offset","Duration","Channel","Type","SpeakerId"]
        # # df_conv = pd.DataFrame(r, columns=df_columns)
        # # df_conv['row_id'] = [str(uuid.uuid4()) for i in range(len(df_conv))]
        # # print('df_conv')
        # # print(df_conv['DisplayText'])
    count += 1
    if count == 5:
        break