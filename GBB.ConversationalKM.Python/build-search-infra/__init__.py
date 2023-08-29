import datetime, logging, os, json, requests, csv
import azure.functions as func
from azure.cosmosdb.table.tableservice import TableService

def create_data_source():
    #   GET https://[service name].search.windows.net/datasources/[data source name]?api-version=[api-version]&includeConnectionString=[includeConnectionString]
    #       Content-Type: application/json  
    #       api-key: [admin key]
    url = f"https://{os.getenv('search_account')}.search.windows.net/datasources/{os.getenv('search_data_source')}?api-version={os.getenv('search_api_version')}"

    headers = {
        "Content-Type": "application/json",
        "api-key": os.getenv('search_api_key')
    }

    r = requests.get(url, headers=headers)

    if r.status_code == 404:
        #   POST https://[service name].search.windows.net/datasources?api-version=[api-version]  
        #       Content-Type: application/json  
        #       api-key: [admin key]  
        url = f"https://{os.getenv('search_account')}.search.windows.net/datasources?api-version={os.getenv('search_api_version')}"

        with open(r'./build-search-infra/infrastructure/datasource.json') as file:
            body = json.load(file)

        # Check these values
        body['name'] = os.getenv('search_data_source')
        body['credentials']['connectionString'] = os.getenv('connection_string')
        body['container']['name'] = os.getenv('cognitive_search_data_source_container')


        r = requests.post(url, headers=headers, json=body)

    else:
        logging.info(f"Data source set up done. {r.status_code}")

def create_index():
    #   GET https://[servicename].search.windows.net/indexes/[index name]?api-version=[api-version]  
    #       Content-Type: application/json  
    #       api-key: [admin key]   

    url = f"https://{os.getenv('search_account')}.search.windows.net/indexes/{os.getenv('search_index')}?api-version={os.getenv('search_api_version')}"

    headers = {
        "Content-Type": "application/json",
        "api-key": os.getenv('search_api_key')
    }

    r = requests.get(url, headers=headers)

    if r.status_code == 404:
    #   PUT https://[servicename].search.windows.net/indexes/[index name]?api-version=[api-version]
    #       Content-Type: application/json
    #       api-key: [admin key]

        url = f"https://{os.getenv('search_account')}.search.windows.net/indexes/{os.getenv('search_index')}?api-version={os.getenv('search_api_version')}"

        with open(f'./build-search-infra/infrastructure/{os.getenv("deployment_type")}-index.json') as file:
            body = json.load(file)

        body['name'] = os.getenv('search_index')

        if len(os.getenv('OPENAI_PROMPT_KEYS', [])) > 0:
            for field in os.getenv('OPENAI_PROMPT_KEYS').replace(' ','').split(','):
                body["fields"].append({
                    "name": field.split(':')[0],
                    "type": field.split(':')[1],
                    "key": False,
                    "retrievable": True,
                    "searchable": True,
                    "filterable": True,
                    "sortable": True,
                    "facetable": True if field.split(':')[2].lower() == 'true' else False,
                    "analyzer": "standard.lucene"
                })

        r = requests.put(url, headers=headers, json=body)
        logging.info(r.json())

    else:
        logging.info(f"Index set up done. {r.status_code}")

def create_skillset():   
    #   GET https://[service name].search.windows.net/skillsets/[skillset name]?api-version=[api-version]
    #       Content-Type: application/json  
    #       api-key: [admin key]

    url = f"https://{os.getenv('search_account')}.search.windows.net/skillsets/{os.getenv('search_skillset')}?api-version={os.getenv('search_api_version')}"

    headers = {
        "Content-Type": "application/json",
        "api-key": os.getenv('search_api_key')
    }

    r = requests.get(url, headers=headers)

    if r.status_code == 404:
    #   PUT https://[servicename].search.windows.net/skillsets/[skillset name]?api-version=[api-version]
    #       Content-Type: application/json  
    #       api-key: [admin key]

        url = f"https://{os.getenv('search_account')}.search.windows.net/skillsets/{os.getenv('search_skillset')}?api-version={os.getenv('search_api_version')}"

        with open(f'./build-search-infra/infrastructure/{os.getenv("deployment_type")}-skillset.json') as file:
            body = json.load(file)

        body['name'] = os.getenv('search_skillset')
        body['cognitiveServices']['key'] = os.getenv('cognitive_services_key')
        body['knowledgeStore']['storageConnectionString'] = os.getenv('connection_string')
        body['knowledgeStore']['projections'][0]['objects'][0]['storageContainer'] = os.getenv('cognitive_search_knowledge_store_container_object')
        body['knowledgeStore']['projections'][0]['files'][0]['storageContainer'] = os.getenv('cognitive_search_knowledge_store_container_files')
        body['knowledgeStore']['projections'][0]['tables'][0]['tableName'] = os.getenv('cognitive_search_knowledge_store_table_document')
        body['knowledgeStore']['projections'][0]['tables'][1]['tableName'] = os.getenv('cognitive_search_knowledge_store_table_keyphrases')

        for skill in body['skills']:
            if skill["@odata.type"] == "#Microsoft.Skills.Custom.WebApiSkill":
                skill["uri"] = skill["uri"].replace('{function_name}', os.getenv('function_name')).replace('{code}', os.getenv('function_key'))
                skill["uri"] = skill["uri"].replace('{openai_function_name}', os.getenv('openai_function_name')).replace('{openai_function_key}', os.getenv('openai_function_key'))

        r = requests.put(url, headers=headers, json=body)
        logging.info(r.json())

    else:
        logging.info(f"Skillset set up done. {r.status_code}")

def create_indexer():
    #   GET https://[service name].search.windows.net/indexers/[indexer name]?api-version=[api-version]  
    #       Content-Type: application/json  
    #       api-key: [admin key]

    url = f"https://{os.getenv('search_account')}.search.windows.net/indexers/{os.getenv('search_indexer')}?api-version={os.getenv('search_api_version')}"

    headers = {
        "Content-Type": "application/json",
        "api-key": os.getenv('search_api_key')
    }

    r = requests.get(url, headers=headers)

    if r.status_code == 404:
    #   PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=[api-version]
    #       Content-Type: application/json  
    #       api-key: [admin key]

        url = f"https://{os.getenv('search_account')}.search.windows.net/indexers/{os.getenv('search_indexer')}?api-version={os.getenv('search_api_version')}"

        with open(f'./build-search-infra/infrastructure/{os.getenv("deployment_type")}-indexer.json') as file:
            body = json.load(file)

        body['name'] = os.getenv('search_indexer')
        body['dataSourceName'] = os.getenv('search_data_source')
        body['skillsetName'] = os.getenv('search_skillset')
        body['targetIndexName'] = os.getenv('search_index')

        r = requests.put(url, headers=headers, json=body)
        logging.info(r.json())

    else:
        logging.info(f"Indexer set up done. {r.status_code}")

def push_sample_data():
    query_fiter = f"PartitionKey eq 'convs-quality'"    
    table_service = TableService(connection_string= os.getenv('connection_string'))
    if not table_service.exists(os.environ.get('table_sample_data')):
        table_service.create_table(os.environ.get('table_sample_data'))
        with open(r'./build-search-infra/infrastructure/botconvevals.csv','r') as csvfile:
            reader = csv.DictReader(csvfile)
            data = list(reader)
            for x in data:
                x['userSurveyRating'] = int(x['userSurveyRating']) if x['userSurveyRating'] != '' else 0
                x['wizardSurveyTaskSuccessful'] = bool(x['userSurveyRating'])
        results = list(map(lambda x: table_service.insert_entity(os.environ.get('table_sample_data'), x), data))
    logging.info('Table data uploaded')
    

def main(mytimer: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()

    if mytimer.past_due:
        logging.info('The timer is past due!')
    
    create_data_source()
    create_index()
    create_skillset()
    create_indexer()
    # push_sample_data()

    logging.info('Python timer trigger function ran at %s', utc_timestamp)
