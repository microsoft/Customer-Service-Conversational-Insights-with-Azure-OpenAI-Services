### Conversational data format
```json
{
    "ConversationId": "1f47eacf-c780-4ae2-ab2d-7b2e1386617f",
    "Messages": [
        {
            "Id": "2e1804ad-c856-4475-abc1-c831dc904935",
            "EventType": "MessageFromUser",
            "EventTime": "2016-08-17 20:42:03.592000",
            "ConversationId": "1f47eacf-c780-4ae2-ab2d-7b2e1386617f",
            "Value": "I need to book a flight to find my last Pokemon. I would need to leave from Montreal and go to Hiroshima. I will also need to leave on August 19th. Im with 4 other adults as well.",
            "UserId": "U2709166N",
            "CustomProperties": {
               "any_property" : "any_value"
            }
        },
        {
            "Id": "5b6284b5-a005-440e-9c4c-87c0c1b01333",
            "EventType": "MessageFromBotOrAgent",
            "EventTime": "2016-08-17 20:43:04.970000",
            "ConversationId": "1f47eacf-c780-4ae2-ab2d-7b2e1386617f",
            "Value": "Is there a budget for your trip?",
            "UserId": "U22HTHYNP",
            "CustomProperties": {
               "any_property" : "any_value"
            }
        },
        {
            "Id": "a13fb656-b6df-4d40-9458-93869af21e20",
            "EventType": "MessageFromUser",
            "EventTime": "2016-08-17 20:43:40.239000",
            "ConversationId": "1f47eacf-c780-4ae2-ab2d-7b2e1386617f",
            "Value": "Yes, $16600.",
            "UserId": "U2709166N",
            "CustomProperties": {
               "any_property" : "any_value"
            }
        },
        ...
    ]
}
```