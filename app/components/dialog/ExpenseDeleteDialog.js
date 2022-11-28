import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Modal,
  FlatList,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useState, useContext } from "react";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";

export default function ExpenseDeleteDialog({
  dialogstatus,
  setdialogstatus,
  Tittle,
  deletemethod,
}) {
  const [isModalVisible, setModalVisible] = useState(dialogstatus);
  const authCtx = useContext(AuthContext);

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
    setdialogstatus(!dialogstatus);
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
                  fontWeight: "bold",
                  fontSize: 19,
                }}
              >
                {Tittle}
              </Text>
            </View>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 13,
                paddingBottom: 20,
              }}
            >
              Are You Sure Want to Delete?
            </Text>
            <View style={styles.row}>
              <Pressable
                style={({ pressed }) =>
                  pressed ? [styles.button1, styles.pressed] : styles.button1
                }
                android_ripple={{ color: CustomColors.ripple_color }}
                onPress={deletemethod}
              >
                <Text style={styles.textbuttontwo}>YES</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) =>
                  pressed ? [styles.button2, styles.pressed] : styles.button2
                }
                android_ripple={{ color: CustomColors.ripple_color }}
                onPress={toggleModalVisibility}
              >
                <Text style={styles.textbutton}>NO</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalView: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  icon: {
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
  },

  button1: {
    width: "50%",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    paddingVertical: 14,
    marginRight: 2,
    paddingHorizontal: 10,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    backgroundColor: CustomColors.primary_yellow,
  },
  button2: {
    width: "50%",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    backgroundColor: CustomColors.primary_green,
  },

  textbutton: {
    textAlign: "center",
    color: "white",
  },
  textbuttontwo: {
    textAlign: "center",
    color: "white",
  },
  row: {
    flexDirection: "row",
    padding: 2,
    justifyContent: "space-between",
  },
  pressed: {
    backgroundColor: CustomColors.ripple_color,
    opacity: 0.75,
  },
});
