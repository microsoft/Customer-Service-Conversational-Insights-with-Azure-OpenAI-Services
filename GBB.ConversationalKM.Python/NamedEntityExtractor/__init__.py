import logging
import azure.functions as func
import json
import os
import requests

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
        data = {}

        data['hotels'] = extract_NE(msg)


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

# Extract Named Entity from csv
def extract_NE(msg):
    full_text = list(filter(None,map(lambda x: x['Value'] if x['EventType'] in ("MessageFromUser", "MessageFromBotOrAgent") else None, msg)))
    full_text = " ".join(full_text)
    
    content = None
    url = os.environ.get('ner_hotel_file')
    content = str(requests.get(url).content.decode('utf-8'))

    items_to_find = content.split('\n') if content != None else []

    return list(filter(None,(map(lambda x: find(x, full_text), items_to_find))))


def find(search, text):
    return search if search.lower() in text.lower() else None