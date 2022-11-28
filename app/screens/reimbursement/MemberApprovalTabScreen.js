import * as React from "react";
import {
  useEffect,
  useLayoutEffect,
  useState,
  useContext,
} from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { AuthContext } from "../../data/Auth-Context";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import CCBS from "./CCBS";
import MemberApprovalExpense from "./MemberApprovalExpense";
import { CustomColors } from "../../utilities/CustomColors";
import { FloatingAction } from "react-native-floating-action";
import ApprovelReasonDialog from "../../components/dialog/ApprovelReasonDialog";
import { URL } from "../../utilities/UrlBase";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import RMtoFM from "../../components/dialog/RMtoFM";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

const Tab = createMaterialTopTabNavigator();

function MyTabs({ tournumber, setinvoiceheadergid }) {
  return (
    <Tab.Navigator
      initialRouteName="CCBS"
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen
        name="Expenses"
        children={() => {
          return (
            <MemberApprovalExpense
              tourid={tournumber}
              setinvoiceheadergid={setinvoiceheadergid}
            />
          );
        }}
        options={{ tabBarLabel: "Expenses" }}
      />
      <Tab.Screen
        name="CCBS"
        children={() => {
          return <CCBS tourid={tournumber} />;
        }}
        options={{ tabBarLabel: "CCBS" }}
      />
    </Tab.Navigator>
  );
}
export default function MemberApprovalTabScreen({ navigation, route }) {
  const authCtx = useContext(AuthContext);
  const TourId = route.params.TourId;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  const ReqDate = route.params.ReqDate;
  const [visiblestatus, setvisiblestatus] = useState(false);
  const [skip, setskip] = useState(false);
  const [skipDialog, setSkipDialog] = useState(false);
  const [getstatus, setstatus] = useState("");
  const [invoiceheadergid, setinvoiceheadergid] = useState("");
  const [progressBar, setProgressBar] = useState(false);

  let previous;
  let obj;
  let url;

  useEffect(() => {
    if (route.params.previous == true) {
      previous = false;
    } else {
      previous = true;
    }

    if (route.params.from != "MemberApproval") {
      switch (route.params.claim_status_id) {
        case 2:
          setvisiblestatus(true);
          switch (route.params.max_applevel) {
            case 1:
              setstatus("RM Level Pending");
              setskip(true);
              break;
            case 2:
              setstatus("FH Level Pending");
              setskip(true);
              break;
            case 3:
              setstatus("Admin Level Pending");
              break;
          }
          break;
        case 3:
          setstatus("Approved");
          setvisiblestatus(true);
          break;
        case 4:
          setstatus("Rejected");
          setvisiblestatus(true);

          break;
        case 5:
          setstatus("Return");
          setvisiblestatus(true);
          break;
      }
    } else if (route.params.from == "MemberApproval") {
      setstatus(route.params.claim_status);
      if (route.params.claim_status != "PENDING") {
        setvisiblestatus(true);
      }
    } else if (route.params.from == "MemberApproval") {
      setvisiblestatus(false);
      setstatus("");
    }
  }, [route]);

 

  const [dialogStatus, setDialogStatus] = useState(false);
  const [reason, setreason] = useState("");
  const [buttontext, setbuttontext] = useState("");
  const [actionPosition, setActionPosition] = useState();

  const action = [
    {
      text: "Approve",
      icon: require("../../assets/icons/approve.png"),
      name: "Approve",
      position: 1,
      color: CustomColors.primary_green,
    },
    {
      text: "Return",
      icon: require("../../assets/icons/return.png"),
      name: "Return",
      position: 2,
      color: CustomColors.primary_violet,
    },
    {
      text: "Reject",
      icon: require("../../assets/icons/reject.png"),
      name: "Reject",
      position: 3,
      color: CustomColors.primary_red,
    },
  ];

  function MemberAction(name) {
    obj = {
      id: route.params.AppgId,
      appcomment: reason,
      apptype: "claim",
    };
    if ("onbehalfid" in route.params) {
      if (route.params.onbehalfid != "") {
        obj["onbehalf"] = route.params.onbehalfid;
      }
    }
    switch (name) {
      case "Approve":
        url = URL.TRAVEl_APPROVE;
        obj["approvedby"] = 4;
        obj["status"] = 3;
        obj["tourgid"] = TourId;
        break;
      case "Return":
        url = URL.TRAVEl_RETURN;
        obj["tour_id"] = TourId;
        break;
      case "Reject":
        obj["tour_id"] = TourId;
        url = URL.TRAVEl_REJECT;
        break;
    }
    jsonpost();
  }
  async function openpdf() {
    try {
      WebBrowser.openBrowserAsync(
        URL.ECF_GET +
          parseInt(invoiceheadergid) +
          "?token=" +
          authCtx.auth_token.split(" ")[1]
      );

    } catch (error) {
     
    }
  }
  async function jsonpost() {
    setProgressBar(true);
    console.log(url+" Post Url")
    console.log(JSON.stringify(obj)+" Json Object")

   
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
    

      let json = await response.json();
      console.log(JSON.stringify(json)+"---> Response" )


      if (json) {
        if ("detail" in json) {
          if(json.detail == "Invalid credentials/token."){
          AlertCredentialError(json.detail, navigation);
          }
        }
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message)  
          // Alert.alert(json.message);
          navigation.goBack();
          navigation.goBack();
        } else {
          
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      setProgressBar(false);
      
    }
  }

  async function SkipToFH() {
    setProgressBar(true);
   
    try {
      const response = await fetch(URL.SKIP_APPROVER + TourId, {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();


      if (json) {
        if ("detail" in json) {
          if(json.detail == "Invalid credentials/token."){
          AlertCredentialError(json.detail, navigation);
          }
        }
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message)  
          // Alert.alert(json.message);
        
          navigation.goBack();
          navigation.goBack();
          // navigation.navigate("Maker Summary");
        } else if (json.status) {
          ToastMessage(json.status)  
         
          navigation.goBack();
          navigation.goBack();
        } else {
          Alert.alert(json.description);
          
        }
      }
    } catch (error) {
      setProgressBar(false);
    
    }
  }

  useEffect(() => {
    navigation.setOptions({
      title: "Expenses",
    });
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,

      headerLeft: () => {
        return (
          <View style={{ paddingRight: 30 }}>
            <MaterialIcons
              name={"arrow-back"}
              size={24}
              color="white"
              onPress={
                () => {
                  if (route.params.from == "Reimbursementtab") {
                    navigation.navigate("ReimbursementScreen", {
                      from: "MemberApprovalTabScreen",
                      previous: previous,
                    });
                  } else {
                    navigation.goBack();
                  }
                }
              }
            />
          </View>
        );
      },
      headerRight: () => {
        
        return (
          <View style={styles.mainrow}>
            <View>
              {invoiceheadergid != "" && (
                <FontAwesome5
                  name="file-pdf"
                  size={22}
                  color="white"
                  onPress={() => {
                    openpdf();
                  }}
                />
              )}
            </View>
            <View /* style={styles.file} */>
              {skip && (
                <MaterialIcons
                  name="skip-next"
                  size={24}
                  color="white"
                  onPress={() => {
                    setSkipDialog(true);
                  }}
                />
              )}
            </View>
            <View style={styles.file}>
              <MaterialIcons
                name="remove-red-eye"
                size={22}
                color="white"
                onPress={() => {
                  navigation.navigate("Approval Flow", { travelNo: TourId });
                }}
              />
            </View>
          </View>
        );
      },
    });
  }, [invoiceheadergid, skip]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {progressBar ? (
        <View
          style={{
            flex: 1,
            backgroundColor: CustomColors.primary_white,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View>
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../../assets/icons/Progressbar.gif")}
            />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View>
            <View style={styles.row}>
              <Text style={styles.text}>Travel No: {TourId}</Text>
              <Text style={styles.text}>{FromDate}</Text>
              <Text style={styles.text}>{ToDate}</Text>
            </View>
          </View>
          <View style={styles.tab}>
            <MyTabs
              ReimType_authCtx={authCtx}
              tournumber={TourId}
              setinvoiceheadergid={setinvoiceheadergid}
            />
          </View>
          <View>
            {getstatus == "PENDING" ? (
              <View style={styles.floatingbutton}>
                <FloatingAction
                  actions={action}
                  onPressItem={(name) => {
                    setActionPosition(name);
                    setDialogStatus(true);
                    setbuttontext(name);
                  }}
                  color="#FFBB4F"
                  tintColor="white"
                />
              </View>
            ) : (
              <View></View>
            )}

            {skipDialog && (
              <RMtoFM
                dialogstatus={skipDialog}
                setDialogstatus={() => {
                  setSkipDialog(!skipDialog);
                }}
                onPress={() => {
                  SkipToFH();
                }}
              />
            )}

            {dialogStatus && (
              <ApprovelReasonDialog
                dialogStatus={dialogStatus}
                setDialogStatus={setDialogStatus}
                tittle=""
                setValue={setreason}
                value={reason}
                buttontext={buttontext}
                selectedPosition={setActionPosition}
                onPressEvent={() => {
                  if (reason != "") {
                    MemberAction(actionPosition);
                    setDialogStatus(!dialogStatus);
                  } else {
                    Alert.alert("Please enter a reason");
                  }
                }}
              ></ApprovelReasonDialog>
            )}
          </View>
          {visiblestatus && (
            <View style={styles.buttonOuterContainer}>
              <Text style={styles.buttonText}>{getstatus}</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: CustomColors.screen_background_gray,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  mainrow: {
    flexDirection: "row",
    padding: 2,
    justifyContent: "space-between",
  },
  text: {
    fontWeight: "normal",
    color: "black",
    fontSize: 12,

    margin: 10,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  floatingbutton: {
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
  screen: {
    flex: 1,
    marginLeft: "4%",
    marginRight: "4%",
    marginBottom: "3%",

    marginBottom: "3%",
  },
  buttonOuterContainer: {
    height: 60,
    width: "100%",
    backgroundColor: CustomColors.primary_green,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: CustomColors.primary_white,
    textAlign: "center",
    fontWeight: "bold",
  },
  file: {
    marginLeft: 25,
  },
});
