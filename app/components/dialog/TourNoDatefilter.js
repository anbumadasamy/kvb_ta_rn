import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Modal,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function TourNoDateFilter({
  dialogstatus,
  clicked,
  tourno,
  number,
  close,
  requireddate,
  setrequireddate,
  pickerstatus,
  setpicker,
  sweep,
}) {
  const [isModalVisible, setModalVisible] = useState();

  useEffect(() => {
    let timer = setTimeout(() => {
      setModalVisible(dialogstatus);
    }, 2000);
  }, [dialogstatus]);

  // const [datestatus, setdatestatus] = useState(pickerstatus);
  /*  useEffect(() => {
    setModalVisible(dialogstatus);
  }, [dialogstatus]); */
  // console.log(isModalVisible + "Opened isModalVisible Date");
  // console.log(datestatus + " pickerstatus datestatus");

  const toggleModalVisibility = () => {
    console.log("ANbuuuuuuuuuu");
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.screen}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        presentationStyle="overFullScreen"
        onRequestClose={toggleModalVisibility}
      >
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <View style={styles.icon}>
              <View style={{ paddingRight: 20 }}>
                <MaterialIcons
                  name={"delete-sweep"}
                  size={24}
                  color="#FFBB4F"
                  onPress={() => {
                    sweep();
                  }}
                />
              </View>
              <View>
                <MaterialIcons
                  name={"close"}
                  size={24}
                  color="#FFBB4F"
                  onPress={toggleModalVisibility}
                  onPressIn={close}
                />
              </View>
            </View>

            <TextInput
              placeholder="Tour No"
              value={number}
              placeholderTextColor="#818c84"
              style={styles.textInput}
              onChangeText={tourno}
            />
            <Pressable
              onPress={() => {
                setpicker(!pickerstatus);
                console.log("Pressed");
              }}
            >
              <View style={styles.container}>
                {setrequireddate == "" ? (
                  <Text style={{ color: "#818c84" }}>Required Date</Text>
                ) : (
                  <Text style={{ color: "#818c84" }}>{setrequireddate}</Text>
                )}
                <MaterialIcons
                  name={"calendar-today"}
                  size={24}
                  color="#FFBB4F"
                />
              </View>
            </Pressable>
            <DateTimePickerModal
              isVisible={pickerstatus}
              mode="date"
              onConfirm={requireddate}
              onCancel={() => {
                setpicker(false);
              }}
              display={Platform.OS == "ios" ? "inline" : "default"}
            />

            <Pressable
              style={({ pressed }) =>
                pressed ? [styles.button, styles.pressed] : styles.button
              }
              onPress={() => {
                toggleModalVisibility();
                clicked();
              }}
              android_ripple={{ color: CustomColors.ripple_color }}
            >
              <Text style={styles.textbutton}>Confirm</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalView: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    elevation: 5,
    height: 260,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  icon: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },
  button: {
    width: "60%",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop:10,

    backgroundColor: CustomColors.primary_yellow,
  },
  textInput: {
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 12,
  },
  textbutton: {
    textAlign: "center",
    color: "white",
  },
  container: {
    width: "80%",
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    justifyContent: "space-between",
    alignSelf: "center",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
  },
  buttonText: {
    color: CustomColors.primary_white,
    textAlign: "center",
    fontWeight: "bold",
  },
});
