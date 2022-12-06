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
import { useState } from "react";
export default function DropDownDialog({
  dialogstatus,
  setdialogstatus,
  data,
  Tittle,
  setdata,
  setid,
  clicked,
  from,
}) {
  const [isModalVisible, setModalVisible] = useState(dialogstatus);
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
              keyExtractor={(item, index) => {
                return item.id;
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
  function renderLocationsItem({ ...itemData }) {
    const clickmethod = () => {
      console.log(JSON.stringify(itemData) + " Center Data");
      setdialogstatus(!dialogstatus);
      setdata(itemData.item.name);
      setModalVisible(!isModalVisible);
      if (
        from == "CC" ||
        from == "Misc" ||
        from == "Local" ||
        from == "Local_Subcategory" || from == "Local_Onward"
        || from =="0"
      ) {
        if ("id" in itemData.item) {
          setid(itemData.item.id);
        }
      }
    };
    return (
      <View style={styles.textInput}>
        <TouchableWithoutFeedback onPress={clickmethod} onPressIn={clicked}>
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
