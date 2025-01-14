import azure.functions as func
import logging
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="GetMetrics", methods=["GET"], auth_level=func.AuthLevel.ANONYMOUS)
def get_metrics(req: func.HttpRequest) -> func.HttpResponse:

    data_type = req.params.get('data_type')
    if not data_type:
        data_type = 'filters'

    if data_type == 'filters':
        print(data_type)
        filters_data = [
            {
                "filter_name": "Topic",
                "filter_values": [
                    {"key": "internet-services", "displayValue": "Internet Services"},
                    {
                        "key": "billing-and-payment",
                        "displayValue": "Billing and Payment",
                    },
                    {"key": "loyalty-programs", "displayValue": "Loyalty Programs"},
                    {
                        "key": "international-roaming",
                        "displayValue": "International Roaming",
                    },
                    {"key": "plan-management", "displayValue": "Plan Management"},
                    {"key": "device-support", "displayValue": "Device Support"},
                    {
                        "key": "network-connectivity",
                        "displayValue": "Network Connectivity",
                    },
                    {"key": "parental-controls", "displayValue": "Parental Controls"},
                ],
            },
            {
                "filter_name": "Sentiment",
                "filter_values": [
                    {"key": "satisfied", "displayValue": "Satisfied"},
                    {"key": "dissatisfied", "displayValue": "Dissatisfied"},
                    {"key": "neutral", "displayValue": "Neutral"},
                    {"key": "all", "displayValue": "All"},
                ],
            },
            {
                "filter_name": "DateRange",
                "filter_values": [
                    {"key": "7days", "displayValue": "Last 7 days"},
                    {"key": "14days", "displayValue": "Last 14 days"},
                    {"key": "90days", "displayValue": "Last 90 days"},
                    {"key": "yearToDate", "displayValue": "Year to Date"},
                ],
            },
        ]

        json_response = json.dumps(filters_data)
        return func.HttpResponse(json_response, mimetype="application/json", status_code=200)

    elif data_type == 'charts':
        print(data_type)
        chart_data = [
                        {
                            "id":"TOTAL_CALLS",
                            "chart_name": "Total Calls",
                            "chart_type": "card",
                            "chart_value": [
                                {
                                    "name": "Total Calls",
                                    "value": "50000",
                                    "unit_of_measurement": "",
                                }
                            ]
                        },
                        {   
                            "id":"AVG_HANDLING_TIME",
                            "chart_name": "Average Handling Time",
                            "chart_type": "card",
                            "chart_value": [
                                {
                                    "name": "Average Handling Time",
                                    "value": "3.5",
                                    "unit_of_measurement": "Mins",
                                }
                            ]
                        },
                        {
                            "id":"SATISFIED",
                            "chart_name": "Satisfied",
                            "chart_type": "card",
                            "chart_value": [
                                {
                                    "name": "Satisfied",
                                    "value": "80",
                                    "unit_of_measurement": "%",
                                }
                            ]
                        },
                        {
                            "id":"SENTIMENT",
                            "chart_name": "Topics Overview",
                            "chart_type": "donutchart",
                            "chart_value": [
                                {
                                    "name": "positive",
                                    "value": "60"
                                },
                                {
                                    "name": "neutral",
                                    "value": "10"
                                },
                                {
                                    "name": "negative",
                                    "value": "30"
                                }
                            ]
                        },
                        {
                            "id":"AVG_HANDLING_TIME_BY_TOPIC",
                            "chart_name": "Average Handling Time By Topic",
                            "chart_type": "bar",
                            "chart_value": [
                                {
                                    "name": "Internet Services",
                                    "value": 1
                                },
                                {
                                    "name": "Billing and Payment",
                                    "value": 2.8
                                },
                                {
                                    "name": "Loyalty Programs",
                                    "value": 3.7
                                },
                                {
                                    "name": "International Roaming",
                                    "value": 4
                                },
                            ]
                        }, 
                        {
                            "id":"TOPICS",
                            "chart_name": "Trending Topics",
                            "chart_type": "table",
                            "chart_value": [
                                    { "name": "Plan Pricing", "call_frequency": 60, "average_sentiment": "positive" },
                                    { "name": "Accounts", "call_frequency": 55, "average_sentiment": "neutral" },
                                    { "name": "Billing", "call_frequency": 50, "average_sentiment": "negative" },
                                    { "name": "Customer Service", "call_frequency": 45, "average_sentiment": "neutral" },
                                    { "name": "Plan Pricing", "call_frequency": 40, "average_sentiment": "positive" },
                                    { "name": "Accounts", "call_frequency": 35, "average_sentiment": "neutral" },
                                    { "name": "Billing", "call_frequency": 25, "average_sentiment": "negative" },
                                    { "name": "Customer Service", "call_frequency": 22, "average_sentiment": "neutral" },
                                    { "name": "Plan Pricing", "call_frequency": 22, "average_sentiment": "positive" },
                                    { "name": "Accounts", "call_frequency": 20, "average_sentiment": "neutral" }
                            ]
                        }, 
                        {
                            "id":"KEY_PHRASES",
                        "chart_name": "Key Phrases",
                        "chart_type": "wordcloud",
                        "chart_value": [
                                        { "text": "Refund", "size": 50, "average_sentiment": "positive" },
                                        { "text": "Throttling", "size": 47, "average_sentiment": "neutral" },
                                        { "text": "Ticket", "size": 40, "average_sentiment": "negative" },
                                        { "text": "Overdue", "size": 37, "average_sentiment": "negative" },
                                        { "text": "Roaming", "size": 35, "average_sentiment": "neutral" },
                                        { "text": "Phone plane", "size": 33, "average_sentiment": "neutral" },
                                        { "text": "Plan upgrade", "size": 30, "average_sentiment": "positive" },
                                        { "text": "IMEI", "size": 26, "average_sentiment": "neutral" },
                                        { "text": "Refund", "size": 24, "average_sentiment": "positive" },
                                        { "text": "Internet Issue", "size": 22, "average_sentiment": "negative" },
                                        { "text": "Ticket", "size": 20, "average_sentiment": "negative" },
                                        { "text": "Layover", "size": 18, "average_sentiment": "neutral" },
                                        { "text": "service", "size": 16, "average_sentiment": "positive" },
                                        { "text": "Verification", "size": 15, "average_sentiment": "neutral" },
                                        { "text": "upgrade", "size": 15, "average_sentiment": "positive" },
                                        { "text": "Bill", "size": 10, "average_sentiment": "negative" },
                                        { "text": "Communication", "size": 10, "average_sentiment": "neutral" }
                            ]   
                        }
                    ]

        # [{"chart_name":"satisfaction", "chart_value":[{"name":"yes","count":40,"percentage":80.00},{"name":"no","count":10,"percentage":20.00}]},
        # {"chart_name":"total_calls", "chart_value":[{"name":"calls","count":50}]},
        # {"chart_name":"topics", "chart_value":[{"name":"Internet Services","count":10},{"name":"Billing and Payment","count":10},{"name":"Loyalty Programs","count":10},{"name":"International Roaming","count":10},{"name":"Plan Management","count":10},{"name":"Device Support","count":10},{"name":"Network Connectivity","count":10},{"name":"Parental Controls","count":10}]},
        # {"chart_name":"avg_call_duration", "chart_value":[{"call_id":"69e78f21-8aaf-4488-a8cb-a5fe5c0a4af7", "duration":10},{"call_id":"37fadadd-da85-40e0-884a-191cf63fa61f", "duration":32},
        #                                                            {"call_id":"db42b35d-0d3a-46a4-9821-866f065c7e46", "duration":6},{"call_id":"5030154f-6cc7-425b-9ce7-412246246765", "duration":8},
        #                                                            {"call_id":"f5299c35-c8a4-48f3-82af-23893131c4d9", "duration":15}]}
        #             ]

        json_response = json.dumps(chart_data)
        return func.HttpResponse(json_response, mimetype="application/json", status_code=200)

    elif data_type == 'key_phrases':
        print(data_type)
        key_phrases_data = [{"key_phrase":"Internet Services","frequency":40},
        {"text":"Billing and Payment","frequency":10},
        {"text":"Loyalty Programs","frequency":50},
        {"text":"International Roaming","frequency":19},
        {"text":"Plan Management","frequency":8},
        {"text":"Device Support","frequency":22},
        {"text":"Network Connectivity","frequency":12},
        {"text":"Parental Controls","frequency":45}]

        json_response = json.dumps(key_phrases_data)
        return func.HttpResponse(json_response, mimetype="application/json", status_code=200)
