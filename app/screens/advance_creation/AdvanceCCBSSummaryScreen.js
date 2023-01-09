import HeaderBox from "../../components/ui/HeaderBox";
import { useNavigation } from "@react-navigation/native";
import AdvanceCCBSCard from "../../components/cards/AdvanceCCBSCard";
import DeleteDialog from "../../components/dialog/DeleteDialog";
import SubmitButton from "../../components/ui/SubmitButton";
import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import InputText from "../../components/ui/InputText";

let ccbsDataArray = [];

export default function AdvanceCCBSSummaryScreen({ route }) {
  const navigation = useNavigation();
  const [editableStatus, setEditableStatus] = useState(true);
  const [deleteDialogStatus, setDeleteDialogStatus] = useState(false);
  const [totalAmount, setTotalAmount] = useState();
  const [balanceAmount, setBalanceAmount] = useState("0");
  const [ccBsId, setCcBsId] = useState(null);
  const [advanceCCBSData, setAdvanceCCBSData] = useState({
    randomAdvId:
      Math.floor(Math.random() * 100) +
      1 +
      "" +
      Math.floor(Math.random() * 100) +
      1,
    reqAmount: "",
    appAmount: "",
    reason: "",
    approver: route.params.approver,
    ccbsData: [],
  });

  // console.log("Edit data :>> " + JSON.stringify(route.params.advanceData));

  useEffect(() => {
    if (advanceCCBSData.ccbsData.length > 0) {
      setBalanceAmount(
        advanceCCBSData.ccbsData.length == 1
          ? parseFloat(totalAmount) -
              parseFloat(
                advanceCCBSData.ccbsData[advanceCCBSData.ccbsData.length - 1]
                  .amount
              )
          : parseFloat(balanceAmount) -
              parseFloat(
                advanceCCBSData.ccbsData[advanceCCBSData.ccbsData.length - 1]
                  .amount
              )
      );
    }
    //  console.log("Calculated Balance :>> " + JSON.stringify(balanceAmount));
  }, [advanceCCBSData.ccbsData]);

  useEffect(() => {
    ccbsDataArray = [];

    if ("advanceData" in route.params) {
      inputChangedHandler("reqAmount", route.params.reqAmount);
      inputChangedHandler("randomAdvId", route.params.randomAdvId);
      inputChangedHandler("appAmount", route.params.appAmount);
      inputChangedHandler("reason", route.params.reason);
      inputChangedHandler("approver", route.params.approver);
      inputChangedHandler("ccbsData", route.params.ccbsData);
    }

    if (route.params.ccbsData != null && "ccbsData" in route.params) {
      let position = "NEW";
      if (advanceCCBSData.ccbsData.length != 0) {
        for (let i = 0; i < advanceCCBSData.ccbsData.length; i++) {
          if (
            advanceCCBSData.ccbsData[i].randomCcBsId ==
            route.params.ccbsData.randomCcBsId
          ) {
            position = i;
          }
        }
      } else {
        position = "NEW";
      }

      if (position == "NEW") {
        ccbsDataArray.push(route.params.ccbsData);
        inputChangedHandler("ccbsData", [
          ...advanceCCBSData.ccbsData,
          ...ccbsDataArray,
        ]);
      } else {
        advanceCCBSData.ccbsData[position] = route.params.ccbsData;
      }
    }
  }, [route]);

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setAdvanceCCBSData((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  function DeleteCCBS() {}

  function SubmitCCBS() {
    navigation.navigate("Advance Creation", {
      advanceCCBSData: advanceCCBSData,
    });
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.mainContainer}>
        <InputText
          label="Advance amount:"
          hint="Enter Amount"
          editable={editableStatus}
          keyboard="numeric"
          value={advanceCCBSData.reqAmount}
          onChangeEvent={(value) => {
            inputChangedHandler("reqAmount", value);
            inputChangedHandler("appAmount", value);
          }}
        />
        <InputText
          label="Approved amount:"
          hint="Approved amount"
          editable={false}
          keyboard="numeric"
          value={advanceCCBSData.appAmount}
          onChangeEvent={inputChangedHandler.bind(this, "appAmount")}
        />
        <InputText
          label="Reason:"
          hint="Reason"
          editable={editableStatus}
          value={advanceCCBSData.reason}
          onChangeEvent={inputChangedHandler.bind(this, "reason")}
        />
        <HeaderBox
          onPressEvent={() => {
            navigation.navigate("Add CCBS", {
              totalAmount: advanceCCBSData.reqAmount,
              balanceAmount: advanceCCBSData.balanceAmount,
              ccbsLength: advanceCCBSData.ccbsData.length,
            });
          }}
          label="Add CCBS for Advance Amount"
          icon={"add-circle-outline"}
        />
        {advanceCCBSData.ccbsData.length > 0 && (
          <View>
            <HeaderBox
              onPressEvent={() => {}}
              label="Updated CCBS"
              icon={null}
            />
            <AdvanceCCBSCard
              data={advanceCCBSData.ccbsData}
              setDeleteDialogStatus={setDeleteDialogStatus}
              setId={setCcBsId}
            />
          </View>
        )}
        {deleteDialogStatus && (
          <DeleteDialog
            dialogstatus={deleteDialogStatus}
            setDialogstatus={setDeleteDialogStatus}
            onPressDelete={DeleteCCBS}
          />
        )}
      </View>
      <View style={{ paddingBottom: 10 }}>
        <SubmitButton onPressEvent={SubmitCCBS}>Submit</SubmitButton>
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
