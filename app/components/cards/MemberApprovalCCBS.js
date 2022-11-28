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
import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";

export default function MemberApprovalCCBS({ data, scroll }) {
  const navigation = useNavigation();
  return (
    <FlatList
      data={data}
      overScrollMode="never"
      bounces={false}
      // onScrollBeginDrag={scroll}
      onEndReached={scroll}
      /* onScrollEndDrag={() => console.log('from')}
      onScroll={() => console.log('end')} */
      renderItem={renderLocationsItem}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
    />
  );
  function renderLocationsItem({ ...itemData }) {
    function expensecall() {
      console.log(itemData.item.reqdate + "Req Date");
      let Position;
      let title;
      let from = "Approver";
      switch (itemData.item.expenseid) {
        case 1:
          Position = 4;
          title = "Traveling Expenses List";
          break;
        case 2:
          Position = 1;
          title = "Daily Reimbursement List";
          break;
        case 4:
          Position = 2;
          title = "Local Conveyance List";
          break;
        case 5:
          Position = 3;
          title = "Lodging Expenses List";
          break;
        case 9:
          Position = 5;
          title = "Associated Expenses List";
          break;
      }
      navigation.navigate("ExpenseList", {
        TourId: itemData.item.TourId,
        ReqDate: itemData.item.reqdate,
        Tittle: title,
        Position: Position,
        from: from,
      });
    }
    return (
      <View style={styles.item}>
        {itemData.item.tab == "CCBS" && (
          <Pressable>
            <View style={styles.mainrow}>
              <View style={styles.row}>
                <Text style={styles.label}>BS : </Text>
                <Text style={styles.text}>{itemData.item.BB}</Text>
              </View>
            </View>

            <View style={styles.mainrow}>
              <View style={styles.row}>
                <Text style={styles.label}>CC : </Text>
                <Text style={styles.text}>{itemData.item.CC}</Text>
              </View>
            </View>

            <View style={styles.mainrow}>
              <View style={styles.row}>
                <Text style={styles.label}>Expense Amount : </Text>
                <Text style={styles.text}>{itemData.item.amount}</Text>
              </View>
            </View>

            <View style={styles.mainrow}>
              <View style={styles.row}>
                <Text style={styles.label}>Percentage : </Text>
                <Text style={styles.text}>{itemData.item.percentage}</Text>
              </View>
            </View>
          </Pressable>
        )}
        {itemData.item.tab == "MemberApprovalExpense" && (
          <Pressable onPress={expensecall}>
            <View style={styles.mainrow}>
              <View style={styles.row}>
                <Text style={styles.label}>Expense Type : </Text>
                <Text style={styles.text}>{itemData.item.expensename}</Text>
              </View>
            </View>

            <View style={styles.mainrow}>
              <View style={styles.row}>
                <Text style={styles.label}>Approved Amount : </Text>
                <Text style={styles.text}>{itemData.item.approvedamount}</Text>
              </View>
            </View>

            <View style={styles.mainrow}>
              <View style={styles.row}>
                <Text style={styles.label}>Claim Amount : </Text>
                <Text style={styles.text}>{itemData.item.claimedamount}</Text>
              </View>
            </View>

            <View style={styles.mainrow}>
              <View style={styles.row}>
                <Text style={styles.label}>Maker : </Text>
                <Text style={styles.text}>{itemData.item.maker}</Text>
              </View>
            </View>

            <View style={styles.mainrow}>
              <View style={styles.row}>
                <Text style={styles.label}>Reason : </Text>
                <Text style={styles.text}>
                  {itemData.item.requestercomment}
                </Text>
              </View>
              <View style={styles.file}>
                <MaterialIcons
                  name="image"
                  size={24}
                  color="black"
                  onPress={() => {
                    navigation.navigate("Add Documents", {
                      expenseid: itemData.item.expenseid,
                      expensetype: itemData.item.expensetype,
                      TourId: itemData.item.TourId,
                      claimstatusid: itemData.item.claimstatusid,
                    });
                  }}
                />
              </View>
            </View>
          </Pressable>
        )}
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
  text: {
    color: CustomColors.text_color,
    fontSize: 12.5,
  },
  label: {
    color: CustomColors.label_color,
    fontSize: 12,
    fontWeight: "bold",
  },
  mainrow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  file: {
    marginRight: 10,
  },
});
