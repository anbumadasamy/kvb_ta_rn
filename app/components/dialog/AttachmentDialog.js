import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";
import { View, StyleSheet, Text, Pressable, Modal, Alert } from "react-native";
import { useState } from "react";

export default function AttachmentDialog({
  dialogstatus,
  setDialogstatus,
  onPressFiles,
  onPressCamera,
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
                Choose attachment...
              </Text>
              <MaterialIcons
                name={"close"}
                size={22}
                color="#FE5886"
                onPress={toggleModalVisibility}
              />
            </View>
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "#6c6d6e",
                paddingBottom: 25,
              }}
            >
              Which one you want?
            </Text>
            <View style={styles.row}>
              <Pressable
               style={({pressed}) => pressed ? [styles.pressable1, styles.pressed] : styles.pressable1}
               android_ripple={{ color: CustomColors.ripple_color }}
                onPress={() => {
                  toggleModalVisibility();
                  onPressFiles();
                }}
              >
                <Ionicons name="folder-open-outline" size={21} color="white" />
                <Text style={styles.text}>Files</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => pressed ? [styles.pressable2, styles.pressed] : styles.pressable2}
                android_ripple={{ color: CustomColors.ripple_color }}
                onPress={() => {
                  toggleModalVisibility();
                  onPressCamera();
                }}
              >
                <Ionicons name="camera-outline" size={22} color="white" />
                <Text style={styles.text}>Camera</Text>
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
    flexDirection: "row",
    justifyContent: "center",
    width: "50%",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: CustomColors.primary_yellow,
    borderBottomLeftRadius: 7,
  },
  pressable2: {
    flexDirection: "row",
    justifyContent: "center",
    width: "50%",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: CustomColors.primary_green,
    borderBottomRightRadius: 7,
  },
  text: {
    color: CustomColors.primary_white,
    fontSize: 14,
    textAlign: "center",
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
   // android_ripple works only on android
  // for ios ripple we make conditional style
  pressed: {
    backgroundColor: CustomColors.ripple_color,
    opacity: 0.75,
  },
});
