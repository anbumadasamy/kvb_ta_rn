import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { CustomColors } from "../../utilities/CustomColors";

export default function MemberApprovalSummaryCard({ data, scroll }) {
  const navigation = useNavigation();
  return (
    <FlatList
      data={data}
      overScrollMode="never"
      bounces={false}
      onEndReached={scroll}
      renderItem={renderLocationsItem}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
    />
  );
  function renderLocationsItem({ ...itemData }) {
    function expensecall() {
      navigation.navigate("MemberApprovalTabScreen", {
        TourId: itemData.item.id,
        FromDate: itemData.item.startdate,
        ToDate: itemData.item.enddate,
        ReqDate: itemData.item.requestdate,
        AppgId: itemData.item.appgid,
        onbehalfid: itemData.item.onbehalfid,
        claim_status: itemData.item.claim_status,
        applevel: itemData.item.applevel,
        previous: itemData.item.previous,
        from: "MemberApproval",
      });
    }

    return (
      <View style={styles.item}>
        <Pressable onPress={expensecall}>
          <View style={styles.mainrow}>
          <View style={styles.row}>
            <Text style={styles.label}>Travel No : </Text>
            <Text style={styles.text}>{itemData.item.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Req : </Text>
            <Text style={styles.text}>{itemData.item.requestdate}</Text>
          </View>
          </View>

          <View style={styles.mainrow}>
          <View style={styles.row}>
            <Text style={styles.label}>Name : </Text>
            <Text style={styles.text}>{itemData.item.employee_name}</Text>
          </View>
          <View style={styles.row}>
          <Text
              style={{
                fontWeight: "bold",
                color:
                  itemData.item.claim_status_id == 1 ||
                  itemData.item.claim_status_id == 2 ||
                  itemData.item.claim_status_id == 5
                    ? CustomColors.status_yellow
                    : itemData.item.claim_status_id == 3
                    ? CustomColors.status_green
                    : itemData.item.claim_status_id == 4
                    ? CustomColors.status_red
                    : CustomColors.status_green,
                fontSize: 12,
              }}
            >
              {itemData.item.claim_status}
            </Text>
          </View>
          </View>

          <View style={styles.mainrow}>
          <View style={styles.row}>
            <Text style={styles.label}>Designation : </Text>
            <Text style={styles.text}>{itemData.item.empdesignation}</Text>
          </View>

          </View>

          <View style={styles.mainrow}>
          <View style={styles.row}>
            <Text style={styles.label}>Approver : </Text>
            <Text style={styles.text}>{itemData.item.approver}</Text>
          </View>
          </View>
          
          <View style={styles.mainrow}>
          <View style={styles.row}>
            <Text style={styles.label}>Reason : </Text>
            <Text style={styles.text}>{itemData.item.reason}</Text>
          </View>
          </View>

        </Pressable>
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
  mainrow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    padding: 3,
  },
  text: {
    color: CustomColors.text_color,
    fontSize: 12.5,
  },
  label: {
    color: CustomColors.label_color,
    fontSize: 12,
    fontWeight: "bold",
  },
  statustext: {
    fontWeight: "bold",
    color: "green",
    fontSize: 12,
  },
});
