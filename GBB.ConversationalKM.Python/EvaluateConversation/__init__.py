import logging
import azure.functions as func
import json
import os
from collections import Counter
import requests
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        body = json.dumps(req.get_json())
    except ValueError:
        return func.HttpResponse(
             "Invalid body",
             status_code=400
        )
    
    if body:
        result = compose_response(body)
        return func.HttpResponse(result, mimetype="application/json")
    else:
        return func.HttpResponse(
             "Invalid body",
             status_code=400
        )


def compose_response(json_data):
    values = json.loads(json_data)['values']
    
    # Prepare the Output before the loop
    results = {}
    results["values"] = []
    
    for value in values:
        output_record = transform_value(value)
        if output_record != None:
            results["values"].append(output_record)
    return json.dumps(results, ensure_ascii=False)

## Perform an operation on a record
def transform_value(value):
    try:
        recordId = value['recordId']
    except AssertionError  as error:
        return None

    # Validate the inputs
    try:         
        assert ('data' in value), "'data' field is required."
        data = value['data']        
        assert ('Messages' in data), "'Messages' field is required in 'data' object."
    except AssertionError  as error:
        return (
            {
            "recordId": recordId,
            "errors": [ { "message": "Error:" + error.args[0] }   ]       
            })

    try:                
        # Here you could do something more interesting with the inputs

        msg = value['data']

        # Return object
        data = {}

        # Count Default dialog occurrencies
        data['default_dialog'] = get_default_dialog(msg)
        logging.info('get_default_dialog')

        # Check if Feedback dialog is present
        data['feedback'] = get_feedback_dialog(msg)
        logging.info('get_feedback_dialog')

        # Check if a leaf node has been reached
        data['Leaf'] = get_leaf(msg)
        logging.info('get_leaf')

        # Compute Average sentiment
        data['avg_sentiment'] = get_sentiment(msg)
        logging.info('get_sentiment')

        # Extract evaluation            
        data['evaluation_score'] = get_evaluation(msg)
        logging.info('get_evaluation')

        # Check for profanity
        data['profanity'] = get_profanity(msg)
        logging.info('get_profanity')

        # Create variable for conversation evaluation
        default_dialog = data['default_dialog']
        feedback_dialog = 1 if data['feedback'] else 0
        evaluation = data['evaluation_score']
        leaf = 1 if data['Leaf'] else 0
        sentiment = data['avg_sentiment'] * 4 if data['avg_sentiment'] is not None else None
        profanity = 1 if data['profanity'] else 0
        conversation_quality = chat_quality(default_dialog= default_dialog, feedback_dialog= feedback_dialog, evaluation= evaluation, leaf= leaf, sentiment = sentiment, profanity= profanity)
        data['conversation_quality'] = conversation_quality


    except Exception as e:
        return (
            {
            "recordId": recordId,
            "errors": [ { "message": f"Could not complete operation for record {recordId} Error: {str(e)}"}   ]       
            })

    return ({
            "recordId": recordId,
            "data" : data
            })

# Map sentiment to range
def map_to_range(sentiment):
    return round(sentiment * 4) / 4

# Count Default dialog occurrencies
def get_default_dialog(msg):
    msg = msg['Messages']
    return dict(Counter(list(filter(None, map(lambda x: x['CustomProperties'].get('scenario'), msg))))).get('canthelp') # Count Default Dialog
    
# Check if Feedback dialog is present
def get_feedback_dialog(msg):
    msg = msg['Messages']
    return True if dict(Counter(list(filter(None, map(lambda x: x['CustomProperties'].get('scenario'), msg))))).get('thankyou') is not None else False

# Extract evaluation            
def get_evaluation(msg):
    conversation_id = msg['ConversationId']
    msg = msg['Messages']
    connection_string = os.environ['conversationalkm_STORAGE']
    # Create connection to Azure Table Storage
    table_service = TableService(connection_string= connection_string)
    # Filter for Conversation Id
    query_fiter = f"PartitionKey eq 'convs-quality' and RowKey eq '{conversation_id}'"    
    evaluation = list(table_service.query_entities(os.environ.get('table_sample_data'), filter= query_fiter))
    return int(evaluation[0].get('userSurveyRating')) if len(evaluation) > 0 and evaluation[0].get('userSurveyRating') != None else None


# Check if a leaf node has been reached
def get_leaf(msg):
    conversation_id = msg['ConversationId']
    msg = msg['Messages']
    connection_string = os.environ['conversationalkm_STORAGE']
    # Create connection to Azure Table Storage
    table_service = TableService(connection_string= connection_string)
    # Filter for Conversation Id
    query_fiter = f"PartitionKey eq 'convs-quality' and RowKey eq '{conversation_id}'"    
    evaluation = list(table_service.query_entities(os.environ.get('table_sample_data'), filter= query_fiter))
    return int(evaluation[0].get('wizardSurveyTaskSuccessful')) if len(evaluation) > 0 and evaluation[0].get('wizardSurveyTaskSuccessful') != None else None


# Compute Average sentiment
def get_sentiment(msg):
    msg = msg['Messages']
    sentiment = (list(filter(None, map(lambda x: x['CustomProperties'].get('sentiment'), msg)))) # Average Sentiment
    sentiment = list(map(lambda x: float(x), sentiment))
    return map_to_range(sum(sentiment) / len(sentiment)) if len(sentiment) > 0 else None

# Check user text for profanity
def get_profanity(msg):
    msg = msg['Messages']
    full_text = list(filter(None,map(lambda x: x['Value'] if x['EventType'] == "MessageFromUser" else None, msg)))
    full_text = " ".join(full_text)
    full_text

    # Call Cognitive Services Moderator API
    headers = {
        'Content-Type': 'text/plain',
        'Ocp-Apim-Subscription-Key': os.environ['cognitive_services_key']
    }

    url = f"https://{os.environ['cognitive_services_region']}.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessText/Screen?language={os.environ['profanity_lang']}"
    resp = requests.post(url, headers= headers, data= full_text.encode('utf-8'))
    resp = resp.json()
    terms = resp.get('Terms', None)

    return True if terms is not None else False

# Function to compute conversation quality
def chat_quality(default_dialog = 0, feedback_dialog = 0, evaluation = 0, leaf = 0, sentiment = 4, profanity = 0, coeffs= [1,1,1,1,4,5], default_score= 5, min_score=1, max_score= 5):
    # default_dialog: Detected default dialog in conversation
    # feedback_dialog: Detected Feedback dialog
    # evaluation: Explicit evaluation from customer
    # leaf: IsLeaf in conversation
    # sentiment: average sentiment in conversation
    # profanity: profanity detected

    if len(coeffs) != 6:
        logging.info('Coeffs list incorrect. Proceeding with default values')
        coeffs = [1,1,1,1,4,5]

    logging.info(f"default_dialog = {default_dialog}, feedback_dialog = {feedback_dialog}, evaluation = {evaluation}, leaf = {leaf}, sentiment = {sentiment}, profanity = {profanity}")

    score = default_score
    score = coeffs[2] * evaluation if evaluation is not None and evaluation > 0 else default_score
    score -= coeffs[0] * default_dialog if default_dialog is not None else 0
    score += coeffs[1] * feedback_dialog if feedback_dialog is not None else 0
    score += coeffs[3] * leaf if leaf is not None else 0
    score -= (coeffs[4] - sentiment) if sentiment is not None else 0
    score -= (coeffs[5] * profanity) if profanity is not None else 0
    
    # Adjustment
    score = min_score if score < min_score else score
    score = max_score if score > max_score else score

    # Return label
    return score_label.get(score)

# Try to converst string to int. Return default value if not possible
def safe_int(x, default= 0):
    try:
        return int(x)
    except ValueError:
        print(f"Error converting to int. Return default value {default}")
        return default

# Covert string to bool
def str_to_bool(x):
    return False if x in ("false", "False", None, False) else True

# Dictionary for chat classification
score_label = {
    1 : 'Low',
    2 : 'Medium',
    3 : 'Medium',
    4 : 'High',
    5 : 'High'
}
