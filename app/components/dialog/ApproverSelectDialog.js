import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { CustomColors } from "../../utilities/CustomColors";
import { View, StyleSheet, Text, Modal, Pressable } from "react-native";

export default function ApproverSelectDialog({
  dialogStatus,
  setDialogStatus,
  title,
  onPressEvent,
  buttontext,
}) {
  const [isModalVisible, setModalVisible] = useState(dialogStatus);

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
    setDialogStatus(!dialogStatus);
  };

  function onPressBranchEvent() {
    console.log("Branch.......");
  }
  function onPressEmpEvent() {
    console.log("Employee.......");
  }

  return (
    <View style={styles.screen}>
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={toggleModalVisibility}
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
                onPress={toggleModalVisibility}
              />
            </View>

            <Pressable style={styles.pressable} onPress={onPressBranchEvent}>
              {fAppBranch ? (
                <Text style={styles.text}>{fAppBranch}</Text>
              ) : (
                <Text style={styles.textHint}>Choose Approver Branch</Text>
              )}
              <MaterialIcons name="arrow-drop-down" size={24} color="#A2A2A2" />
            </Pressable>

            <Pressable style={styles.pressable} onPress={onPressEmpEvent}>
              {fAppName ? (
                <Text style={styles.text}>{fAppName}</Text>
              ) : (
                <Text style={styles.textHint}>Choose Approver Name</Text>
              )}
              <MaterialIcons name="arrow-drop-down" size={24} color="#A2A2A2" />
            </Pressable>

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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  icon: {
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
    flexDirection: "row",
  },
  textInput: {
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    borderRadius: 9,
    marginBottom: 25,
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
});
