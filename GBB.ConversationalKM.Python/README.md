# Conversational Knowledge Mining Architecture

PREPROCESSING:  

    TelemetryDataExtractor:

        * Description: 
        Azure Function to extract Bot Telemetry data, collapsing all messages in a single JSON file for any conversation  

        * Input: 
            -   Telemtry data from Bot Framework
        * Output: 
            -   Single JSON file with all data related to a single conversation
        * App Settings:



CUSTOM SKILLS :  

    MessagesMerge:

        * Description: 
        Collapse all text messages from Bot / Agent and User to a single field
          
        * Input: /
            -   document/Messages -> all the messages extracted from a conversation

        * Output:
            -   /document/merged_content -> Joined text from user and bot/agent messages
            -   /document/merged_content_user -> Joined text from user messages
            -   /document/StartTime -> Conversation start time
            -   /document/EndTime -> Conversation end time
        * App Settings:


    NamedEntityExtractor:

        * Description: Extract named entity extraction
          
        * Input:
            -   /document/Messages -> all the messages extracted from a conversation
        * Output:
            -   /document/hotels -> List of hotels identified in the text
        * App Settings:
            -   ner_hotel_file -> Shared Access Signature / link to CSV with list of entities to extract


    CustomDimensions:

        * Description: Extract CustomProperties from conversation messages
          
        * Input: 
            -   /document/Messages -> all the messages extracted from a conversation
        * Output:
            -   /document/x1
            -   /document/...
            -   /document/...
            -   /document/...
            -   /document/xN
            x1, ..., xN can be defined as App Settings. See below.

        * App Settings:
            -   dimensions -> List of dimension to extract from object CustomDimensions from Bot framework telemetry e.g mainScenario, channel, entities.sentiment (for subfields)
            -   defined_events -> List of events to extract the Value field from processed telemetry e.g. IntentRecognized 


    EvaluateConversation:

        * Description: Evaluate conversation on different parameters, starting from its messages
          
        * Input:
            -   document/messages
        * Output:
            -   document/default_dialog -> Counter of default dialog instances in the conversation
            -   document/feedback -> Check if the Bot requested a feedback
            -   document/Leaf -> Check if the Bot successfully closed the conversation, reaching a Leaf in the dialog flow
            -   document/avg_sentiment -> Compute average sentiment over the overall conversation
            -   document/evaluation_score -> Conversation evaluation procivede by user
            -   document/profanity -> Detect any profanity in the conversation text from the user
        * App Settings:
            -   profanity_lang -> three letter lowercase language code for Cognitive Moderator API e.g. ita
            -   cognitive_services_region -> Cognitive Service resource region e.g. westus / westeurope




            
