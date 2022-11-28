import * as React from "react";
import { useLayoutEffect, useContext, useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Claim from "../reimbursement/Claim";
import MemberApproval from "../reimbursement/MemberApproval";
import { AuthContext } from "../../data/Auth-Context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { onOpen } from "react-native-actions-sheet-picker";
import { Text, View } from "react-native";
import { URL } from "../../utilities/UrlBase";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

const Tab = createMaterialTopTabNavigator();

function MyTabs({
  from,
  previous,  
  dialogstatus,
  setdialogstatus,
  rmdialogstatus,
  setrmdialogstatus,
  onbehalfdialogstatus,
  setonbehalfdialogstatus,
}) {
 
  return (
    <Tab.Navigator
      initialRouteName="Claim"
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen
        name="Claim"
        children={() => {
          return (
            <Claim
              from={from}
              previous={previous}
              dialogstatus={dialogstatus}
              setdialogstatus={setdialogstatus}
            />
          );
        }}
        options={{ tabBarLabel: "Claim" }}
      />
      <Tab.Screen
        name="MemberApproval"
        children={() => {
          return (
            <MemberApproval
              from={from}
              previous={previous}
              dialogstatus={rmdialogstatus}
              setdialogstatus={setrmdialogstatus}
              onbehalfdialogstatus={onbehalfdialogstatus}
              setonbehalfdialogstatus={setonbehalfdialogstatus}
            />
          );
        }}
        options={{ tabBarLabel: "RM Approval" }}
      />
    </Tab.Navigator>
  );
}
export default function ReimbursementScreen({ navigation, route }) {
  const authCtx = useContext(AuthContext);
  const [dialogstatus, setdialogstatus] = useState(false);
  const [rmdialogstatus, setrmdialogstatus] = useState(false);
  const [onbehalfof, setonbehalfof] = useState(false);
  const [onbehalfdialogstatus, setonbehalfdialogstatus] = useState(false);

  let from;
  let previous;
  let ReimType1 = authCtx.reimbursementType;

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
  /* useEffect(() => {
    Ceoteamcheck();
  }); */

  /* async function Ceoteamcheck() {
   
    try {
      const response = await fetch(URL.CEO_TEAMCHECK, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      const json = await response.json();
      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }
      else{
      setonbehalfof(json.onbehalf);
      }
    } catch (error) {
      setProgressBar(false);
    } finally {
    }
  } */


  useLayoutEffect(() => {
    if (ReimType1 === "CLAIM") {
      navigation.setOptions({
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
              Reimbursement
            </Text>
          </View>
        ),

        headerShown: true,
        headerRight: () => {
          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
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
                  onPress={
                    () =>
                      onOpen("travelclaimlist") 
                  }
                />
              </View>
            </View>
          );
        },
      });
    } else if (ReimType1 == "MEMBERAPPROVAL") {
      navigation.setOptions({
        headerTitle: (props) => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 20,
                textAlign: "right",
                alignItems: "center",
              }}
            >
              Reimbursement
            </Text>
          </View>
        ),
        headerShown: true,
        headerRight: () => {
          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {onbehalfof && (
                <View style={{ marginRight: 20 }}>
                  <MaterialIcons
                    name={"person-search"}
                    size={24}
                    color="white"
                    onPress={() => {
                      setonbehalfdialogstatus(!onbehalfdialogstatus);
                    }}
                  />
                </View>
              )}
              <View style={{ marginRight: 20 }}>
                <MaterialIcons
                  name={"search"}
                  size={24}
                  color="white"
                  onPress={() => {
                    setrmdialogstatus(!rmdialogstatus);
                  }}
                />
              </View>

              <View>
                <MaterialIcons
                  name={"filter-list"}
                  size={24}
                  color="white"
                  onPress={() => onOpen("memberapprovallist")}
                />
              </View>
            </View>
          );
        },
      });
    }
  }, [ReimType1, onbehalfof]);

  return (
    <MyTabs
      ReimType_authCtx={authCtx}
      from={from}
      previous={previous}
      dialogstatus={dialogstatus}
      setdialogstatus={setdialogstatus}
      rmdialogstatus={rmdialogstatus}
      setrmdialogstatus={setrmdialogstatus}
      onbehalfdialogstatus={onbehalfdialogstatus}
      setonbehalfdialogstatus={setonbehalfdialogstatus}
    />
  );
}
