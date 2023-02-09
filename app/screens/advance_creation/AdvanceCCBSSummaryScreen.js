import HeaderBox from "../../components/ui/HeaderBox";
import SearchDialog from "../../components/dialog/SearchDialog";
import { CustomColors } from "../../utilities/CustomColors";
import { useNavigation } from "@react-navigation/native";
import CommentBox from "../../components/ui/CommentBox";
import InputSelect from "../../components/ui/InputSelect";
import InputText from "../../components/ui/InputText";
import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

export default function AdvanceCCBSSummaryScreen({ route }) {
  const navigation = useNavigation();
  const [editable] = useState(true);
  const [approverBranchDialogStatus, setApproverBranchDialogStatus] =
    useState(false);
  const [approverNameDialogStatus, setApproverNameDialogStatus] =
    useState(false);
  const [advanceData, setAdvanceData] = useState({
    randomAadvanceId:
      Math.floor(Math.random() * 100) +
      1 +
      "" +
      Math.floor(Math.random() * 100) +
      1,
    advanceId: "",
    reqAmount: "",
    appAmount: "",
    reason: "",
    comments: "",
    approverBranch: "",
    approverBranchId: "",
    approverName: "",
    approverId: "",
    ccbsData: [],
  });

  console.log("Advance Data :>> " + JSON.stringify(advanceData));

  useEffect(() => {
    if ("ccbsData" in route.params)
      if (route.params.ccbsData != null) {
        if (route.params.ccbsData.ccbsId == "NEW") {
          inputChangedHandler("ccbsData", [...ccbsData, route.params.ccbsData]);
        } else {
        }
      }
  }, [route]);

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setAdvanceData((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  return (
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
        <View style={styles.mainContainer}>
          <InputText
            label="Advance amount:"
            hint="Enter Amount"
            keyboard="numeric"
            editable={editable}
            value={advanceData.reqAmount}
            onChangeEvent={(value) => {
              inputChangedHandler("reqAmount", value);
            }}
          />
          <InputText
            label="Approved amount:"
            hint="Approved amount"
            keyboard="numeric"
            editable={editable}
            value={advanceData.appAmount}
            onChangeEvent={(value) => {
              inputChangedHandler("appAmount", value);
            }}
          />
          <InputText
            label="Reason:"
            hint="Reason"
            editable={editable}
            value={advanceData.reason}
            onChangeEvent={(value) => {
              inputChangedHandler("reason", value);
            }}
          />
          <InputSelect
            label="Approver Branch:*"
            hint="Choose Branch"
            selected={advanceData.approverBranch}
            onPressEvent={() => {
              if (editable) {
                setApproverBranchDialogStatus(true);
              }
            }}
          />
          <InputSelect
            label="Approver Name:*"
            hint="Choose Name"
            selected={advanceData.approverName}
            onPressEvent={() => {
              if (editable) {
                setApproverNameDialogStatus(true);
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
              branchId={advanceData.approverBranchId}
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
            editable={editable}
            inputComment={advanceData.comments}
            onInputCommentChanged={inputChangedHandler.bind(this, "comments")}
          />
          <HeaderBox
            onPressEvent={() => {
              navigation.navigate("CCBS", { ccbsDataLength: 0 });
            }}
            label={editable ? "Add CCBS here" : "CCBS detail"}
            icon={editable ? "add-circle-outline" : nul}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: CustomColors.primary_white,
  },
  mainContainer: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: "4%",
    paddingBottom: "3%",
  },
});
