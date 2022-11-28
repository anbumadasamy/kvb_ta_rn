import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView, Alert
} from "react-native";
import { useState } from "react";
import { WebView } from "react-native-webview";

export default function WebViewDialog({
  dialogStatus,
  setDialogStatus,
  filePath
}) {
  const [isModalVisible, setModalVisible] = useState(dialogStatus);

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
      >
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <View style={styles.icon}>
              <MaterialIcons
                name={"close"}
                size={24}
                color="#FFBB4F"
                onPress={() => {
                  toggleModalVisibility();
                  setDialogStatus();
                }}
              />
            </View>
<View style={{ height: 100,
   flex: 1}}>
            <WebView
        onLoad={() => {}}
        source={{filePath}}
        onMessage={(event) => {}}
      />
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
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  icon: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
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
    height: 45,
    width: 200,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    paddingVertical: 12,
    marginBottom: 15,
    backgroundColor: CustomColors.primary_yellow,
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
});
