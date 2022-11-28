import { View, Text, StyleSheet, FlatList, Pressable , Alert} from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import { useNavigation } from "@react-navigation/native";

export default function TravelApprovelSummaryCard({ data, scroll, from, onBehalfOfEmpId }) {
  const navigation = useNavigation();
  return (
    <FlatList
      data={data}
      overScrollMode="never"
      bounces={false}
      onEndReached={scroll}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
    />
  );
  function renderItem({ ...itemData }) {
    return (
      <Pressable
        style={styles.item}
        onPress={() => {
          navigation.navigate("TravelDetailScreen", {
            travelNo: itemData.item.id,
            appGid: itemData.item.appGid,
            status: itemData.item.tourStatusId,
            tourCancelStatusId: itemData.item.tourCancelStatusId,
            onBehalfOfEmpId: onBehalfOfEmpId ? onBehalfOfEmpId : "",
            from: from,
          });
        }}
      >
        <View style={styles.row2}>
          <View style={styles.row}>
            <Text style={styles.label}>Travel No: </Text>
            <Text style={styles.text}>{itemData.item.id}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Req Date: </Text>
            <Text style={styles.text}>{itemData.item.requestDate}</Text>
          </View>
        </View>

        <View style={styles.row2}>
          <View style={styles.row}>
            <Text style={styles.label}>Raiser Name: </Text>
            <Text style={styles.text}>{itemData.item.raiserName}</Text>
          </View>
          <Text
            style={
              itemData.item.tourStatusId == "3"
                ? styles.approvedStatus
                : styles.penndingStatus
            }
          >
            {itemData.item.travelStatus}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Designation: </Text>
          <Text style={styles.text}>{itemData.item.desigination}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Reason: </Text>
          <Text style={styles.text}>{itemData.item.reason}</Text>
        </View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: CustomColors.primary_white,
    padding: 12,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    padding: 3,
  },
  row2: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    color: CustomColors.primary_dark,
    fontSize: 12.5,
  },
  label: {
    color: CustomColors.text_gray,
    fontSize: 12,
    fontWeight: "bold",
  },
  penndingStatus: {
    color: CustomColors.primary_red,
    fontSize: 12.5,
    fontWeight: "bold",
  },
  approvedStatus: {
    color: CustomColors.color_green,
    fontSize: 12.5,
    fontWeight: "bold",
  },
});
