import { useEffect, useState, useContext, useLayoutEffect } from "react";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import { View, StyleSheet, Text, LogBox, Image } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ChatTravelSummaryCard from "../../components/cards/ChatTravelSummaryCard";

let chatSummaryArray = [];

export default function ChatSummaryScreen({ route }) {
  const authCtx = useContext(AuthContext);
  const [chatSummary, setChatSummary] = useState([]);

  const [progressBar, setProgressBar] = useState(true);
  const [pagination, setPagination] = useState(true);
  const [pageNo, setPageNo] = useState(1);

  console.log("Page No :>> " + JSON.stringify(pageNo));

  useLayoutEffect(() => {
    LogBox.ignoreLogs([
      "Deprecation warning: value provided is not in a recognized RFC2822 or ISO format.",
    ]);
  });

  useEffect(() => {
    if (pagination) {
      chatSummaryArray = [];
      GetChatSummary();
    }
  }, [pageNo]);

  console.log("Chat Summary :>> " + JSON.stringify(chatSummary));

  async function GetChatSummary() {
    let url = URL.CHAT_SUMMARY_LIST + "page=" + pageNo;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      console.log("chat summary json ::: " + JSON.stringify(json));

      if (json.data) {
        if ("pagination" in json) {
          setPagination(json.pagination.has_next);
        } else {
          setPagination(true);
        }

        for (let i = 0; i < json.data.length; i++) {
          const obj = {
            travelId: json.data[i].Chats.travel_id,
            chatId: json.data[i].Chats.chatid,
            createdDate: json.data[i].Chats.created_date,
            employeeName: json.data[i].Chats.employee_name,
            unreadMessage: json.data[i].Chats.unread_message,
            comment: json.data[i].Chats.comment,
          };
          chatSummaryArray.push(obj);
        }
        setChatSummary([...chatSummary, ...chatSummaryArray]);
      }

      setProgressBar(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.safeAreaViewContainer}>
      <View style={styles.screenContainer}>
        {progressBar ? (
          <View
            style={{
              flex: 1,
              backgroundColor: CustomColors.screen_background_gray,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View>
              <Image
                style={{ width: 100, height: 100 }}
                source={require("../../assets/icons/Progressbar2.gif")}
              />
            </View>
          </View>
        ) : (
          <View>
            {chatSummary.length > 0 ? (
              <View>
                <ChatTravelSummaryCard
                  scroll={() => {
                    setPageNo(pageNo + 1);
                  }}
                  data={chatSummary}
                />
              </View>
            ) : (
              <Text style={styles.noDataFoundText}>No data found</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noDataFoundText: {
    marginTop: "50%",
    fontSize: 15,
    textAlign: "center",
    color: CustomColors.primary_gray,
  },
  screenContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: CustomColors.screen_background_gray,
  },
});
