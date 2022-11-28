import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import { useNavigation } from "@react-navigation/native";

export default function HistorySummaryCard({ data, scroll }) {
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
      <View style={styles.item}>
        <View style={styles.row}>
          <View style={styles.row1}>
            <Text style={styles.label}>Travel No: </Text>
            <Text style={styles.text}>{itemData.item.id}</Text>
          </View>
          <View style={styles.row1}>
            <Text style={styles.label}>Req: </Text>
            <Text style={styles.text}>{itemData.item.requestdate}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.row1}>
            <Text style={styles.label}>From: </Text>
            <Text style={styles.text}>{itemData.item.startdate}</Text>
          </View>
          <View style={styles.row1}>
            <Text style={styles.label}>To: </Text>
            <Text style={styles.text}>{itemData.item.enddate}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.row1}>
            <Text style={styles.label}>Tour Approved By: </Text>
            <Text style={styles.text}>{itemData.item.approvedby}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.row1}>
            <Text style={styles.label}>Reason: </Text>
            <Text style={styles.text}>{itemData.item.reason}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.PressableContainer1}
            onPress={() => {
              navigation.navigate("TravelDetailScreen", {
                travelNo: itemData.item.id,
                reqDate: itemData.item.requestdate,
              });
            }}
          >
            <Text style={styles.buttonText}>Travel Detail</Text>
          </Pressable>

          <Pressable
            style={styles.PressableContainer2}
            onPress={() => {
              navigation.navigate("MemberApprovalTabScreen", {
                TourId: itemData.item.id,
                FromDate: itemData.item.startdate,
                ToDate: itemData.item.enddate,
                ReqDate: itemData.item.requestdate,
                from: "TravelHistory",
              });
            }}
          >
            <Text style={styles.buttonText}>Expense Detail</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    padding: 2,
    justifyContent: "space-between",
  },
  row1: {
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
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  PressableContainer1: {
    borderRadius: 5,
    backgroundColor: CustomColors.primary_yellow,
    justifyContent: "center",
    alignItems: "center",
  },
  PressableContainer2: {
    marginLeft: 20,
    borderRadius: 5,
    backgroundColor: CustomColors.button_violet,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: CustomColors.primary_white,
    fontSize: 12,
    padding: 5,
  },
});
