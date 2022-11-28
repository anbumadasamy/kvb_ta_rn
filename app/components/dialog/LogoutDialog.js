import { CustomColors } from "../../utilities/CustomColors";
import { View, StyleSheet, Text, Pressable, Modal, Alert } from "react-native";
import { useState } from "react";

export default function LogoutDialog({
  dialogstatus,
  setDialogstatus,
  onPressLogout,
  userName,
}) {
  const [isModalVisible, setModalVisible] = useState(dialogstatus);

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
    setDialogstatus(!dialogstatus);
  };

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
                  fontSize: 16,
                }}
              >
                Hey! {userName}
              </Text>
            </View>
            <View style={{ justifyContent: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  color: "#6c6d6e",
                  paddingBottom: 25,
                }}
              >
                Are you sure want to Exit?
              </Text>
            </View>
            <View style={styles.row}>
              <Pressable
                style={({pressed}) => pressed ? [styles.pressable1, styles.pressed] : styles.pressable1}
                android_ripple={{ color: CustomColors.ripple_color }}
                onPress={() => {
                  onPressLogout();
                  toggleModalVisibility();
                }}
              >
                <Text style={styles.text}>Yes</Text>
              </Pressable>
              <Pressable
               style={({pressed}) => pressed ? [styles.pressable2, styles.pressed] : styles.pressable2}
               android_ripple={{ color: CustomColors.ripple_color }}
                onPress={() => {
                  toggleModalVisibility();
                }}
              >
                <Text style={styles.text2}>No</Text>
              </Pressable>
            </View>
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
    top: "40%",
    left: "10%",
    right: "10%",
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  icon: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
  },
  pressable1: {
    justifyContent: "center",
    width: "50%",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: CustomColors.primary_red,
    borderBottomLeftRadius: 7,
  },
  pressable2: {
    justifyContent: "center",
    width: "50%",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomRightRadius: 7,
    borderWidth: 1,
    borderColor: CustomColors.primary_gray,
  },
  text: {
    color: CustomColors.primary_white,
    fontSize: 14,
    textAlign: "center",
  },
  text2: {
    color: CustomColors.primary_dark,
    fontSize: 14,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pressed: {
    backgroundColor: CustomColors.ripple_color,
    opacity: 0.75,
  },
});
