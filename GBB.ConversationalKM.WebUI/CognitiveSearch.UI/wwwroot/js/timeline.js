function getTimelineHtml(data) {

    var conversationId = data.result.ConversationId;
    var messages = data.result.Messages;
    var result = "";

    if (messages !== null) {
        for (i = 0; i < messages.length; i++) {
            if (messages[i].EventType === "MessageFromBotOrAgent" || messages[i].EventType === "MessageFromUser") {

                var sender = "User";
                var position = "direction-r";
                if (messages[i].EventType === "MessageFromBotOrAgent") {
                    sender = "Agent";
                    position = "direction-l";
                }

                var messageTime = moment(messages[i].EventTime).format("LLL");
                var messageText = messages[i].Value;
                var customProperties = JSON.parse(messages[i].CustomProperties);

                var starTime = customProperties.offsetInTicks / 10000000;
                var endTime = starTime + (customProperties.durationInTicks / 10000000);
                var audioPath = data.result.audioPath;
                
                var referenceId = messages[i].ReferenceId;
                var userMessageObject = messages.filter(x => x.Id === referenceId);
                var userMessage = null;
                if (userMessageObject.length > 0) {
                    userMessage = userMessageObject[0].Value;
                }

                var item = `<li>
                    <div class="${position}">
                        <div class="flag-wrapper">
                            <span class="hexa"></span>
                            <span class="flag">${sender}</span>
                            <span class="time-wrapper"><span class="time">${messageTime}</span></span>
                        </div>
                        
                        <div id="${messages[i].Id}" class="desc">
                            ${messageText}`;

                if (audioPath !== undefined) {
                    item += `
                            <audio controls preload="none">
                                <source type="audio/wav" src="${audioPath}#t=${starTime},${endTime}">
                            </audio>`;
                }
                item +=`
                        </div>`;
                                     
                result += item;


                if (customProperties !== undefined && customProperties.sentiment !== undefined && customProperties.sentiment !== null) {

                    var sentimentItem = `<div class="direction-r-intent">
                                            <div class="desc-intent desc"><i>Sentiment: <b>${customProperties.sentiment}</b></i></div>
                                         </div>`;

                    result += sentimentItem;
                }

                if (customProperties !== undefined && customProperties.mainScenario !== undefined && customProperties.currentScenario !== undefined) {

                    var scenario = `<div class="direction-l-intent">
                                        <div class="desc-intent desc">
                                            <i>Current Scenario: <b>${customProperties.currentScenario}</b></i>
                                            <br/>
                                            <i>Main Scenario: <b>${customProperties.mainScenario}</b></i>
                                            <br/>`;

                    if (messages[i].EventType === "MessageFromBotOrAgent") {
                        scenario += `<i>User message: <b style="color: #0078d7;">${userMessage}</b></i> `;  
                    }

                    scenario +=     `</div>
                                    </div>`;

                    result += scenario;
                }

            }
            else if (messages[i].EventType === "IntentRecognized") {

                var intent = messages[i].Value;                

                var item = `<div class="direction-r-intent">
                                <div class="desc-intent desc"><i>Intent detected: <b>${intent}</b></i>
                                <br>
                                <label for="${messages[i].Id}">Correct intent</label>
                                <select id="${messages[i].Id}">
                                    <option value="None">             None           </option>
                                    <option value="Abbandona">        Abbandona      </option>
                                    <option value="Acquistare">       Acquistare     </option>
                                    <option value="Assistenza">       Assistenza     </option>
                                    <option value="Attivare">         Attivare       </option>
                                    <option value="Aumentare">        Aumentare      </option>
                                    <option value="CambioNumero">     CambioNumero   </option>
                                    <option value="ComePossoPagare">  ComePossoPagare</option>
                                    <option value="DeliveryFisso">    DeliveryFisso  </option>
                                    <option value="Disattivare">      Disattivare    </option>
                                    <option value="HoPagato">         HoPagato       </option>
                                    <option value="InfoCommerciali">  InfoCommerciali</option>
                                    <option value="InfoContatore">    InfoContatore  </option>
                                    <option value="InfoOperative">    InfoOperative  </option>
                                    <option value="InfoStato">        InfoStato      </option>
                                    <option value="Lamentele">        Lamentele      </option>
                                    <option value="Modificare">       Modificare     </option>
                                    <option value="No">               No             </option>
                                    <option value="Problemi">         Problemi       </option>
                                    <option value="QuantoPago">       QuantoPago     </option>
                                    <option value="Reclamo">          Reclamo        </option>
                                    <option value="Reset">            Reset          </option>
                                    <option value="Riattivare">       Riattivare     </option>
                                    <option value="Ricaricare">       Ricaricare     </option>
                                    <option value="Saluti">           Saluti         </option>
                                    <option value="SalutiFinali">     SalutiFinali   </option>
                                    <option value="Si">               Si             </option>
                                    <option value="Altro">            Altro          </option>
                                </select>
                                <button style="float:right" onclick="saveIntent(document.getElementById('${messages[i].Id}').value, '${messages[i].ReferenceId}', '${conversationId}', '${messages[i].ReferenceId}')">&#9989;</button> 
                                </div>
                            </div>`;

                result += item;
            }
        }

        result +=  `</div ></li >`;

        return result;
    }
    else return "";


}

function saveIntent(intent, message, conversationId, messageId) {
    messageText = document.getElementById(message).innerHTML;
    // Save selected intent
    $.post('/home/SaveIntent',
        {
            intent: intent,
            message: messageText,
            conversationId: conversationId,
            messageId: messageId
        },
        function (data) {
            alert(`intent "${intent}" saved for message "${messageText}"`);
        });
}