import logging
import azure.functions as func
import json
import os

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

        msg = value['data']['Messages']

        # Return object
        data = {
            "merged_content" : ""
        }

        EventType = ["MessageFromUser","MessageFromBotOrAgent"]
        data["merged_content"] = " ".join(list(filter(None, map(lambda x: x['Value'] if x['EventType'] in EventType else None, msg))))
        EventType = ["MessageFromUser"]
        data["merged_content_user"] = " ".join(list(filter(None, map(lambda x: x['Value'] if x['EventType'] in EventType else None, msg))))
        EventTypeUser = ["MessageFromUser"]
        EventTypeBotOrAgent = ["MessageFromBotOrAgent"]
        data["full_conversation"] = "\n".join(list(filter(None, map(lambda x: "User: " + x['Value'] if x['EventType'] in EventTypeUser else"Agent: " + x['Value'] if x['EventType'] in EventTypeBotOrAgent else None, msg))))


        # Extract Min and Max EventTime for conversation
        data["StartTime"] = min(list(map(lambda x: x['EventTime'], msg)))
        data["EndTime"]   = max(list(map(lambda x: x['EventTime'], msg)))

    except:
        return (
            {
            "recordId": recordId,
            "errors": [ { "message": "Could not complete operation for record." + str(msg) }   ]       
            })

    return ({
            "recordId": recordId,
            "data" : data
            })