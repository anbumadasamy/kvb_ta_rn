import {
  View,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useState, useContext, useEffect } from "react";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import { useNavigation } from "@react-navigation/native";
import ChatCard from "../../components/cards/ChatCard";
import AlertCredentialError from "../../components/toast/AlertCredentialError"
import { Ionicons } from "@expo/vector-icons";
import ToastMessage from "../../components/toast/ToastMessage";
import { CustomColors } from "../../utilities/CustomColors";

let chatSummaryArray = [];

export default function ChatboxScreen({ route }) {
  const [chat, setChat] = useState("");
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const [chatSummary, setChatSummary] = useState([]);
  const [travelNo, setTravelNo] = useState();
  const [pagination, setPagination] = useState(true);
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    setTravelNo(route.params.travelId);
  });

  useState(() => {
    if (pagination) {
      GetChatSummary();
    }
  }, [pageNo]);

  async function GetChatSummary() {
    let url = URL.CHAT_SUMMARY_LIST + travelNo + "page=" + pageNo;

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
          let message;
          let temp = json.data[i].Chats.comment.split("<p>");
          if (temp[0] == "<p>" && temp[temp.length - 1] == "</p>") {
            message = temp;
          }
          const obj = {
            chatId: json.data[i].chatid,
            employeeName: json.data[i].employee_name,
            comment: json.data[i].chatid,
            isMaker: json.data[i].Chats.ismaker,
          };
          chatSummaryArray.push(obj);
        }
        setChatSummary([...chatSummary, ...chatSummaryArray]);
        chatSummaryArray = [];
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function send() {
    try {
      const response = await fetch(URL.SEND_CHAT, {
        method: "POST",
        body: JSON.stringify({
          approver_id: "1",
          comment: chat,
          ref_type: 1,
          request: parseInt(travelNo),
          type: 1,
        }),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      if (json) {
        if (json.message) {
          ToastMessage(json.message);
          navigation.goBack();
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      style={styles.safeAreaViewContainer}
    >
      <ImageBackground
        style={styles.imageContainer}
        source={require("../../assets/images/chat_bg.jpg")}
      >
        <View style={styles.screenContainer}>
          <ScrollView
          style={{marginTop: 15, marginBottom: 20}}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}
          >
            <ChatCard
              data={chatSummary}
              scroll={() => {
                setPageNo(pageNo + 1);
              }}
            />
          </ScrollView>
          <View style={styles.sendContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Message"
              onChangeText={(value) => {
                setChat(value);
              }}
            ></TextInput>
            <Pressable onPress={send}>
              <Ionicons name="ios-send-sharp" size={24} color="black" />
            </Pressable>
            {/* <SubmitButton children = "Send" onPressEvent={send}/> */}
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    marginLeft: "4%",
    marginRight: "4%",
    marginBottom: "3%",
  },
  safeAreaViewContainer: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    resizeMode: "cover",
  },
  sendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    backgroundColor: CustomColors.primary_white,
    borderRadius: 15,
    padding: 8,
    marginBottom: 50,
  },
  textInput: {
    height: 50,
    color: CustomColors.primary_dark,
  },
});
