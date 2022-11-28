import * as React from "react";
import { useLayoutEffect, useContext, useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import TravelApprovelSummaryScreen from "./TravelApprovelSummaryScreen";
import CancelApprovelSummaryScreen from "./CancelApprovelSummaryScreen";
import { AuthContext } from "../../data/Auth-Context";
import { MaterialIcons } from "@expo/vector-icons";
import { onOpen } from "react-native-actions-sheet-picker";
import { View } from "react-native";

const Tab = createMaterialTopTabNavigator();

function MemberTabs({
  travelDialogStatus,
  setTravelDialogStatus,
  cancelDialogStatus,
  setCancelDialogStatus,
  onBehalfDialogStatus,
  setOnBehalfDialogStatus,
}) {
  return (
    <Tab.Navigator
      initialRouteName="Travel Approvel Summary"
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen
        name="Travel Approvel Summary"
        children={() => {
          return (
            <TravelApprovelSummaryScreen
              travelDialogStatus={travelDialogStatus}
              setTravelDialogStatus={setTravelDialogStatus}
              onBehalfDialogStatus={onBehalfDialogStatus}
              setOnBehalfDialogStatus={setOnBehalfDialogStatus}
            />
          );
        }}
        options={{ tabBarLabel: "Travel Summary" }}
      />
      <Tab.Screen
        name="Cancel Approvel Summary"
        children={() => {
          return (
            <CancelApprovelSummaryScreen
              cancelDialogStatus={cancelDialogStatus}
              setCancelDialogStatus={setCancelDialogStatus}
            />
          );
        }}
        options={{ tabBarLabel: "Cancel Summary" }}
      />
    </Tab.Navigator>
  );
}
export default function MemberTravelApprovalScreen() {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  const [travelDialogStatus, setTravelDialogStatus] = useState(false);
  const [cancelDialogStatus, setCancelDialogStatus] = useState(false);
  const [onBehalfDialogStatus, setOnBehalfDialogStatus] = useState(false);

  let MEMBER_TYPE = authCtx.memberType;

  useLayoutEffect(() => {
    if (MEMBER_TYPE === "TRAVEL_APPROVEL") {
      navigation.setOptions({
        headerShown: true,
        headerRight: () => {
          return (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ marginRight: 20 }}>
                {authCtx.ceoPermission && (
                  <MaterialIcons
                    name={"person-search"}
                    size={24}
                    color="white"
                    onPress={() => {
                      setOnBehalfDialogStatus(!onBehalfDialogStatus);
                    }}
                  />
                )}
              </View>
              <View style={{ marginRight: 20 }}>
                <MaterialIcons
                  name={"search"}
                  size={24}
                  color="white"
                  onPress={() => {
                    setTravelDialogStatus(!travelDialogStatus);
                  }}
                />
              </View>
              <View>
                <MaterialIcons
                  name={"filter-list"}
                  size={24}
                  color="white"
                  onPress={() => {
                    onOpen("memberApplovelFilter");
                  }}
                />
              </View>
            </View>
          );
        },
      });
    } else if (MEMBER_TYPE === "CANCEL_APPROVEL") {
      navigation.setOptions({
        headerShown: true,
        headerRight: () => {
          return (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ marginRight: 20 }}>
                <MaterialIcons
                  name={"search"}
                  size={24}
                  color="white"
                  onPress={() => {
                    setCancelDialogStatus(!cancelDialogStatus);
                  }}
                />
              </View>
              <View>
                <MaterialIcons
                  name={"filter-list"}
                  size={24}
                  color="white"
                  onPress={() => {
                    onOpen("memberCancelApprovelFilter");
                  }}
                />
              </View>
            </View>
          );
        },
      });
    }
  }, [MEMBER_TYPE]);

  return (
    <MemberTabs
      travelDialogStatus={travelDialogStatus}
      setTravelDialogStatus={setTravelDialogStatus}
      cancelDialogStatus={cancelDialogStatus}
      setCancelDialogStatus={setCancelDialogStatus}
      onBehalfDialogStatus={onBehalfDialogStatus}
      setOnBehalfDialogStatus={setOnBehalfDialogStatus}
      memberType_authCtx={authCtx}
    />
  );
}
