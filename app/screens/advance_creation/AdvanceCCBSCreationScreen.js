import { useState } from "react";
import InputSelect from "../../components/ui/InputSelect";
import SubmitButton from "../../components/ui/SubmitButton";
import SearchDialog from "../../components/dialog/SearchDialog";
import { CustomColors } from "../../utilities/CustomColors";
import InputText from "../../components/ui/InputText";
import { useNavigation } from "@react-navigation/native";
import ToastMessage from "../../components/toast/ToastMessage";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Text,
} from "react-native";

export default function AdvanceCCBSCreationScreen({ route }) {
  const navigation = useNavigation();
  const [editable] = useState(true);
  const [bsDialogStatus, setBsDialogStatus] = useState(false);
  const [ccDialogStatus, setCcDialogStatus] = useState(false);
  const [ccbsData, setCcbsData] = useState({
    randomCcbsId:
      Math.floor(Math.random() * 100) +
      1 +
      "" +
      Math.floor(Math.random() * 100) +
      1,
    ccbsId: "NEW",
    ccName: "",
    ccId: "",
    bsName: "",
    bsId: "",
    ccbsAmount: "",
    ccbsPercentage: "",
    totalAmout: "",
    balanceAmount: "",
  });

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setCcbsData((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  function CCBSValidation() {
    if (ccbsData.bsName == "") {
      ToastMessage("Choose BS", null, "error");
      return;
    }
    if (ccbsData.ccName == "") {
      ToastMessage("Choose CC", null, "error");
      return;
    }
    if (ccbsData.ccbsAmount == "") {
      ToastMessage("Enter Amount", null, "error");
      return;
    }
    if (ccbsData.ccbsPercentage == "") {
      ToastMessage("Enter Percentage", null, "error");
      return;
    }

    AddCCBS();
  }

  async function AddCCBS() {
    navigation.navigate("Advance", { ccbsData: ccbsData });
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
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <Text style={{ fontSize: 14, color: CustomColors.primary_red }}>
              {route.params.ccbsDataLength == 0
                ? "Total Amount: "
                : "Balance Amount: "}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: CustomColors.primary_red,
                fontWeight: "bold",
              }}
            ></Text>
          </View>
          <InputSelect
            label="BS:"
            hint="Choose BS"
            selected={ccbsData.bsName}
            onPressEvent={() => {
              if (editable) {
                setBsDialogStatus(true);
              }
            }}
          />

          <InputSelect
            label="CC:"
            hint="Choose CC"
            selected={ccbsData.ccName}
            onPressEvent={() => {
              if (editable) {
                if (ccbsData.bsId != "") {
                  setCcDialogStatus(true);
                } else {
                  ToastMessage("Choose BS", null, "error");
                }
              }
            }}
          />
          <InputText
            label="Advance Amount:"
            value={ccbsData.ccbsAmount}
            hint="Enter amount"
            keyboard={"numeric"}
            editable={editable ? true : false}
            onChangeEvent={(value) => {
              inputChangedHandler("ccbsAmount", value);
            }}
          />
          <InputText
            label="Percentage:"
            value={ccbsData.ccbsPercentage}
            hint="Enter percentage"
            keyboard={"numeric"}
            editable={editable ? true : false}
            onChangeEvent={(value) => {
              inputChangedHandler("ccbsPercentage", value);
            }}
          />
          {bsDialogStatus && (
            <SearchDialog
              dialogstatus={bsDialogStatus}
              setdialogstatus={setBsDialogStatus}
              from="BS"
              setValue={inputChangedHandler.bind(this, "bsName")}
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
              setValue={inputChangedHandler.bind(this, "ccName")}
              setId={(id) => {
                inputChangedHandler("ccId", id);
              }}
            />
          )}
        </View>
      </ScrollView>
      <View style={{ paddingBottom: 10 }}>
        {editable && (
          <SubmitButton onPressEvent={CCBSValidation}>Add CCBS</SubmitButton>
        )}
      </View>
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
