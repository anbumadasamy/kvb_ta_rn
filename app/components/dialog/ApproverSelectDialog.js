import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { CustomColors } from "../../utilities/CustomColors";
import SearchDialog from "./SearchDialog";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  TextInput,
} from "react-native";

export default function ApproverSelectDialog({
  dialogStatus,
  setDialogStatus,
  title,
  onPressEvent,
  buttontext,
  forwardApproverBranch,
  forwardApproverBranchId,
  forwardApproverName,
  setForwardApproverBranch,
  setForwardApproverBranchId,
  setForwardApproverName,
  setForwardApproverId,
  remarks,
  setRemarks,
}) {
  const [isModalVisible, setModalVisible] = useState(dialogStatus);

  const [branchDialogStatus, setBranchDialogStatus] = useState(false);
  const [empDialogStatus, setEmpDialogStatus] = useState(false);

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
    setDialogStatus(!dialogStatus);
  };

  return (
    <View style={styles.screen}>
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={() => {
          toggleModalVisibility();
          setForwardApproverBranch(null);
          setForwardApproverBranchId(null);
          setForwardApproverName(null);
          setForwardApproverId(null);
          setRemarks("");
        }}
      >
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <View style={styles.icon}>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 19,
                }}
              >
                {title}
              </Text>

              <MaterialIcons
                name={"close"}
                size={24}
                color="#FFBB4F"
                onPress={() => {
                  toggleModalVisibility();
                  setForwardApproverBranch(null);
                  setForwardApproverBranchId(null);
                  setForwardApproverName(null);
                  setForwardApproverId(null);
                  setRemarks("");
                }}
              />
            </View>

            <Pressable
              style={styles.pressable}
              onPress={() => {
                setBranchDialogStatus(true);
              }}
            >
              {forwardApproverBranch ? (
                <Text style={styles.text}>{forwardApproverBranch}</Text>
              ) : (
                <Text style={styles.textHint}>Choose Approver Branch</Text>
              )}
              <MaterialIcons name="arrow-drop-down" size={24} color="#A2A2A2" />
            </Pressable>

            <Pressable
              style={styles.pressable}
              onPress={() => {
                setEmpDialogStatus(true);
              }}
            >
              {forwardApproverName ? (
                <Text style={styles.text}>{forwardApproverName}</Text>
              ) : (
                <Text style={styles.textHint}>Choose Approver Name</Text>
              )}
              <MaterialIcons name="arrow-drop-down" size={24} color="#A2A2A2" />
            </Pressable>

            <TextInput
              placeholder="Reason"
              value={remarks}
              placeholderTextColor={CustomColors.primary_gray}
              style={styles.textInput}
              onChangeText={setRemarks}
            />

            <Pressable
              style={({ pressed }) =>
                pressed ? [styles.button, styles.pressed] : styles.button
              }
              onPress={() => {
                onPressEvent();
              }}
              android_ripple={{ color: CustomColors.ripple_color }}
            >
              <Text style={styles.textbutton}>{buttontext}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {branchDialogStatus && (
        <SearchDialog
          dialogstatus={branchDialogStatus}
          setdialogstatus={setBranchDialogStatus}
          from="approver_branch"
          setValue={(value) => {
            setForwardApproverBranch(value);
          }}
          setId={(id) => {
            setForwardApproverBranchId(id);
          }}
        />
      )}
      {empDialogStatus && (
        <SearchDialog
          dialogstatus={empDialogStatus}
          setdialogstatus={setEmpDialogStatus}
          branchId={forwardApproverBranchId}
          from="approver_name"
          setValue={(value) => {
            setForwardApproverName(value);
          }}
          setId={(id) => {
            setForwardApproverId(id);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    //  flex: 1,
    alignItems: "center",
    justifyContent: "center",
    //   backgroundColor: "#fff",
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    position: "absolute",
    top: "25%",
    left: "10%",
    right: "10%",
    elevation: 5,
    backgroundColor: "#ffffff",
    borderRadius: 7,
  },
  icon: {
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
    flexDirection: "row",
  },
  button: {
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: CustomColors.primary_yellow,
  },
  textbutton: {
    textAlign: "center",
    color: "white",
  },
  pressed: {
    backgroundColor: CustomColors.ripple_color,
    opacity: 0.75,
  },
  text: {
    fontSize: 14,
    padding: 6,
    color: CustomColors.primary_dark,
  },
  textHint: {
    fontSize: 14,
    padding: 6,
    color: CustomColors.primary_gray,
  },
  pressable: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: CustomColors.primary_gray,
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 6,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: CustomColors.primary_gray,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
