import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function ExpenseDocumentBox({
  onPressAddIcon,
  documentData,
  setDocId,
  setDocName,
  deleteEvent,
  from,
}) {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.Text}>Attachments: </Text>
        {from == "create_update" && (
          <Ionicons
            onPress={onPressAddIcon}
            name="add-circle-outline"
            size={24}
            color="#8ACAC0"
          />
        )}
      </View>

      <FlatList
        data={documentData}
        overScrollMode="never"
        bounces={false}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => {
          return index;
        }}
      />
    </View>
  );

  function renderItem({ ...itemData }) {
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
                  setDocId(itemData.item.id);
                  setDocName(itemData.item.fileName);
                } else {
                  Alert.alert("Can't download/view now");
                }
              }}
            >
              <Entypo
                name="arrow-down"
                size={22}
                color={CustomColors.primary_green}
              />
            </Pressable>
            {from == "create_update" && (
              <Pressable
                style={{ marginLeft: 10 }}
                onPress={() => {
                  if (itemData.item.from == "API") {
                    deleteEvent(itemData.item.id, itemData.item.from);
                  } else {
                    deleteEvent(
                      itemData.item.randomDocumentId,
                      itemData.item.from
                    );
                  }
                }}
              >
                <MaterialIcons
                  name="delete"
                  size={22}
                  color={CustomColors.primary_red}
                />
              </Pressable>
            )}
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
