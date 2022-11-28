import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function AttachmentViewBox({
  onPressAddIcon,
  attachmentData,
  setDocId,
  setDocName,
}) {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.Text}>Attachments: </Text>
      </View>
      <View style={{ padding: 2 }}>
        <FlatList
          data={attachmentData}
          overScrollMode="never"
          horizontal={true}
          bounces={false}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item.id}
        />
      </View>
    </View>
  );

  function renderItem({ ...itemData }) {
    let arr = itemData.item.fileName.split(".");
    let type = arr[arr.length - 1];
    return (
      <View style={{ padding: 2 }}>
        {type === "jpg" || type === "jpeg" || type === "png" ? (
          <Pressable
            onPress={() => {
              // setDocId(itemData.item.fileId.split("_")[1]);
              setDocId(itemData.item.id);
              setDocName(itemData.item.fileName);
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
              //  setDocId(itemData.item.fileId.split("_")[1]);
              setDocId(itemData.item.id);
              setDocName(itemData.item.fileName);
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
