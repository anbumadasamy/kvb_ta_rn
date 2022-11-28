import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  Pressable, Alert
} from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function AttachmentBox({
  onPressAddIcon,
  attachmentData,
  onLongPress,
  setDocName,
  setDocId
}) {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.Text}>Attachments: </Text>
        {/* <Ionicons name="albums-outline" size={22} color="#8ACAC0" /> */}
        <Ionicons
          onPress={onPressAddIcon}
          name="add-circle-outline"
          size={24}
          color="#8ACAC0"
        />
      </View>
      <View style={{ padding: 2 }}>
        <FlatList
          data={attachmentData}
          overScrollMode="never"
          horizontal={true}
          bounces={false}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => {
            return index;
          }}
        />
      </View>
    </View>
  );

  function renderItem({ ...itemData }) {
    let arr;
    let type;
    if (itemData.item.from == "API") {
      arr = itemData.item.fileName.split(".");
      type = arr[arr.length - 1];
    }
    return (
      <View>
        {itemData.item.from == "API" ? (
          <View style={{ padding: 2 }}>
            {type === "jpg" || type === "jpeg" || type === "png" ? (
              <Pressable
                onPress={() => {
                 // setDocId(itemData.item.fileId.split("_")[1]);
                  setDocId(itemData.item.id);
                  setDocName(itemData.item.fileName);
                }}
                onLongPress={() => {
                  onLongPress(itemData.item.id, itemData.item.from);
                }}
                style={{
                  height: 100,
                  width: 80,
                  marginRight: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  backgroundColor: CustomColors.primary_white,
                }}
              >
                <Ionicons name="md-image-sharp" size={24} color="black" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                 // setDocId(itemData.item.fileId.split("_")[1]);
                  setDocId(itemData.item.id);
                  setDocName(itemData.item.fileName);
                }}
                onLongPress={() => {
                  onLongPress(itemData.item.id, itemData.item.from);
                }}
                style={{
                  height: 100,
                  width: 80,
                  marginRight: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  backgroundColor: CustomColors.primary_white,
                }}
              >
                <Ionicons name="document-text" size={24} color="black" />
              </Pressable>
            )}
          </View>
        ) : (
          <Pressable
            onLongPress={() => {
              onLongPress(itemData.item.randomDocumentId, itemData.item.from);
            }}
            style={{ padding: 2 }}
          >
            {itemData.item.type.split("/")[0] === "image" ? (
              <View
                style={{
                  height: 100,
                  width: 80,
                  marginRight: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "#ffffff",
                  borderWidth: 2,
                  borderRadius: 5,
                  backgroundColor: "#ffffff",
                }}
              >
                <ImageBackground
                  style={{ height: 96, width: 76, margin: 10, borderRadius: 5 }}
                  source={{ uri: itemData.item.uri }}
                ></ImageBackground>
              </View>
            ) : (
              <View
                style={{
                  height: 100,
                  width: 80,
                  marginRight: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "#ffffff",
                  borderWidth: 2,
                  borderRadius: 5,
                  backgroundColor: "#d5d8dc",
                }}
              >
                <Ionicons name="document-text" size={24} color="white" />
              </View>
            )}
          </Pressable>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
    height: 150,
    backgroundColor: "#ecf0f1",
    borderRadius: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    marginVertical: 2,
    backgroundColor: CustomColors.primary_white,
    borderRadius: 5,
    alignItems: "center",
  },
  Text: {
    fontSize: 14,
  },
});
