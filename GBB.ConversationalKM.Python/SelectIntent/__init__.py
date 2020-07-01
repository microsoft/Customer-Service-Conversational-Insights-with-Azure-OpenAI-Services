import logging
import azure.functions as func
import json
import os
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    # Connect to Azure Table Storage
    table_service = TableService(connection_string= os.environ['AzureWebJobsStorage'])
    table_service.create_table('intents') if not table_service.exists('intents') else None

    req_body = req.get_json()
    if req_body:
        # Create row to be saved on Azure Table Storage
        print(req_body.get('ConversationId'))
        data = req_body
        data["PartitionKey"] = req_body.get('ConversationId')
        data["RowKey"] = req_body.get('MessageId')           
        
        # Save row on Azure Table Storage
        table_service.insert_or_replace_entity('intents', data)
        return func.HttpResponse(f"Row {req_body.get('MessageId')} for {req_body.get('ConversationId')} added")
    else:
        return func.HttpResponse(
             "Please pass valid request body",
             status_code=400
        )