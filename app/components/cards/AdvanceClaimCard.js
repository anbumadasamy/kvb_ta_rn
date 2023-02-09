import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function AdvanceClaimCard({ data, scroll }) {
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
      <Pressable style={styles.item} onPress={() => {}}>
        <View style={styles.row}>
          <View style={styles.innerRow}>
            <Text style={styles.label}>Req Amount : </Text>
            <Text style={styles.text}>{itemData.item.reqAmount}</Text>
          </View>
          {/*  <View style={styles.innerRow}>
            <Text style={styles.label}>App Amount: </Text>
            <Text style={styles.text}>{itemData.item.appAmount}</Text>
          </View> */}
        </View>

        <View style={styles.row}>
          <View style={styles.innerRow}>
            <Text style={styles.label}>App Amount: </Text>
            <Text style={styles.text}>{itemData.item.appAmount}</Text>
          </View>
          {/*  <View style={styles.innerRow}>
            <Text style={styles.label}>Reason: </Text>
            <Text style={styles.text}>{itemData.item.reason}</Text>
          </View> */}
        </View>

        <View style={styles.row}>
          <View style={styles.innerRow}>
            <Text style={styles.label}>Approver: </Text>
            <Text style={styles.text}>{itemData.item.approver}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Pressable
              onPress={() => {
                navigation.navigate("Advance Detail", {
                  advanceData: itemData.item,
                  totalAmount: itemData.item.reqAmount,
                  randomAdvId: itemData.item.randomAdvId,
                  ccbsData: null
                });
              }}
            >
              <Text
                style={{
                  fontSize: 12.5,
                  fontWeight: "bold",
                  marginRight: 10,
                  color: CustomColors.status_green,
                }}
              >
                Edit CCBS
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.innerRow}>
            <Text style={styles.label}>Reason: </Text>
            <Text style={styles.text}>{itemData.item.reason}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
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
    backgroundColor: CustomColors.primary_white,
    borderWidth: 0.3,
    borderColor: CustomColors.primary_gray,
    padding: 8,
    borderRadius: 5,
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
