import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function SearchFilterDialog({
  dialogStatus,
  confirmFilter,
  travelNo,
  setTravelNo,
  close,
  Clear,
  reqDate,
  setReqDate,
  pickerStatus,
  setPickerStatus,
}) {
  const [isModalVisible, setModalVisible] = useState(dialogStatus);
  useEffect(() => {
    pickerStatus;
  }, [pickerStatus]);

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
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
              <View style={{marginRight: 15}}>
              <MaterialIcons
                name={"delete-sweep"}
                size={24}
                color="#FFBB4F"
                onPress={Clear}
              />
              </View>
              <View>
              <MaterialIcons
                name={"close"}
                size={24}
                color="#FFBB4F"
                onPress={() => {
                  toggleModalVisibility();
                  close();
                }}
              />
              </View>
            </View>

            <TextInput
              placeholder="Travel No"
              value={travelNo}
              placeholderTextColor="#818c84"
              style={styles.textInput}
              onChangeText={(value) => {
                setTravelNo(value);
              }}
            />
            <Pressable
              onPress={() => {
                setPickerStatus(!pickerStatus);
              }}
            >
              <View style={styles.container}>
                {reqDate == "" ? (
                  <Text style={{ color: "#818c84" }}>Req Date</Text>
                ) : (
                  <Text style={{ color: CustomColors.primary_dark }}>
                    {reqDate}
                  </Text>
                )}
                <MaterialCommunityIcons
                  name="calendar"
                  size={24}
                  color="#A2A2A2"
                />
              </View>
            </Pressable>
            <DateTimePickerModal
              isVisible={pickerStatus}
              mode="date"
              onConfirm={setReqDate}
              onCancel={() => {
                setPickerStatus(!pickerStatus);
              }}
              display={Platform.OS == "ios" ? "inline" : "default"}
            />
            {/*   {pickerStatus && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                display="default"
                onChange={setReqDate}
              />
            )} */}

            <Pressable
              style={styles.buttonContainer}
              onPress={() => {
                if (travelNo != "" && reqDate != "") {
                  Alert.alert("Choose any one");
                } else {
                  toggleModalVisibility();
                  confirmFilter();
                }
              }}
            >
              <Text style={styles.textbutton}>Search</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.25)",
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
  textInput: {
    width: "80%",
    height: 45,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    paddingHorizontal: 16,
    borderColor: CustomColors.primary_gray,
    borderWidth: 1,
    marginBottom: 12,
  },
  container: {
    width: "80%",
    height: 45,
    borderColor: CustomColors.primary_gray,
    borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 5,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
  },
  textbutton: {
    alignSelf: "center",
    textAlign: "center",
    color: "white",
  },
  buttonContainer: {
    width: "60%",
    height: 50,
    marginTop: 15,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: CustomColors.primary_yellow,
    textAlign: "center",
    color: "white",
  },
});
