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

        # Read custom dimensions from app config
        dimensions = os.environ.get('dimensions')

        # Manage Entities value
        for x in msg:
            if x.get('CustomProperties').get('entities') != None:
                x['CustomProperties']['entities'] = json.loads(x['CustomProperties']['entities'])

        # Return object
        data = {}
        if dimensions != None: 
            for dim in dimensions.split(','):
                subkey = dim.split('.')
                if len(subkey) == 2:
                    data[subkey[1]] = list(filter(None, set(map(lambda x: x['CustomProperties'].get(subkey[0]).get(subkey[1]) if x['CustomProperties'].get(subkey[0]) != None else None, msg))))
                else:
                    data[subkey[0]] = list(filter(None, set(map(lambda x: x['CustomProperties'].get(subkey[0]), msg))))

                # data[dim] = list(filter(None, set(map(lambda x: x['CustomProperties'].get(dim).get(subkey[1]), msg)))) if len(subkey) == 2 else list(filter(None, set(map(lambda x: x['CustomProperties'].get(dim), msg))))
                # data[dim] = list(filter(None, set(map(lambda x: x['CustomProperties'].get(dim), msg))))


        # Get Value from specific events, read from app config
        defined_events = os.environ.get('defined_events')
        if defined_events != None:
            for event in defined_events.split(','):
                de = list(filter(lambda x: x['EventType'] == event, msg)) # Select only event with specific EventType
                data[event] = list(filter(None, set(map(lambda x: x['Value'], de)))) # Extract Value for selected event


    except ValueError as e:
        return (
            {
            "recordId": recordId,
            "errors": [ { "message": f"Could not complete operation for record: {recordId} with error: {str(e)}" }   ]       
            })

    return ({
            "recordId": recordId,
            "data" : data
            })