import * as React from "react";
import { useLayoutEffect, useContext, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import OnBehalfOfTravelScreen from "./OnBehalfOfTravelScreen";
import Claim from "../reimbursement/Claim";

import { Text, View } from "react-native";

import { AuthContext } from "../../data/Auth-Context";
import { MaterialIcons } from "@expo/vector-icons";
import { onOpen } from "react-native-actions-sheet-picker";

const Tab = createMaterialTopTabNavigator();

function Tabs({
  from,
  previous,
  dialogstatus,
  setdialogstatus,
  onBehalfofDialogstatus,
  setOnbehalfOfDialogstatus,

  travelNoDialogStatus,
  setTravelNoDialogStatus,
  empSearchDialogStatus,
  setEmpSearchDialogStatus,
}) {
  return (
    <Tab.Navigator
      initialRouteName="Travel Summary"
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen
        name="Travel Summary"
        children={() => {
          return (
            <OnBehalfOfTravelScreen
              travelNoDialogStatus={travelNoDialogStatus}
              setTravelNoDialogStatus={setTravelNoDialogStatus}
              empSearchDialogStatus={empSearchDialogStatus}
              setEmpSearchDialogStatus={setEmpSearchDialogStatus}
            />
          );
        }}
        options={{ tabBarLabel: "Travel" }}
      />
      <Tab.Screen
        name="Claim"
        children={() => {
          return (
            <Claim
              from={from}
              previous={previous}
              dialogstatus={dialogstatus}
              setdialogstatus={setdialogstatus}
              onBehalfofDialogstatus={onBehalfofDialogstatus}
              setOnbehalfOfDialogstatus={setOnbehalfOfDialogstatus}
            />
          );
        }}
        options={{ tabBarLabel: "Claim" }}
      />
    </Tab.Navigator>
  );
}
export default function OnBehalfOfTabScreen({ route }) {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const [dialogstatus, setdialogstatus] = useState(false);
  const [onBehalfofDialogstatus, setOnbehalfOfDialogstatus] = useState(false);

  const [travelNoDialogStatus, setTravelNoDialogStatus] = useState(false);
  const [empSearchDialogStatus, setEmpSearchDialogStatus] = useState(false);

  let from;
  let previous;

  if ("params" in route) {
    if (route.params != null) {
      from = route.params.from;
      previous = route.params.previous;
    } else {
      from = route.name;
      previous = true;
    }
  } else {
    from = route.name;
    previous = true;
  }

  let MAKER_SUMMARY_TYPE = authCtx.makerSummaryType;

  useLayoutEffect(() => {
    if (MAKER_SUMMARY_TYPE == "TRAVEL_SUMMARY") {
      navigation.setOptions({
        headerShown: true,
        headerTitle: (props) => (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 20,
                textAlign: "right",
                alignItems: "center",
              }}
            >
              On Behalf Of
            </Text>
          </View>
        ),
        headerRight: () => {
          return (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ marginRight: 20 }}>

              <MaterialIcons 
              name="person-search" 
              size={24} 
              color="white"
              onPress={() => {
                setEmpSearchDialogStatus(!empSearchDialogStatus);
              }} />
               {/*  <Ionicons
                  name={"ios-paper-plane-sharp"}
                  size={24}
                  color="white"
                  
                /> */}
              </View>

              <View style={{ marginRight: 20 }}>
                <MaterialIcons
                  name={"search"}
                  size={24}
                  color="white"
                  onPress={() => {
                    setTravelNoDialogStatus(!travelNoDialogStatus);
                  }}
                />
              </View>

              <View>
                <MaterialIcons
                  name={"filter-list"}
                  size={24}
                  color="white"
                  onPress={() => {
                    onOpen("onBehalfOfSummaryFilter");
                  }}
                />
              </View>
            </View>
          );
        },
      });
    } else if (MAKER_SUMMARY_TYPE == "CLAIM") {
      navigation.setOptions({
        headerShown: true,
        headerTitle: (props) => (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 20,
                textAlign: "right",
                alignItems: "center",
              }}
            >
              On Behalf Of
            </Text>
          </View>
        ),
        headerRight: () => {
          return (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ marginRight: 20 }}>
              <MaterialIcons 
              name="person-search" 
              size={24} 
              color="white"
              onPress={() => {
                setOnbehalfOfDialogstatus(!onBehalfofDialogstatus);
              }} />
                {/* <Ionicons
                  name={"ios-paper-plane-sharp"}
                  size={24}
                  color="white"
                  onPress={() => {
                    setOnbehalfOfDialogstatus(!onBehalfofDialogstatus);
                  }}
                /> */}
              </View>

              <View style={{ marginRight: 20 }}>
                <MaterialIcons
                  name={"search"}
                  size={24}
                  color="white"
                  onPress={() => {
                    setdialogstatus(!dialogstatus);
                  }}
                />
              </View>

              <View>
                <MaterialIcons
                  name={"filter-list"}
                  size={24}
                  color="white"
                  onPress={() => onOpen("travelclaimlist")}
                />
              </View>
            </View>
          );
        },
      });
    }
  }, [MAKER_SUMMARY_TYPE]);

  return (
    <Tabs
      makerSummaryTypeAuthCtx={authCtx}
      from={from}
      previous={previous}
      dialogstatus={dialogstatus}
      setdialogstatus={setdialogstatus}
      onBehalfofDialogstatus={onBehalfofDialogstatus}
      setOnbehalfOfDialogstatus={setOnbehalfOfDialogstatus}
      travelNoDialogStatus={travelNoDialogStatus}
      setTravelNoDialogStatus={setTravelNoDialogStatus}
      empSearchDialogStatus={empSearchDialogStatus}
      setEmpSearchDialogStatus={setEmpSearchDialogStatus}
    />
  );
}
