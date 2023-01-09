import { AuthContext } from "../../data/Auth-Context";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import ToastMessage from "../../components/toast/ToastMessage";
import { URL } from "../../utilities/UrlBase";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  Pressable,
} from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import LogoutDialog from "../../components/dialog/LogoutDialog";

let travelManagmentArray = [];

export default function TravelManagmentScreen() {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [logoutDialogFlag, setLogoutDialogFlag] = useState(false);
  const [traveManagmentList, setTraveManagmentList] = useState([]);

  const TravelManagmentData = [
    {
      id: 1,
      icon: "planet",
      iconColor: "#f39c12",
      title: "Travel Creation",
      flag: authCtx.travelMaker,
    },
    {
      id: 2,
      icon: "reader",
      iconColor: "#3498db",
      title: "Travel Summary (M)",
      flag: authCtx.travelMaker,
    },
    {
      id: 8,
      icon: "reader",
      iconColor: "#3498db",
      title: "Cancel Summary (M)",
      flag: authCtx.travelMaker,
    },
    {
      id: 3,
      icon: "thumbs-up-sharp",
      iconColor: "#8e44ad",
      title: "Travel Summary (C)",
      flag: authCtx.travelApprover,
    },
    {
      id: 9,
      icon: "thumbs-down-sharp",
      iconColor: "#f1c40f",
      title: "Cancel Summary (C)",
      flag: authCtx.travelApprover,
    },
    {
      id: 4,
      icon: "flag",
      iconColor: "#01C38E",
      title: "Reimbursement",
      flag: true,
    },
    {
      id: 5,
      icon: "flash",
      iconColor: "#e85151",
      title: "On-Going",
      flag: authCtx.travelMaker,
    },
    {
      id: 6,
      icon: "time",
      iconColor: "#34495e",
      title: "History",
      flag: authCtx.travelMaker,
    },
    {
      id: 7,
      icon: "ios-paper-plane-sharp",
      iconColor: "#f1c40f",
      title: "On Behalf Of",
      flag: authCtx.travelOnBehalfOf && authCtx.travelMaker ? true : false,
    },
  ];

  useEffect(() => {
    for (let i = 0; i < TravelManagmentData.length; i++) {
      if (TravelManagmentData[i].flag == true) {
        travelManagmentArray.push(TravelManagmentData[i]);
      }
    }
    setTraveManagmentList(travelManagmentArray);
    travelManagmentArray = [];
  }, []);

  async function logout() {
    navigation.navigate("LoginScreen");
    try {
      const response = await fetch(URL.LOGOUT_URL, {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      if (json) {
        if (json.message) {
          ToastMessage(json.message);
          authCtx.logout;
        } else {
          authCtx.logout;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  function ClickEvent(id) {
    switch (id) {
      case 1:
        navigation.navigate("Travel Creation", {
          itineraryDetails: null,
          onBehalfOf: authCtx.travelOnBehalfOf,
          from: "Travel_Managment",
          status: 101,
        });
        break;
      case 2:
        navigation.navigate("Maker Summary");
        break;
      case 3:
        navigation.navigate("Checker Summary");
        break;
      case 4:
        navigation.navigate("ReimbursementScreen");
        break;
      case 5:
        navigation.navigate("OnGoingTravelScreen");
        break;
      case 6:
        navigation.navigate("TravelHistoryScreen");
        break;
      case 7:
        navigation.navigate("On Behalf Of");
        break;
      case 8:
        navigation.navigate("Cancel Maker");
        break;
      case 9:
        navigation.navigate("Cancel Approval");
        break;
    }
  }

  function TravelManagmentDataItem(itemData) {
    return (
      <Pressable
        style={[
          styles.gridBoxContainer,
          {
            maxWidth: "50%",
            backgroundColor: CustomColors.primary_white,
            borderBottomWidth: 1,
            borderBottomColor: CustomColors.primary_gray,
            marginTop: 5,
            margin: 5,
          },
        ]}
        onPress={() => {
          ClickEvent(itemData.item.id);
        }}
      >
        <Ionicons
          name={itemData.item.icon}
          size={30}
          color={itemData.item.iconColor}
        />
        <Text style={styles.gridTitleText}>{itemData.item.title}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Hi! {authCtx.user_name}</Text>
        <View style={{ marginTop: Platform.OS == "ios" ? 20 : 0 }}>
          <Ionicons
            onPress={() => {
              setLogoutDialogFlag(!logoutDialogFlag);
            }}
            name="log-out-outline"
            size={24}
            color="white"
          />
        </View>
      </View>
      <View
        style={{
          padding: 7,
          marginLeft: "4%",
          marginRight: "4%",
          marginTop: 20,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16, color: "black" }}>
          TA eClaim
        </Text>
      </View>
      <View style={styles.gridContainer}>
        <FlatList
          data={traveManagmentList}
          keyExtractor={(item) => item.id}
          renderItem={TravelManagmentDataItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}
        />

        {logoutDialogFlag && (
          <LogoutDialog
            dialogstatus={logoutDialogFlag}
            userName={authCtx.user_name}
            setDialogstatus={setLogoutDialogFlag}
            onPressLogout={logout}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: CustomColors.primary_white,
  },
  greetingContainer: {
    padding: 10,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: CustomColors.primary_green,
  },
  greetingText: {
    marginTop: Platform.OS == "ios" ? 20 : 0,
    fontSize: 20,
    padding: 4,
    fontWeight: "bold",
    color: CustomColors.primary_white,
  },
  gridContainer: {
    flex: 1,
    marginLeft: "3%",
    marginRight: "3%",
    flexDirection: "column",
    borderRadius: 5,
    marginTop: 8,
    marginBottom: "3%",
  },
  gridBoxContainer: {
    flex: 1,
    height: 120,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  gridTitleText: {
    color: CustomColors.primary_dark,
    fontSize: 14,
    marginTop: 20,
  },
});
