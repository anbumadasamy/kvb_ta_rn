import InputSelect from "../../components/ui/InputSelect";
import SearchDialog from "../../components/dialog/SearchDialog";
import InputText from "../../components/ui/InputText";
import SubmitButton from "../../components/ui/SubmitButton";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Alert, Text } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import ToastMessage from "../../components/toast/ToastMessage";

export default function AdvanceCCBSCreationScreen({ route }) {
  const [editable] = useState(true);
  const navigation = useNavigation();
  const [bsDialogStatus, setBsDialogStatus] = useState(false);
  const [ccDialogStatus, setCcDialogStatus] = useState(false);
  const [ccbsData, setCcbsData] = useState({
    randomCcBsId:
      Math.floor(Math.random() * 100) +
      1 +
      "" +
      Math.floor(Math.random() * 100) +
      1,
    cc: "",
    bs: "",
    ccId: "",
    bsId: "",
    amount: "",
    percentage: "",
    totalAmount: route.params.totalAmount,
    balanceAmount: route.params.balanceAmount,
  });

  /* console.log(
    "Balance Amount in creation screen :>> " +
      JSON.stringify(ccbsData.balanceAmount)
  );
  console.log(
    "Total Amount in creation screen :>> " +
      JSON.stringify(ccbsData.totalAmount)
  ); */

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setCcbsData((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  function AddCCBSValidation() {
    if (ccbsData.bs == "") {
      Alert.alert("Choose BS");
      return;
    }
    if (ccbsData.cc == "") {
      Alert.alert("Choose CC");
      return;
    }
    if (ccbsData.amount == "") {
      Alert.alert("Enter Amount");
      return;
    }
    if (ccbsData.percentage == "") {
      Alert.alert("Enter Percentage");
      return;
    }

    AddCCBS();
  }

  function AddCCBS() {
    navigation.navigate("CCBS", {
      ccbsData: ccbsData,
      totalAmount: null,
      travelAdvanceData: null,
    });
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.mainContainer}>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <Text style={{ fontSize: 14, color: CustomColors.primary_red }}>
            {route.params.ccbsLength == 0
              ? "Total Amount: "
              : "Balance Amount: "}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: CustomColors.primary_red,
              fontWeight: "bold",
            }}
          >
            {route.params.ccbsLength == 0
              ? ccbsData.totalAmount
              : ccbsData.balanceAmount}
          </Text>
        </View>
        <InputSelect
          label="BS:"
          hint="Choose BS"
          selected={ccbsData.bs}
          onPressEvent={() => {
            if (editable) {
              setBsDialogStatus(true);
            }
          }}
        />

        <InputSelect
          label="CC:"
          hint="Choose CC"
          selected={ccbsData.cc}
          onPressEvent={() => {
            if (editable) {
              if (ccbsData.bsId != "") {
                setCcDialogStatus(true);
              } else {
                Alert.alert("Choose BS");
              }
            }
          }}
        />
        <InputText
          label="Advance Amount:"
          value={ccbsData.amount}
          hint="Enter amount"
          keyboard={"numeric"}
          editable={editable ? true : false}
          onChangeEvent={(value) => {
            if (value <= ccbsData.totalAmount) {
              inputChangedHandler("amount", value);
              if (value.toString().length > 0) {
                inputChangedHandler(
                  "percentage",
                  (
                    (parseFloat(value) * 100) /
                    parseFloat(ccbsData.totalAmount)
                  ).toString()
                );
              } else {
                inputChangedHandler("percentage", "");
              }
            } else {
              ToastMessage("Check amount", null, "error");
            }
          }}
        />
        <InputText
          label="Percentage:"
          value={ccbsData.percentage}
          hint="Enter percentage"
          keyboard={"numeric"}
          editable={editable ? true : false}
          onChangeEvent={(value) => {
            if (value <= 100) {
              inputChangedHandler("percentage", value);
              if (value.toString().length > 0) {
                inputChangedHandler(
                  "amount",
                  (
                    (parseFloat(ccbsData.totalAmount) * parseFloat(value)) /
                    100
                  ).toString()
                );
              } else {
                inputChangedHandler("amount", "");
              }
            } else {
              ToastMessage("Check precentage", null, "error");
            }
          }}
        />
        {bsDialogStatus && (
          <SearchDialog
            dialogstatus={bsDialogStatus}
            setdialogstatus={setBsDialogStatus}
            from="BS"
            setValue={inputChangedHandler.bind(this, "bs")}
            setId={(id) => {
              inputChangedHandler("bsId", id);
            }}
          />
        )}
        {ccDialogStatus && (
          <SearchDialog
            dialogstatus={ccDialogStatus}
            setdialogstatus={setCcDialogStatus}
            from="CC"
            bsId={ccbsData.bsId}
            setValue={inputChangedHandler.bind(this, "cc")}
            setId={(id) => {
              inputChangedHandler("ccId", id);
            }}
          />
        )}
      </View>
      <View style={{ paddingBottom: 10 }}>
        {editable && (
          <SubmitButton onPressEvent={AddCCBSValidation}>Add CCBS</SubmitButton>
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
