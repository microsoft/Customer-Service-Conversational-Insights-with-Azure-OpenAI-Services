import React, { useRef, useState } from "react";
import { Button, Textarea } from "@fluentui/react-components";
import "./Chat.css";
import { SparkleRegular } from "@fluentui/react-icons";
// import SparkleIcon from "../../Assets/Sparkle.svg";
import { DefaultButton, Spinner, SpinnerSize } from "@fluentui/react";
import { useAppContext } from "../../state/useAppContext";
import { actionConstants } from "../../state/ActionConstants";
import {
  ChartDataResponse,
  ChatResponse,
  Conversation,
  ConversationRequest,
  type ChatMessage,
} from "../../types/AppTypes";
import { callConversationApi, historyUpdate } from "../../api/api";
import { ChatAdd24Regular } from "@fluentui/react-icons";
import { generateUUIDv4 } from "../../configs/Utils";
import ChatChart from "../ChatChart/ChatChart";

type ChatProps = {
  onHandlePanelStates: (name: string) => void;
  panels: Record<string, string>;
  panelShowStates: Record<string, boolean>;
};

const [ASSISTANT, TOOL, ERROR, USER] = ["assistant", "tool", "error", "user"];
const NO_CONTENT_ERROR = "No content in messages object.";

const Chat: React.FC<ChatProps> = ({
  onHandlePanelStates,
  panelShowStates,
  panels,
}) => {
  const { state, dispatch } = useAppContext();
  const { userMessage, generatingResponse } = state?.chat;
  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  const abortFuncs = useRef([] as AbortController[]);
  const [lastRagResponse, setLastRagResponse] = useState<string | null>(null);

  const saveToDB = async (messages: ChatMessage[], convId: string) => {
    if (!convId || !messages.length) {
      return;
    }
    const isNewConversation = !state.selectedConversationId;
    dispatch({
      type: actionConstants.UPDATE_HISTORY_UPDATE_API_FLAG,
      payload: true,
    });
    await historyUpdate(messages, convId)
      .then(async (res) => {
        if (!res.ok) {
          let errorMessage = "Answers can't be saved at this time.";
          let errorChatMsg: ChatMessage = {
            id: generateUUIDv4(),
            role: "error",
            content: errorMessage,
            date: new Date().toISOString(),
          };
          if (!messages) {
            // setAnswers([...messages, errorChatMsg]);
            let err: Error = {
              ...new Error(),
              message: "Failure fetching current chat state.",
            };
            throw err;
          }
        }
        let responseJson = await res.json();
        if (isNewConversation && responseJson?.success) {
          const newConversation: Conversation = {
            id: responseJson?.data?.conversation_id,
            title: responseJson?.data?.title,
            messages: messages,
            date: responseJson?.data?.date,
            updatedAt: responseJson?.data?.date,
          };
          dispatch({
            type: actionConstants.ADD_NEW_CONVERSATION_TO_CHAT_HISTORY,
            payload: newConversation,
          });
          dispatch({
            type: actionConstants.UPDATE_SELECTED_CONV_ID,
            payload: responseJson?.data?.conversation_id,
          });
        }
        dispatch({
          type: actionConstants.UPDATE_HISTORY_UPDATE_API_FLAG,
          payload: false,
        });
        return res as Response;
      })
      .catch((err) => {
        console.error("Error: while saving data", err);
      })
      .finally(() => {
        dispatch({
          type: actionConstants.UPDATE_GENERATING_RESPONSE_FLAG,
          payload: false,
        });
        dispatch({
          type: actionConstants.UPDATE_HISTORY_UPDATE_API_FLAG,
          payload: false,
        });
      });
  };

  const isChartQuery = (query: string) => {
    const chartKeywords = ["chart", "graph", "visualize", "plot", "trend"];
    return chartKeywords.some((keyword) =>
      query.toLowerCase().includes(keyword)
    );
  };

  const makeApiRequestWithCosmosDB = async (
    question: string,
    conversationId: string
  ) => {
    if (generatingResponse || !question.trim()) {
      return;
    }

    const newMessage: ChatMessage = {
      id: generateUUIDv4(),
      role: "user",
      content: question,
      date: new Date().toISOString(),
    };
    dispatch({
      type: actionConstants.UPDATE_GENERATING_RESPONSE_FLAG,
      payload: true,
    });
    dispatch({
      type: actionConstants.UPDATE_MESSAGES,
      payload: [newMessage],
    });
    dispatch({
      type: actionConstants.UPDATE_USER_MESSAGE,
      payload: "",
    });

    const abortController = new AbortController();
    abortFuncs.current.unshift(abortController);

    const request: ConversationRequest = {
      id: conversationId,
      messages: [...state.chat.messages, newMessage].filter(
        (messageObj) => messageObj.role !== ERROR
      ),
      last_rag_response:
        isChartQuery(userMessage) && lastRagResponse
          ? JSON.stringify(lastRagResponse)
          : null,
    };
    let result = {} as ChatResponse;

    try {
      const response = await callConversationApi(
        request,
        abortController.signal
      );
      let updatedMessages: ChatMessage[] = [];
      if (response?.body) {
        // console.log(">>> response?.body", response);
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          // console.log(">>> response?.body value", done, value);
          let runningText = "";
          if (done) break;
          var text = new TextDecoder("utf-8").decode(value);
          const objects = text.split("\n");
          // console.log(">>> objects", objects, objects.length);
          objects.forEach((obj) => {
            // console.log(">>>> ", obj);
            try {
              runningText += obj;
              result = JSON.parse(runningText);
              // setShowLoadingMessage(false);
              // console.log(">>>> ", result, runningText);
              if (result.error) {
                // setAnswers([
                //   ...answers,
                //   newMessage,
                //   {
                //     role: "error",
                //     content: result.error,
                //     id: "",
                //     date: "",
                //   },
                // ]);
              } else {
                // setAnswers([
                //   ...answers,
                //   newMessage,
                //   ...result.choices[0].messages,
                // ]);
              }
              runningText = "";
            } catch {}
          });
        }
        console.log(">>>>> result", result);

        // Adding date and ids for message objects //
        if (
          "choices" in result &&
          Array.isArray(result?.choices[0]?.messages)
        ) {
          result.choices[0].messages = result.choices[0].messages.map(
            (msgObj) => {
              if (!msgObj?.date) {
                msgObj.date = new Date().toISOString();
              }
              if (!msgObj?.id) {
                msgObj.id = generateUUIDv4();
              }
              return msgObj;
            }
          );
        }

        // CHART CHECKING
        if (
          "object" in result &&
          result?.object?.type &&
          result?.object?.data
        ) {
          console.log("chart RESPONSE RECEIVED >>>>>>>");

          // setResponseChart({
          //   chartType: result.chartType,
          //   chartData: result.chartData,
          // });

          // const assistantContent = result.choices[0].messages[0].content;
          // console.log("assistantContent", assistantContent);
          try {
            let parsedResponse;

            // Try parsing assistant content as JSON for chart data
            // if (typeof assistantContent === "string") {
            //   try {
            //     parsedResponse = JSON.parse(assistantContent); // Try parsing as JSON
            //   } catch {
            //     // If not JSON, treat it as plain text
            //     parsedResponse = { message: { content: assistantContent } };
            //   }

            //   console.log("Parsed Response for Chart:", parsedResponse);

            //   // Handle the chart response if present
            //   if (parsedResponse?.chartType && parsedResponse?.chartData) {

            //     setResponseChart({
            //       chartType: parsedResponse.chartType,
            //       chartData: parsedResponse.chartData,
            //     });
            //   }
            // }
            const chartMessage: ChatMessage = {
              id: generateUUIDv4(),
              role: "assistant",
              content: result.object as unknown as ChartDataResponse,
              date: new Date().toISOString(),
            };
            updatedMessages = [
              ...state.chat.messages,
              newMessage,
              chartMessage,
            ];

            // Update messages with the response content
            dispatch({
              type: actionConstants.UPDATE_MESSAGES,
              payload: [chartMessage],
            });
          } catch (e) {
            console.error("Error handling assistant response:", e);
          }
        } else if (
          "choices" in result &&
          result?.choices?.[0]?.messages?.[0]?.content
        ) {
          console.log("MESSAGES RESPONSE RECEIVED >>>>>>>");

          setLastRagResponse(
            result?.choices?.[0]?.messages?.[0]?.content as string
          ); // Update the last RAG response

          // console.warn("Invalid response format.");
          updatedMessages = [
            ...state.chat.messages,
            newMessage,
            ...result.choices[0].messages,
          ];
          dispatch({
            type: actionConstants.UPDATE_MESSAGES,
            payload: [...result.choices[0].messages],
          });
        }
        //
        // console.log(
        //   ">>> response final",
        //   result.choices[0].messages,
        //   state.chat.messages
        // );
        saveToDB(updatedMessages, conversationId);
      }
    } catch (e) {
      if (!abortController.signal.aborted) {
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert(
            "An error occurred. Please try again. If the problem persists, please contact the site administrator."
          );
        }
      }
    } finally {
      dispatch({
        type: actionConstants.UPDATE_GENERATING_RESPONSE_FLAG,
        payload: false,
      });
    }
    return abortController.abort();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const conversationId =
        state?.selectedConversationId || state.generatedConversationId;
      if (userMessage) {
        makeApiRequestWithCosmosDB(userMessage, conversationId);
      }
      if (questionInputRef?.current) {
        questionInputRef?.current.focus();
      }
    }
  };

  const onClickSend = () => {
    const conversationId =
      state?.selectedConversationId || state.generatedConversationId;
    if (userMessage) {
      makeApiRequestWithCosmosDB(userMessage, conversationId);
    }
    if (questionInputRef?.current) {
      questionInputRef?.current.focus();
    }
  };

  const setUserMessage = (value: string) => {
    dispatch({ type: actionConstants.UPDATE_USER_MESSAGE, payload: value });
  };

  const onNewConversation = () => {
    dispatch({ type: actionConstants.NEW_CONVERSATION_START });
  };
  const { messages } = state.chat;
  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>Chat</span>
        <span>
          <Button
            appearance="outline"
            onClick={() => onHandlePanelStates(panels.CHATHISTORY)}
            className="hide-chat-history"
          >
            {`${
              panelShowStates?.[panels.CHATHISTORY] ? "Hide" : "Show"
            } Chat History`}
          </Button>
        </span>
      </div>
      <div className="chat-messages">
        {Boolean(state.chatHistory?.isFetchingConvMessages) && (
          <div>
            <Spinner
              size={SpinnerSize.small}
              aria-label="Fetching Chat messages"
            />
          </div>
        )}
        {!Boolean(state.chatHistory?.isFetchingConvMessages) &&
          messages.length === 0 && (
            <div className="initial-msg">
              {/* <img src={SparkleIcon} alt="Sparkle" /> */}
              <SparkleRegular/>
              <span>Start Chatting</span>
              <span>
                You can ask questions around agent performance, issue
                resolution, or something else.
              </span>
            </div>
          )}
        {!Boolean(state.chatHistory?.isFetchingConvMessages) &&
          messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              {(() => {
                if (msg.role === "user" && typeof msg.content === "string") {
                  return (
                    <div className="user-message">
                      <span>{msg.content}</span>
                    </div>
                  );
                }
                msg.content = msg.content as ChartDataResponse;
                if (msg?.content?.type && msg?.content?.data) {
                  return (
                    <div className="assistant-message">
                      <ChatChart chartContent={msg.content} />
                      <div className="answerDisclaimerContainer">
                        <span className="answerDisclaimer">
                          AI-generated content may be incorrect
                        </span>
                      </div>
                    </div>
                  );
                }
                if (typeof msg.content === "string") {
                  return (
                    <div className="assistant-message">
                      <span dangerouslySetInnerHTML={{ __html: msg.content }} />
                      <div className="answerDisclaimerContainer">
                        <span className="answerDisclaimer">
                          AI-generated content may be incorrect
                        </span>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          ))}
        {generatingResponse && (
          <div className="assistant-message loading-indicator">
            <div className="typing-indicator">
              <span className="generating-text">Generating answer</span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
      </div>
      <div className="chat-footer">
        <Button
          className="btn-create-conv"
          shape="circular"
          appearance="primary"
          icon={<ChatAdd24Regular />}
          onClick={onNewConversation}
          title="Create new Conversation"
          disabled={
            generatingResponse || state.chatHistory.isHistoryUpdateAPIPending
          }
        />
        <div className="text-area-container">
          <Textarea
            className="textarea-field"
            value={userMessage}
            onChange={(e, data) => setUserMessage(data.value || "")}
            placeholder="Ask a question..."
            onKeyDown={handleKeyDown}
            ref={questionInputRef}
            rows={2}
            style={{ resize: "none" }}
            appearance="outline"
          />
          <DefaultButton
            iconProps={{ iconName: "Send" }}
            role="button"
            onClick={onClickSend}
            disabled={
              generatingResponse ||
              !userMessage.trim() ||
              state.chatHistory.isHistoryUpdateAPIPending
            }
            className="send-button"
            aria-disabled={
              generatingResponse ||
              !userMessage ||
              state.chatHistory.isHistoryUpdateAPIPending
            }
            title="Send Question"
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
