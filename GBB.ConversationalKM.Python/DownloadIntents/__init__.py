import logging
import json
import azure.functions as func
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity
import pandas as pd
import os

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    # Connect to Azure Table Storage
    table_service = TableService(connection_string= os.environ['AzureWebJobsStorage'])
    table_service.create_table('intents') if not table_service.exists('intents') else None

    # Retrieve entities from Azure Table Storage
    entries = list(table_service.query_entities('intents'))
    # Convert to pandas dataframe and output as csv
    dataframe = pd.DataFrame(entries)
    list_of_dictionaries = dataframe.to_dict('records')

    # Set HTTP Response header and mimetype
    mimetype = 'text/csv'
    headers = {
        'Content-Disposition' : 'attachment; filename="export.csv"'
    } 

    # Set response body
    body = dataframe.to_csv(index=False)

    return func.HttpResponse(body = body, mimetype = mimetype, headers = headers)
    

