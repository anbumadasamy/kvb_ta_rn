import { View, Text, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import SearchDialog from "../../components/dialog/SearchDialog";
import InputSelect from "../../components/ui/InputSelect";
import CommentBox from "../../components/ui/CommentBox";
import HeaderBox from "../../components/ui/HeaderBox";
import AdvanceMakeDialog from "../../components/dialog/AdvanceMakeDialog";
import { CustomColors } from "../../utilities/CustomColors";

export default function AdvanceCreationScreen({ route }) {
  const [advanceMakeDialogStatus, setAdvanceMakeDialogStatus] = useState(false);
  const [approverBranchDialogStatus, setApproverBranchDialogStatus] =
    useState(false);
  const [approverNameDialogStatus, setApproverNameDialogStatus] =
    useState(false);
  const [editable] = useState(true);
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
    status: "Pending",
    reason: "",
  });

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setTravelAdvanceData((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  function AdvanceAmountCard() {
    return (
      <View
        style={{
          marginHorizontal: 5,
          borderBottomColor: CustomColors.primary_gray,
          borderBottomWidth: 0.8,
        }}
      >
        <View style={{ flexDirection: "row", padding: 2 }}>
          <Text style={{ fontSize: 14, color: CustomColors.text_gray }}>
            App Amount:{" "}
          </Text>
          <Text style={{ fontSize: 14, color: CustomColors.text_color }}>
            {travelAdvanceData.approvedAmount}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 2,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 14, color: CustomColors.text_gray }}>
              Req Amount:{" "}
            </Text>
            <Text style={{ fontSize: 14, color: CustomColors.text_color }}>
              {travelAdvanceData.reqAmount}
            </Text>
          </View>
          <View>
            <Text>{travelAdvanceData.status}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 2,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 14, color: CustomColors.text_gray }}>
              Approved By:{" "}
            </Text>
            <Text style={{ fontSize: 14, color: CustomColors.text_color }}>
              {travelAdvanceData.approverName}
            </Text>
          </View>
          <View>
            <Text>Create CCBS</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", padding: 2, marginBottom: 5 }}>
          <Text style={{ fontSize: 14, color: CustomColors.text_gray }}>
            Reason:{" "}
          </Text>
          <Text style={{ fontSize: 14, color: CustomColors.text_color }}>
            {travelAdvanceData.reason}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.mainContainer}>
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
            onInputCommentChanged={inputChangedHandler.bind(this, "comments")}
            editable={editable ? true : false}
          />
          <HeaderBox
            onPressEvent={() => {
              if (travelAdvanceData.approverName == "") {
                Alert.alert("Choose Approver");
                return;
              } else {
                setAdvanceMakeDialogStatus(true);
              }
            }}
            label="Make Advance Amount Here"
            icon={advanceCardStatus ? null : "add-circle-outline"}
          />
          {advanceCardStatus && AdvanceAmountCard()}
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
              setAdvanceCardStatus(true);
            }}
          />
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
