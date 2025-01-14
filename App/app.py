import logging
import os
import time
import uuid
import aiohttp
import requests
from azure.identity.aio import (DefaultAzureCredential,
                                get_bearer_token_provider)
from dotenv import load_dotenv
from openai import AsyncAzureOpenAI
from quart import Quart, jsonify, request, send_from_directory
from quart_cors import cors

from backend.auth.auth_utils import get_authenticated_user_details
from backend.history.cosmosdbservice import CosmosConversationClient
import openai
import json
import re
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Quart(__name__)
app = cors(app, allow_origin=["http://localhost:3000", "http://127.0.0.1:5000"])

# Serve index.html from the React build folder
@app.route("/")
async def serve_index():
    return await send_from_directory(
        os.path.join(app.root_path, "frontend", "build"), "index.html"
    )


@app.route("/favicon.ico")
async def favicon():
    return await send_from_directory(
        os.path.join(app.root_path, "frontend", "build", "static"),
        "favicon.ico",
        mimetype="image/x-icon",
    )


# Serve static files (JS, CSS, images, etc.)
@app.route("/assets/<path:path>")
async def assets(path):
    return await send_from_directory(
        os.path.join(app.root_path, "frontend", "build", "static", "assets"), path
    )


USER_AGENT = "GitHubSampleWebApp/AsyncAzureOpenAI/1.0.0"
# Load environment variables
CHART_DASHBOARD_URL = os.getenv("CHART_DASHBOARD_URL", "")
CHART_DASHBOARD_FILTERS_URL = os.getenv("CHART_DASHBOARD_FILTERS_URL", "")
USE_GRAPHRAG = os.getenv("USE_GRAPHRAG", "false").strip().lower() == "true"
GRAPHRAG_URL = os.getenv("GRAPHRAG_URL", "")
RAG_URL = os.getenv("RAG_URL", "")
RAG_CHART_URL = os.getenv("RAG_CHART_URL", "")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY", "")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_RESOURCE = os.getenv("AZURE_OPENAI_RESOURCE")
AZURE_OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
AZURE_OPENAI_PREVIEW_API_VERSION = os.getenv("AZURE_OPENAI_PREVIEW_API_VERSION")
# Chat History CosmosDB Integration Settings
USE_CHAT_HISTORY_ENABLED = (
    os.getenv("USE_CHAT_HISTORY_ENABLED", "false").strip().lower() == "true"
)
AZURE_COSMOSDB_DATABASE = os.environ.get("AZURE_COSMOSDB_DATABASE")
AZURE_COSMOSDB_ACCOUNT = os.environ.get("AZURE_COSMOSDB_ACCOUNT")
AZURE_COSMOSDB_CONVERSATIONS_CONTAINER = os.environ.get(
    "AZURE_COSMOSDB_CONVERSATIONS_CONTAINER"
)
AZURE_COSMOSDB_ACCOUNT_KEY = os.environ.get("AZURE_COSMOSDB_ACCOUNT_KEY")
AZURE_COSMOSDB_ENABLE_FEEDBACK = (
    os.environ.get("AZURE_COSMOSDB_ENABLE_FEEDBACK", "false").lower() == "true"
)


if USE_CHAT_HISTORY_ENABLED:
    CHAT_HISTORY_ENABLED = (
        AZURE_COSMOSDB_ACCOUNT
        and AZURE_COSMOSDB_DATABASE
        and AZURE_COSMOSDB_CONVERSATIONS_CONTAINER
    )


def init_cosmosdb_client():
    cosmos_conversation_client = None
    if CHAT_HISTORY_ENABLED:
        try:
            cosmos_endpoint = (
                f"https://{AZURE_COSMOSDB_ACCOUNT}.documents.azure.com:443/"
            )

            if not AZURE_COSMOSDB_ACCOUNT_KEY:
                credential = DefaultAzureCredential()
            else:
                credential = AZURE_COSMOSDB_ACCOUNT_KEY

            cosmos_conversation_client = CosmosConversationClient(
                cosmosdb_endpoint=cosmos_endpoint,
                credential=credential,
                database_name=AZURE_COSMOSDB_DATABASE,
                container_name=AZURE_COSMOSDB_CONVERSATIONS_CONTAINER,
                enable_message_feedback=AZURE_COSMOSDB_ENABLE_FEEDBACK,
            )
        except Exception as e:
            logging.exception("Exception in CosmosDB initialization", e)
            cosmos_conversation_client = None
            raise e
    else:
        logging.debug("CosmosDB not configured")

    return cosmos_conversation_client

# Initialize Azure OpenAI Client
def init_openai_client():
    azure_openai_client = None
    try:
        if not AZURE_OPENAI_ENDPOINT and not AZURE_OPENAI_RESOURCE:
            raise Exception(
                "AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_RESOURCE is required"
            )

        endpoint = (
            AZURE_OPENAI_ENDPOINT
            if AZURE_OPENAI_ENDPOINT
            else f"https://{AZURE_OPENAI_RESOURCE}.openai.azure.com/"
        )

        api_key = AZURE_OPENAI_API_KEY
        ad_token_provider = None
        if not api_key:
            logging.debug("No AZURE_OPENAI_API_KEY found, using Azure AD auth")
            ad_token_provider = get_bearer_token_provider(
                DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
            )

        deployment = AZURE_OPENAI_DEPLOYMENT_NAME
        if not deployment:
            raise Exception("AZURE_OPENAI_MODEL is required")

        default_headers = {"x-ms-useragent": USER_AGENT}

        azure_openai_client = AsyncAzureOpenAI(
            api_version=AZURE_OPENAI_PREVIEW_API_VERSION,
            api_key=api_key,
            azure_ad_token_provider=ad_token_provider,
            default_headers=default_headers,
            azure_endpoint=endpoint,
        )

        return azure_openai_client
    except Exception as e:
        logging.exception("Exception in Azure OpenAI initialization", e)
        raise e


@app.route("/api/fetchChartData", methods=["GET"])
async def fetch_chart_data():
    try:
        response = requests.get(CHART_DASHBOARD_URL)
        chart_data = response.json()
        return jsonify(chart_data)
    except Exception as e:
        print(f"Error in fetch_chart_data: {str(e)}")
        return jsonify({"error": "Failed to fetch chart data"}), 500


@app.route("/api/fetchChartDataWithFilters", methods=["POST"])
async def fetch_chart_data_with_filters():
    body_data = await request.get_json()
    # print(body_data)
    try:
        response = requests.post(CHART_DASHBOARD_URL, json=body_data)
        chart_data = response.json()
        print(chart_data)
        return jsonify(chart_data)
    except Exception as e:
        print(f"Error in fetch_chart_data: {str(e)}")
        return jsonify({"error": "Failed to fetch chart data"}), 500


@app.route("/api/fetchFilterData", methods=["GET"])
async def fetch_filter_data():
    print("Received request for /api/fetchFilterData")
    # Make the API call to the filter URL
    try:
        response = requests.get(CHART_DASHBOARD_FILTERS_URL)
        filter_data = response.json()
        print(filter_data)
        return jsonify(filter_data)
    except Exception as e:
        print(f"Error in fetch_filter_data: {str(e)}")
        return jsonify({"error": "Failed to fetch filter data"}), 500



def process_rag_response(rag_response, query):
    """
    Parses RAG response dynamically to extract chart data for Chart.js.
    """
    
    try:
        # Fetch API URL and key from environment variables
        AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
        API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
        logger.info(f">>>AZURE_OPENAI_ENDPOINT: {AZURE_OPENAI_ENDPOINT}")

        endpoint = AZURE_OPENAI_ENDPOINT #os.environ.get("AZURE_OPEN_AI_ENDPOINT")
        api_key = API_KEY  #os.environ.get("AZURE_OPEN_AI_API_KEY")
        api_version = '2024-05-01-preview' #os.environ.get("OPENAI_API_VERSION")
        deployment = 'gpt-4o-mini' #os.environ.get("AZURE_OPEN_AI_DEPLOYMENT_MODEL")

        # "2023-09-01-preview"
        client = openai.AzureOpenAI(
            azure_endpoint=endpoint,
            api_key=api_key,
            api_version="2024-05-01-preview"
        )

        system_prompt = '''You are an assistant that helps generate formatted data for a chart that can be rendered with React Charts''' 


        user_prompt = f'''Format this data for a chart to be shown using chart.js. Pick the best chart type for this data.
        include chart type and chart options - 

        {query}
        {rag_response}
        
        Only return the JSON output and nothing else.
        if data not properly generated then generate some meaningful chart from {query} use some limited data from {rag_response}.
        verify and refine that JSON should not have any syntax errors like extra closing brackets
        '''


        completion = client.chat.completions.create(
            model=deployment,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0,
        )
        chart_data = completion.choices[0].message.content
        chart_data = chart_data.replace("```json",'').replace("```",'')
        logger.info(f">>>chart_data: {chart_data}")
        return json.loads(chart_data)
    except Exception as e:
        logger.error(f"Error dynamically processing RAG response: {e}")
        return {"error": str(e)}


    
async def complete_chat_request(request_body, last_rag_response=None):
    try:
        if USE_GRAPHRAG:
            query_separator = "&"
        else:
            query_separator = "?"
        query = request_body.get("messages")[-1].get("content")
        logger.info(f"User Query: {query}")

        # Detect if the query is requesting a chart
        is_chart_query = any(term in query.lower() for term in ["chart", "graph", "visualize", "plot", "trend"])
        use_graphrag = os.getenv("USE_GRAPHRAG", "false").lower() == "true"
        endpoint = GRAPHRAG_URL if use_graphrag else RAG_URL
        logger.info(f"is_chart_query: {is_chart_query}")
        logger.info(f">>> endpoint: {endpoint}")

        if not is_chart_query:
            # Non-chart queries
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{endpoint}{query_separator}query={query}") as response:
                    logger.info(f"endpoint: {endpoint}")
                    logger.info(f"query: {query}")
                    if response.status != 200:
                        error_message = await response.text()
                        logger.error(f"RAG/GraphRAG endpoint error: {error_message}")
                        return jsonify({"error": f"RAG/GraphRAG endpoint error: {error_message}"}), response.status

                    assistant_content = await response.text()
                    # assistant_content = re.sub(r'\. ', '.\n', assistant_content)  # Add line break after each sentence
                    # assistant_content = '\n' + assistant_content
                    # Dynamically format the content with line breaks for readability
                    assistant_content = '\n'.join(
                        line.strip() for line in assistant_content.split('. ') if line.strip()
                    )

                    # Add an additional newline at the end for better clarity (optional)
                    assistant_content += '\n'
                    return jsonify({
                        "id": str(uuid.uuid4()),
                        "model": "rag-model",
                        "created": int(time.time()),
                        "object": "chat.completion",
                        "choices": [{"messages": [{"role": "assistant", "content": assistant_content.strip()}]}],
                        "last_rag_response": assistant_content.strip()
                    })
        logger.info(f">>> last_rag_response: {last_rag_response}")
        if is_chart_query:
            if not last_rag_response:
                return jsonify({"error": "A previous RAG response is required to generate a chart."}), 400
            
              # Process RAG response to generate chart data
            chart_data = process_rag_response(last_rag_response, query)
            if not chart_data:
                return jsonify({"error": "Failed to process RAG response for chart generation."}), 500

            logger.info("Generating chart using Azure OpenAI.")
           
            return jsonify({
                "id": str(uuid.uuid4()),
                "model": "azure-openai",
                "created": int(time.time()),
                "object": chart_data,
                # "chartType": chart_data.get("type"),
                # "chartData": chart_data.get("data"),
                # "chartOptions": chart_data.get("options")
            })

    except Exception as e:
        logger.error(f"Error in complete_chat_request: {e}")
        return jsonify({"error": "An error occurred during processing."}), 500



@app.route('/api/chat', methods=['POST'])
async def conversation():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415

    # Get the request JSON and last RAG response from the client
    request_json = await request.get_json()

    last_rag_response = request_json.get("last_rag_response")
    logger.info(f"Received last_rag_response: {last_rag_response}")

    # Call complete_chat_request with RAG response
    return await complete_chat_request(request_json, last_rag_response)



@app.route("/api/layout-config", methods=["GET"])
async def get_layout_config():
    layout_config_str = os.getenv("REACT_APP_LAYOUT_CONFIG", "")
    if layout_config_str:
        return layout_config_str
    return jsonify({"error": "Layout config not found in environment variables"}), 400


async def generate_title(conversation_messages):
    # make sure the messages are sorted by _ts descending
    title_prompt = "Summarize the conversation so far into a 4-word or less title. Do not use any quotation marks or punctuation. Do not include any other commentary or description."

    messages = [
        {"role": msg["role"], "content": msg["content"]}
        for msg in conversation_messages
        if msg["role"] == "user"
    ]
    messages.append({"role": "user", "content": title_prompt})

    try:
        azure_openai_client = init_openai_client()
        response = await azure_openai_client.chat.completions.create(
            model=AZURE_OPENAI_DEPLOYMENT_NAME,
            messages=messages,
            temperature=1,
            max_tokens=64,
        )

        return response.choices[0].message.content
    except Exception as e:
        logging.error(f"Error generating title: {str(e)}")
        return messages[-2]["content"]


# def get_authenticated_user_details(request_headers):
#     # Return a hardcoded user principal ID for local testing
#     return {"user_principal_id": "test_user_id"}


# Conversation History API ##
@app.route("/history/generate", methods=["POST"])
async def add_conversation():
    authenticated_user = get_authenticated_user_details(request_headers=request.headers)
    user_id = authenticated_user["user_principal_id"]

    # check request for conversation_id
    request_json = await request.get_json()
    conversation_id = request_json.get("conversation_id", None)

    try:
        # make sure cosmos is configured
        cosmos_conversation_client = init_cosmosdb_client()
        if not cosmos_conversation_client:
            raise Exception("CosmosDB is not configured or not working")

        # check for the conversation_id, if the conversation is not set, we will create a new one
        history_metadata = {}
        if not conversation_id:
            title = await generate_title(request_json["messages"])
            conversation_dict = await cosmos_conversation_client.create_conversation(
                user_id=user_id, title=title
            )
            conversation_id = conversation_dict["id"]
            history_metadata["title"] = title
            history_metadata["date"] = conversation_dict["createdAt"]

        # Format the incoming message object in the "chat/completions" messages format
        # then write it to the conversation history in cosmos
        messages = request_json["messages"]
        if len(messages) > 0 and messages[-1]["role"] == "user":
            createdMessageValue = await cosmos_conversation_client.create_message(
                uuid=str(uuid.uuid4()),
                conversation_id=conversation_id,
                user_id=user_id,
                input_message=messages[-1],
            )
            if createdMessageValue == "Conversation not found":
                raise Exception(
                    "Conversation not found for the given conversation ID: "
                    + conversation_id
                    + "."
                )
        else:
            raise Exception("No user message found")

        await cosmos_conversation_client.cosmosdb_client.close()

        # Submit request to Chat Completions for response
        request_body = await request.get_json()
        history_metadata["conversation_id"] = conversation_id
        request_body["history_metadata"] = history_metadata
        return await complete_chat_request(request_body)

    except Exception as e:
        logging.exception("Exception in /history/generate")
        return jsonify({"error": str(e)}), 500


@app.route("/history/update", methods=["POST"])
async def update_conversation():
    authenticated_user = get_authenticated_user_details(request_headers=request.headers)
    user_id = authenticated_user["user_principal_id"]

    # check request for conversation_id
    request_json = await request.get_json()
    conversation_id = request_json.get("conversation_id", None)

    try:
        # make sure cosmos is configured
        cosmos_conversation_client = init_cosmosdb_client()
        if not cosmos_conversation_client:
            raise Exception("CosmosDB is not configured or not working")

        # check for the conversation_id, if the conversation is not set, we will create a new one
        if not conversation_id:
            raise Exception("No conversation_id found")

        # check for the conversation_id, if the conversation is not set, we will create a new one
        conversation = await cosmos_conversation_client.get_conversation(
            user_id, conversation_id
        )
        if not conversation:
            title = await generate_title(request_json["messages"])
            conversation = await cosmos_conversation_client.create_conversation(
                user_id=user_id, conversation_id=conversation_id, title=title
            )
            conversation_id = conversation["id"]

        # Format the incoming message object in the "chat/completions" messages format then write it to the
        # conversation history in cosmos
        messages = request_json["messages"]
        if len(messages) > 0 and messages[0]["role"] == "user":
            user_message = next(
                (
                    message
                    for message in reversed(messages)
                    if message["role"] == "user"
                ),
                None,
            )
            createdMessageValue = await cosmos_conversation_client.create_message(
                uuid=str(uuid.uuid4()),
                conversation_id=conversation_id,
                user_id=user_id,
                input_message=user_message,
            )
            if createdMessageValue == "Conversation not found":
                return (jsonify({"error": "Conversation not found"}), 400)
        else:
            return (jsonify({"error": "User not found"}), 400)

        # Format the incoming message object in the "chat/completions" messages format
        # then write it to the conversation history in cosmos
        messages = request_json["messages"]
        if len(messages) > 0 and messages[-1]["role"] == "assistant":
            if len(messages) > 1 and messages[-2].get("role", None) == "tool":
                # write the tool message first
                await cosmos_conversation_client.create_message(
                    uuid=str(uuid.uuid4()),
                    conversation_id=conversation_id,
                    user_id=user_id,
                    input_message=messages[-2],
                )
            # write the assistant message
            await cosmos_conversation_client.create_message(
                uuid=messages[-1]["id"],
                conversation_id=conversation_id,
                user_id=user_id,
                input_message=messages[-1],
            )
        else:
            raise Exception("No bot messages found")

        # Submit request to Chat Completions for response
        await cosmos_conversation_client.cosmosdb_client.close()
        return (
            jsonify(
                {
                    "success": True,
                    "data": {
                        "title": conversation["title"],
                        "date": conversation["updatedAt"],
                        "conversation_id": conversation["id"],
                    },
                }
            ),
            200,
        )

    except Exception as e:
        logging.exception("Exception in /history/update")
        return jsonify({"error": str(e)}), 500


@app.route("/history/message_feedback", methods=["POST"])
async def update_message():
    authenticated_user = get_authenticated_user_details(request_headers=request.headers)
    user_id = authenticated_user["user_principal_id"]
    cosmos_conversation_client = init_cosmosdb_client()

    # check request for message_id
    request_json = await request.get_json()
    message_id = request_json.get("message_id", None)
    message_feedback = request_json.get("message_feedback", None)
    try:
        if not message_id:
            return jsonify({"error": "message_id is required"}), 400

        if not message_feedback:
            return jsonify({"error": "message_feedback is required"}), 400

        # update the message in cosmos
        updated_message = await cosmos_conversation_client.update_message_feedback(
            user_id, message_id, message_feedback
        )
        if updated_message:
            return (
                jsonify(
                    {
                        "message": f"Successfully updated message with feedback {message_feedback}",
                        "message_id": message_id,
                    }
                ),
                200,
            )
        else:
            return (
                jsonify(
                    {
                        "error": f"Unable to update message {message_id}. It either does not exist or the user does not have access to it."
                    }
                ),
                404,
            )

    except Exception as e:
        logging.exception("Exception in /history/message_feedback")
        return jsonify({"error": str(e)}), 500


@app.route("/history/delete", methods=["DELETE"])
async def delete_conversation():
    # get the user id from the request headers
    authenticated_user = get_authenticated_user_details(request_headers=request.headers)
    user_id = authenticated_user["user_principal_id"]

    # check request for conversation_id
    request_json = await request.get_json()
    conversation_id = request_json.get("conversation_id", None)

    try:
        if not conversation_id:
            return jsonify({"error": "conversation_id is required"}), 400

        # make sure cosmos is configured
        cosmos_conversation_client = init_cosmosdb_client()
        if not cosmos_conversation_client:
            raise Exception("CosmosDB is not configured or not working")

        # delete the conversation messages from cosmos first
        await cosmos_conversation_client.delete_messages(conversation_id, user_id)

        # Now delete the conversation
        await cosmos_conversation_client.delete_conversation(user_id, conversation_id)

        await cosmos_conversation_client.cosmosdb_client.close()

        return (
            jsonify(
                {
                    "message": "Successfully deleted conversation and messages",
                    "conversation_id": conversation_id,
                }
            ),
            200,
        )
    except Exception as e:
        logging.exception("Exception in /history/delete")
        return jsonify({"error": str(e)}), 500


@app.route("/history/list", methods=["GET"])
async def list_conversations():
    offset = request.args.get("offset", 0)
    limit = request.args.get("limit", 25)
    authenticated_user = get_authenticated_user_details(request_headers=request.headers)
    user_id = authenticated_user["user_principal_id"]

    print(f"user_id: {user_id}, offset: {offset}, limit: {limit}")

    # Initialize CosmosDB client
    cosmos_conversation_client = init_cosmosdb_client()
    if not cosmos_conversation_client:
        raise Exception("CosmosDB is not configured or not working")

    # Get conversations
    conversations = await cosmos_conversation_client.get_conversations(
        user_id, offset=offset, limit=limit
    )
    await cosmos_conversation_client.cosmosdb_client.close()
    if not isinstance(conversations, list):
        return jsonify({"error": f"No conversations for {user_id} were found"}), 404

    return jsonify(conversations), 200


@app.route("/history/read", methods=["POST"])
async def get_conversation():
    authenticated_user = get_authenticated_user_details(request_headers=request.headers)
    user_id = authenticated_user["user_principal_id"]

    # check request for conversation_id
    request_json = await request.get_json()
    conversation_id = request_json.get("conversation_id", None)

    if not conversation_id:
        return jsonify({"error": "conversation_id is required"}), 400

    # make sure cosmos is configured
    cosmos_conversation_client = init_cosmosdb_client()
    if not cosmos_conversation_client:
        raise Exception("CosmosDB is not configured or not working")

    # get the conversation object and the related messages from cosmos
    conversation = await cosmos_conversation_client.get_conversation(
        user_id, conversation_id
    )
    # return the conversation id and the messages in the bot frontend format
    if not conversation:
        return (
            jsonify(
                {
                    "error": f"Conversation {conversation_id} was not found. It either does not exist or the logged in user does not have access to it."
                }
            ),
            404,
        )

    # get the messages for the conversation from cosmos
    conversation_messages = await cosmos_conversation_client.get_messages(
        user_id, conversation_id
    )

    # format the messages in the bot frontend format
    messages = [
        {
            "id": msg["id"],
            "role": msg["role"],
            "content": msg["content"],
            "createdAt": msg["createdAt"],
            "feedback": msg.get("feedback"),
        }
        for msg in conversation_messages
    ]

    await cosmos_conversation_client.cosmosdb_client.close()
    return jsonify({"conversation_id": conversation_id, "messages": messages}), 200


@app.route("/history/rename", methods=["POST"])
async def rename_conversation():
    authenticated_user = get_authenticated_user_details(request_headers=request.headers)
    user_id = authenticated_user["user_principal_id"]

    # check request for conversation_id
    request_json = await request.get_json()
    conversation_id = request_json.get("conversation_id", None)

    if not conversation_id:
        return jsonify({"error": "conversation_id is required"}), 400

    # make sure cosmos is configured
    cosmos_conversation_client = init_cosmosdb_client()
    if not cosmos_conversation_client:
        raise Exception("CosmosDB is not configured or not working")

    # get the conversation from cosmos
    conversation = await cosmos_conversation_client.get_conversation(
        user_id, conversation_id
    )
    if not conversation:
        return (
            jsonify(
                {
                    "error": f"Conversation {conversation_id} was not found. It either does not exist or the logged in user does not have access to it."
                }
            ),
            404,
        )

    # update the title
    title = request_json.get("title", None)
    if not title:
        return jsonify({"error": "title is required"}), 400
    conversation["title"] = title
    updated_conversation = await cosmos_conversation_client.upsert_conversation(
        conversation
    )

    await cosmos_conversation_client.cosmosdb_client.close()
    return jsonify(updated_conversation), 200


@app.route("/history/delete_all", methods=["DELETE"])
async def delete_all_conversations():
    # get the user id from the request headers
    authenticated_user = get_authenticated_user_details(request_headers=request.headers)
    user_id = authenticated_user["user_principal_id"]

    # get conversations for user
    try:
        # make sure cosmos is configured
        cosmos_conversation_client = init_cosmosdb_client()
        if not cosmos_conversation_client:
            raise Exception("CosmosDB is not configured or not working")

        conversations = await cosmos_conversation_client.get_conversations(
            user_id, offset=0, limit=None
        )
        if not conversations:
            return jsonify({"error": f"No conversations for {user_id} were found"}), 404

        # delete each conversation
        for conversation in conversations:
            # delete the conversation messages from cosmos first
            await cosmos_conversation_client.delete_messages(
                conversation["id"], user_id
            )

            # Now delete the conversation
            await cosmos_conversation_client.delete_conversation(
                user_id, conversation["id"]
            )
        await cosmos_conversation_client.cosmosdb_client.close()
        return (
            jsonify(
                {
                    "message": f"Successfully deleted conversation and messages for user {user_id}"
                }
            ),
            200,
        )

    except Exception as e:
        logging.exception("Exception in /history/delete_all")
        return jsonify({"error": str(e)}), 500


@app.route("/history/clear", methods=["POST"])
async def clear_messages():
    # get the user id from the request headers
    authenticated_user = get_authenticated_user_details(request_headers=request.headers)
    user_id = authenticated_user["user_principal_id"]

    # check request for conversation_id
    request_json = await request.get_json()
    conversation_id = request_json.get("conversation_id", None)

    try:
        if not conversation_id:
            return jsonify({"error": "conversation_id is required"}), 400

        # make sure cosmos is configured
        cosmos_conversation_client = init_cosmosdb_client()
        if not cosmos_conversation_client:
            raise Exception("CosmosDB is not configured or not working")

        # delete the conversation messages from cosmos
        await cosmos_conversation_client.delete_messages(conversation_id, user_id)

        return (
            jsonify(
                {
                    "message": "Successfully deleted messages in conversation",
                    "conversation_id": conversation_id,
                }
            ),
            200,
        )
    except Exception as e:
        logging.exception("Exception in /history/clear_messages")
        return jsonify({"error": str(e)}), 500


@app.route("/history/ensure", methods=["GET"])
async def ensure_cosmos():
    if not AZURE_COSMOSDB_ACCOUNT:
        return jsonify({"error": "CosmosDB is not configured"}), 404

    try:
        cosmos_conversation_client = init_cosmosdb_client()
        success, err = await cosmos_conversation_client.ensure()
        if not cosmos_conversation_client or not success:
            if err:
                return jsonify({"error": err}), 422
            return jsonify({"error": "CosmosDB is not configured or not working"}), 500

        await cosmos_conversation_client.cosmosdb_client.close()
        return jsonify({"message": "CosmosDB is configured and working"}), 200
    except Exception as e:
        logging.exception("Exception in /history/ensure")
        cosmos_exception = str(e)
        if "Invalid credentials" in cosmos_exception:
            return jsonify({"error": cosmos_exception}), 401
        elif "Invalid CosmosDB database name" in cosmos_exception:
            return (
                jsonify(
                    {
                        "error": f"{cosmos_exception} {AZURE_COSMOSDB_DATABASE} for account {AZURE_COSMOSDB_ACCOUNT}"
                    }
                ),
                422,
            )
        elif "Invalid CosmosDB container name" in cosmos_exception:
            return (
                jsonify(
                    {
                        "error": f"{cosmos_exception}: {AZURE_COSMOSDB_CONVERSATIONS_CONTAINER}"
                    }
                ),
                422,
            )
        else:
            return jsonify({"error": "CosmosDB is not working"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)