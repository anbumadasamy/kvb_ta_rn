import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function AttachmentVerticalbox({
  onPressAddIcon,
  setdeletefileid,
  attachmentData,
  setdeletedialogstatus,
  DownloadAttachment,
  setfrom,
}) {
  return (
    <FlatList
      data={attachmentData}
      overScrollMode="never"
      bounces={false}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index}
    />
  );

  function renderItem({ ...itemData }) {
    console.log(JSON.stringify(attachmentData) + "Attachment View");
    /* let type;
    console.log(itemData.item.name + " itemdata");
    if (itemData.item.from == "API") {
      let arr = itemData.item.fileName.split(".");
      type = arr[arr.length - 1];
    } */

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          {itemData.item.from == "API" ? (
            <Text
              ellipsizeMode="tail"
              multiline={false}
              numberOfLines={1}
              style={{
                fontSize: 14,
                textAlign: "center",
                maxWidth: "80%",
              }}
            >
              {itemData.item.fileName}
            </Text>
          ) : (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              multiline={false}
              style={{
                fontSize: 14,
                textAlign: "center",
                maxWidth: "80%",
              }}
            >
              {itemData.item.name}
            </Text>
          )}
          <View style={styles.row1}>
            <Pressable
              onPress={() => {
                if (itemData.item.from == "API") {
                  DownloadAttachment(itemData.item.id);
                  /*  setDocId(itemData.item.id);
                  setDocName(itemData.item.fileName); */
                } else {
                  Alert.alert("Can't download/view now");
                }
              }}
            >
              <Entypo name="eye" size={22} color={CustomColors.primary_green} />
            </Pressable>
            {/*  {from == "create_update" && ( */}
            <Pressable
              style={{ marginLeft: 10 }}
              onPress={() => {
                setdeletefileid(itemData.item.id);
                setfrom(itemData.item.from);
                setdeletedialogstatus(true);
              }}
            >
              {(itemData.item.claimstatusid == 1 ||
                itemData.item.claimstatusid == -1 ||
                itemData.item.claimstatusid == 5) && (
                <MaterialIcons
                  name="delete"
                  size={22}
                  color={CustomColors.primary_red}
                />
              )}
            </Pressable>
            {/* )} */}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 35,
    marginBottom: 10,
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
  },
  row1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mainContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    padding: 6,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  Text: {
    fontSize: 14,
    textAlign: "center",
  },
});
