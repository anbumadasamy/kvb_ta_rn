import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CustomColors } from "../../utilities/CustomColors";

export default function ExpenseSummaryCard({
  data,
  scroll,
  setid,
  deletedialogcall,
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
      keyExtractor={(item, index) => {
        return item.id;
      }}
    />
  );
  function renderItem({ ...itemData }) {
    function expensecall() {
      console.log(itemData.item.reqdate + "Req Date");
      let Position;
      let title;
      let from = "Bsubmit";
      switch (itemData.item.expenseid) {
        case 1:
          Position = 4;
          title = "Traveling Expenses List";
          break;
        case 2:
          Position = 1;
          title = "Daily Reimbursement List";
          break;
        case 3:
          Position = 6;
          title = "Incidential Expense List";
          break;
        case 4:
          Position = 2;
          title = "Local Conveyance List";
          break;
        case 5:
          Position = 3;
          title = "Lodging Expenses List";
          break;
        case 6:
          Position = 8;
          title = "Miscellaneous List";
          break;
        case 9:
          Position = 5;
          title = "Associated Expenses List";
          break;
      }
      navigation.navigate("ExpenseList", {
        TourId: itemData.item.TourId,
        ReqDate: itemData.item.reqdate,
        FromDate: itemData.item.FromDate,
        ToDate: itemData.item.ToDate,
        Tittle: title,
        Position: Position,
        from: from,
      });
    }

    return (
      <View style={styles.item}>
        <Pressable onPress={expensecall}>
          <View style={styles.mainrow}>
            <View style={styles.row}>
              <Text style={styles.label}>Expense Type: </Text>
              <Text style={styles.text}>{itemData.item.expenseType}</Text>
            </View>
          </View>

          <View style={styles.mainrow}>
            <View style={styles.row}>
              <Text style={styles.label}>Approved Amount: </Text>
              <Text style={styles.text}>{itemData.item.approvedAmount}</Text>
            </View>
          </View>

          <View style={styles.mainrow}>
            <View style={styles.row}>
              <Text style={styles.label}>Claim Amount: </Text>
              <Text style={styles.text}>{itemData.item.claimAmount}</Text>
            </View>
          </View>

          <View style={styles.mainrow}>
            <View style={styles.row}>
              <Text style={styles.label}>Comments: </Text>
              <Text style={styles.text}>{itemData.item.reason}</Text>
            </View>

            <View style={styles.mainrow}>
              <View style={styles.file}>
                <MaterialIcons
                  name="image"
                  size={24}
                  color="black"
                  onPress={() => {
                    navigation.navigate("Add Documents", {
                      expenseid: itemData.item.expenseid,
                      expensetype: itemData.item.expenseType,
                      TourId: itemData.item.TourId,
                      claimstatusid: itemData.item.claimstatusid,
                    });
                  }}
                />
              </View>
              <View>
                {(itemData.item.claimstatusid == -1 ||
                  itemData.item.claimstatusid == 1) && (
                  <MaterialIcons
                    name="delete"
                    size={24}
                    color="red"
                    onPress={() => {
                      setid(itemData.item.expenseid);
                    }}
                    onPressIn={deletedialogcall}
                  ></MaterialIcons>
                )}
              </View>
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
  row: {
    flexDirection: "row",
    padding: 2,
    justifyContent: "space-between",
  },
  mainrow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    color: CustomColors.text_color,
    fontSize: 12,
    maxWidth: "70%",
  },
  label: {
    color: CustomColors.label_color,
    fontSize: 12,
    fontWeight: "bold",
  },
  file: {
    marginRight: 10,
  },
});
