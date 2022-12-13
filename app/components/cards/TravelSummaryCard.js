import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import ToastMessage from "../toast/ToastMessage";

export default function TravelSummaryCard({
  data,
  scroll,
  from,
  travelCancelRequest,
}) {
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
          if (from == "travel_maker_summary") {
            if (
              itemData.item.travelStatusId == 3 &&
              !itemData.item.isTourEnded
            ) {
              navigation.navigate("Advance Creation", {
                travelNo: itemData.item.id,
                status: itemData.item.advanceStatusId,
                statusText: itemData.item.advanceStatus,
                reqDate: itemData.item.requestdate,
                ccBsData: null,
              });
            } else if (
              itemData.item.travelStatusId == 3 &&
              itemData.item.isTourEnded
            ) {
              ToastMessage("Travel Ended");
            } else {
              navigation.navigate("Travel Creation", {
                travelNo: itemData.item.id,
                status: itemData.item.travelStatusId,
                summaryFrom: from,
              });
            }
          }
        }}
      >
        <View style={styles.row}>
          <View style={styles.innerRow}>
            <Text style={styles.label}>Travel No: </Text>
            <Text style={styles.text}>{itemData.item.id}</Text>
          </View>
          <View style={styles.innerRow}>
            <Text style={styles.label}>Req: </Text>
            <Text style={styles.text}>{itemData.item.requestdate}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.innerRow}>
            <Text style={styles.label}>From: </Text>
            <Text style={styles.text}>{itemData.item.startdate}</Text>
          </View>
          <View style={styles.innerRow}>
            <Text style={styles.label}>To: </Text>
            <Text style={styles.text}>{itemData.item.enddate}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.innerRow}>
            <Text style={styles.label}>Approver: </Text>
            <Text style={styles.text}>{itemData.item.approvedby}</Text>
          </View>

          {(from == "travel_maker_summary" || from == "on_going") && (
            <View style={{ flexDirection: "row" }}>
              {from == "travel_maker_summary" &&
                !itemData.item.isTourEnded &&
                itemData.item.travelStatusId == 3 && (
                  <Pressable
                    onPress={() => {
                      travelCancelRequest(itemData.item.id);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12.5,
                        fontWeight: "bold",
                        marginRight: 10,
                        color: "#FE5886",
                      }}
                    >
                      CANCEL
                    </Text>
                  </Pressable>
                )}
              {
                <Text
                  style={{
                    fontSize: 12.5,
                    fontWeight: "bold",
                    color:
                      itemData.item.travelStatusId == 3 ? "#8ACAC0" : "#FE5886",
                  }}
                >
                  {itemData.item.travelStatus}
                </Text>
              }
            </View>
          )}

          {from == "travel_cancel_summary" && (
            <View>
              <Text
                style={{
                  fontSize: 12.5,
                  fontWeight: "bold",
                  color:
                    itemData.item.tourCancelStatusId == 3
                      ? "#8ACAC0"
                      : "#FE5886",
                }}
              >
                {itemData.item.tourCancelStatus}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.row}>
          <View style={styles.innerRow}>
            <Text style={styles.label}>Reason: </Text>
            <Text
              style={{
                color: CustomColors.primary_dark,
                fontSize: 12.5,
                /*  width: 200,
                numberOfLines: 1,
                ellipsizeMode:'tail' */
              }}
            >
              {itemData.item.reason}
            </Text>
          </View>
        </View>
      </Pressable>
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
    padding: 3,
    justifyContent: "space-between",
  },
  innerRow: {
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
  indidatorContainer: {
    height: 15,
    width: 15,
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
    backgroundColor: CustomColors.color_green,
  },
  indidatorText: {
    fontWeight: "bold",
    color: CustomColors.primary_white,
    fontSize: 12,
  },
});
