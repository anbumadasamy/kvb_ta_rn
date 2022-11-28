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
  TouchableWithoutFeedback, Alert
} from "react-native";
import { useState } from "react";

export default function DropDownDialogTravelingExpense({
  dialogstatus,
  setdialogstatus,
  data,
  Tittle,
  setdata,
  setlabelstatus,
  setempty,
  setheading,
}) {
  const [isModalVisible, setModalVisible] = useState(dialogstatus);

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
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 19,
                }}
              >
                {Tittle}
              </Text>

              <MaterialIcons
                name={"close"}
                size={24}
                color="#FFBB4F"
                onPress={toggleModalVisibility}
              />
            </View>

            <FlatList
              data={data}
              overScrollMode="never"
              bounces={false}
              renderItem={renderLocationsItem}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
  function renderLocationsItem({ ...itemData }) {
    const clickmethod = () => {
      setdata(itemData.item.name);
      setModalVisible(!isModalVisible);
      setempty("");
      switch (itemData.item.name) {
        case "Cab":
          setlabelstatus(false);
          break;
        case "Bus":
          setlabelstatus(false);
          break;
        case "Train":
          setlabelstatus(true);
          setheading("Class for Train");
          break;
        case "Air":
          setlabelstatus(true);
          setheading("Class for Air");
          break;
      }
    };
    return (
      <View style={styles.textInput}>
        <TouchableWithoutFeedback
          onPress={clickmethod}
          // onPressIn={clicked}
        >
          <View style={{ justifyContent: "center" }}>
            <Text>{itemData.item.name}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
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

    paddingBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  icon: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    flexDirection: "row",
  },
  textInput: {
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",

    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderBottomWidth: 1,
    marginBottom: 12,
  },
});
