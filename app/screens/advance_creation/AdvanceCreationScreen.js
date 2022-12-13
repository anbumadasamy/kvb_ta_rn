import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  LogBox,
} from "react-native";
import { useState, useEffect, useContext, useLayoutEffect } from "react";
import SearchDialog from "../../components/dialog/SearchDialog";
import { useNavigation } from "@react-navigation/native";
import InputSelect from "../../components/ui/InputSelect";
import ToastMessage from "../../components/toast/ToastMessage";
import CommentBox from "../../components/ui/CommentBox";
import { URL } from "../../utilities/UrlBase";
import SubmitButton from "../../components/ui/SubmitButton";
import { AuthContext } from "../../data/Auth-Context";
import HeaderBox from "../../components/ui/HeaderBox";
import AdvanceMakeDialog from "../../components/dialog/AdvanceMakeDialog";
import { CustomColors } from "../../utilities/CustomColors";
import AdvanceClaimCard from "../../components/cards/AdvanceClaimCard";

let advanceDataArray = [];
let ccBsDataArray = [];

export default function AdvanceCreationScreen({ route }) {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  let position = "";
  const [advanceMakeDialogStatus, setAdvanceMakeDialogStatus] = useState(false);
  const [approverBranchDialogStatus, setApproverBranchDialogStatus] =
    useState(false);
  const [approverNameDialogStatus, setApproverNameDialogStatus] =
    useState(false);
  const [editable] = useState(route.params.status == -1);
  const [advanceCardStatus, setAdvanceCardStatus] = useState(false);
  const [travelAdvanceData, setTravelAdvanceData] = useState({
    travelNo: route.params.travelNo,
    reqDate: route.params.reqDate,
    approverBranchId: "",
    approverBranch: "",
    approverName: "",
    approverId: "",
    comments: "",
    approvedAmount: "",
    reqAmount: "",
    status: route.params.status,
    statusText: route.params.statusText,
    reason: "",
    advanceData: [],
  });

  console.log("Travel Advance :>> " + JSON.stringify(travelAdvanceData));

  useLayoutEffect(() => {
    LogBox.ignoreLogs([
      "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
    ]);
    LogBox.ignoreLogs([
      "Non-serializable values were found in the navigation state.",
    ]);
    LogBox.ignoreLogs([
      "Can't perform a React state update on an unmounted component.",
    ]);
  });

  useEffect(() => {
    if (travelAdvanceData.status != -1) {
      TravelAdvanceDetail(route.params.travelNo);
    }
  }, []);

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setTravelAdvanceData((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  useEffect(() => {
    ccBsDataArray = [];

    if (
      route.params.advanceCCBSData != null &&
      "advanceCCBSData" in route.params
    ) {
      let position = "NEW";
      if (travelAdvanceData.advanceData.length != 0) {
        for (let i = 0; i < travelAdvanceData.advanceData.length; i++) {
          if (
            travelAdvanceData.advanceData[i].randomAdvId ==
            route.params.advanceCCBSData.randomAdvId
          ) {
            position = i;
          }
        }
      } else {
        position = "NEW";
      }

      if (position == "NEW") {
        ccBsDataArray.push(route.params.advanceCCBSData);
        inputChangedHandler("advanceData", [
          ...travelAdvanceData.advanceData,
          ...ccBsDataArray,
        ]);
      } else {
        travelAdvanceData.advanceData[position] = route.params.advanceCCBSData;
      }
    }
  }, [route]);

  useEffect(() => {
    if (position != "") {
      travelAdvanceData.advanceData[position].ccBsData = route.params.ccBsData;
    }
  }, [position]);

  async function TravelAdvanceDetail(travelNo) {
    const url = URL.TRAVEL_ADVANCE_SUMMARY + "/" + travelNo;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();
      console.log("Travel Advance Data :>> " + JSON.stringify(json));
    } catch (error) {
      console.error("Error :>> " + error);
    }
  }

  function AddAdvance() {
    advanceDataArray = [];
    setAdvanceCardStatus(true);
    const advanceObj = {
      id: "NEW",
      randomAdvId:
        Math.floor(Math.random() * 100) +
        1 +
        "" +
        Math.floor(Math.random() * 100) +
        1,
      appAmount: travelAdvanceData.approvedAmount,
      reqAmount: travelAdvanceData.reqAmount,
      approver: travelAdvanceData.approverName,
      reason: travelAdvanceData.reason,
      ccBsData: [],
    };

    advanceDataArray.push(advanceObj);

    inputChangedHandler("advanceData", [
      ...travelAdvanceData.advanceData,
      ...advanceDataArray,
    ]);
  }

  async function AdvanceCreation() {
    //  setProgressBar(true);
    try {
      const response = await fetch(URL.TRAVEL_CREATION, {
        method: "POST",
        body: advanceObj,
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      console.log("Response :>> " + JSON.stringify(json));

      if ("detail" in json) {
        if (json.detail == "Invalid token.") {
          AlertCredentialError(json.detail, navigation);
          return;
        }
      }

      if (json) {
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message);
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      //   setProgressBar(false);
      console.error(error);
    }
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.mainContainer}>
        <KeyboardAvoidingView
          behavior={"padding"}
          keyboardVerticalOffset="35"
          style={styles.screenContainer}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 14, color: CustomColors.text_gray }}>
                  Travel No:
                </Text>
                <Text style={{ fontSize: 14, color: CustomColors.text_color }}>
                  {" "}
                  {travelAdvanceData.travelNo}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 14, color: CustomColors.text_gray }}>
                  Req Date:
                </Text>
                <Text style={{ fontSize: 14, color: CustomColors.text_color }}>
                  {" "}
                  {travelAdvanceData.reqDate}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: CustomColors.text_color,
                  marginBottom: 20,
                }}
              >
                Choose Approver
              </Text>

              <InputSelect
                label="Approver Branch:*"
                hint="Choose Branch"
                selected={`${travelAdvanceData.approverBranch}`}
                onPressEvent={() => {
                  if (editable) {
                    setApproverBranchDialogStatus(true);
                  }
                }}
              />
              <InputSelect
                label="Approver Name:*"
                hint="Choose Name"
                selected={`${travelAdvanceData.approverName}`}
                onPressEvent={() => {
                  if (editable) {
                    if (travelAdvanceData.approverBranchId != "") {
                      setApproverNameDialogStatus(true);
                    } else {
                      Alert.alert("Choose Approver Branch");
                    }
                  }
                }}
              />

              {approverBranchDialogStatus && (
                <SearchDialog
                  dialogstatus={approverBranchDialogStatus}
                  setdialogstatus={setApproverBranchDialogStatus}
                  from="approver_branch"
                  setValue={inputChangedHandler.bind(this, "approverBranch")}
                  setId={(id) => {
                    inputChangedHandler("approverBranchId", id);
                  }}
                />
              )}

              {approverNameDialogStatus && (
                <SearchDialog
                  dialogstatus={approverNameDialogStatus}
                  setdialogstatus={setApproverNameDialogStatus}
                  branchId={travelAdvanceData.approverBranchId}
                  from="approver_name"
                  setValue={inputChangedHandler.bind(this, "approverName")}
                  setId={(id) => {
                    inputChangedHandler("approverId", id);
                  }}
                />
              )}

              <CommentBox
                label="Comments:"
                hint="Leave Your Comments..."
                inputComment={travelAdvanceData.comments}
                onInputCommentChanged={inputChangedHandler.bind(
                  this,
                  "comments"
                )}
                editable={editable ? true : false}
              />
              <HeaderBox
                onPressEvent={() => {
                  if (travelAdvanceData.approverName == "") {
                    Alert.alert("Choose Approver");
                    return;
                  } else {
                    navigation.navigate("CCBS", { ccbsData: null, approver: travelAdvanceData.approverName});
                    //  setAdvanceMakeDialogStatus(true);
                  }
                }}
                label={
                  advanceCardStatus
                    ? "Advance Details"
                    : "Make Advance Amount Here"
                }
                icon={advanceCardStatus ? null : "add-circle-outline"}
              />
              {travelAdvanceData.advanceData.length > 0 && (
                <AdvanceClaimCard data={travelAdvanceData.advanceData} />
              )}
            </View>
            {advanceMakeDialogStatus && (
              <AdvanceMakeDialog
                dialogstatus={advanceMakeDialogStatus}
                setDialogstatus={setAdvanceMakeDialogStatus}
                reason={travelAdvanceData.reason}
                setReason={inputChangedHandler.bind(this, "reason")}
                advanceAmount={travelAdvanceData.reqAmount}
                setAdvanceAmount={(value) => {
                  inputChangedHandler("reqAmount", value);
                  inputChangedHandler("approvedAmount", value);
                }}
                makeAdvance={() => {
                  AddAdvance();
                }}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View style={{ paddingBottom: 10 }}>
        {editable && (
          <SubmitButton onPressEvent={() => {}}>Claim Advance</SubmitButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    marginTop: 20,
    marginLeft: "4%",
    marginRight: "4%",
    marginBottom: "3%",
  },
});
