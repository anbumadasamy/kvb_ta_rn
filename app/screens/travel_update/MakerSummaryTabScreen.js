import * as React from "react";
import { useLayoutEffect, useContext, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import TravelMakerSummaryScreen from "./TravelMakerSummaryScreen";
import MakerAdvanceSummaryScreen from "./MakerAdvanceSummaryScreen";
import { AuthContext } from "../../data/Auth-Context";
import { MaterialIcons } from "@expo/vector-icons";
import { onOpen } from "react-native-actions-sheet-picker";
import { View } from "react-native";

const Tab = createMaterialTopTabNavigator();

function Tabs({
  travelDialogStatus,
  setTravelDialogStatus,
  advanceDialogStatus,
  setAdvanceDialogStatus,
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
            <TravelMakerSummaryScreen
              travelDialogStatus={travelDialogStatus}
              setTravelDialogStatus={setTravelDialogStatus}
            />
          );
        }}
        options={{ tabBarLabel: "Travel Summary" }}
      />
      <Tab.Screen
        name="Advance Summary"
        children={() => {
          return (
            <MakerAdvanceSummaryScreen
            advanceDialogStatus={advanceDialogStatus}
            setAdvanceDialogStatus={setAdvanceDialogStatus}
            />
          );
        }}
        options={{ tabBarLabel: "Advance Summary" }}
      />
    </Tab.Navigator>
  );
}
export default function MakerSummaryTabScreen() {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  const [advanceDialogStatus, setAdvanceDialogStatus] = useState(false);
  const [travelDialogStatus, setTravelDialogStatus] = useState(false);

  let MAKER_SUMMARY_TYPE = authCtx.makerSummaryType;
  useLayoutEffect(() => {
    if (MAKER_SUMMARY_TYPE === "TRAVEL_SUMMARY") {
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
                    onOpen("makerSummaryFilter");
                  }}
                />
              </View>
            </View>
          );
        },
      });
    } else if (MAKER_SUMMARY_TYPE === "CANCEL_SUMMARY") {
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
                    setAdvanceDialogStatus(!advanceDialogStatus);
                  }}
                />
              </View>
              <View>
                <MaterialIcons
                  name={"filter-list"}
                  size={24}
                  color="white"
                  onPress={() => onOpen("cancelSummaryFilter")}
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
      travelDialogStatus={travelDialogStatus}
      setTravelDialogStatus={setTravelDialogStatus}
      advanceDialogStatus={advanceDialogStatus}
      setAdvanceDialogStatus={setAdvanceDialogStatus}
      makerSummaryTypeAuthCtx={authCtx}
    />
  );
}
