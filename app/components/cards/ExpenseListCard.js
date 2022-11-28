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
import ReasonDialog from "../../components/dialog/ReasonDialog";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";

export default function ExpenseListCard({
  data,
  WhichExpense,
  setid,
  deletedialogcall,
}) {
  const navigation = useNavigation();
  const [dialogstatus, setdialogstatus] = useState(false);

  const [reason, setreason] = useState("");
  const [position, setposition] = useState(1);

  return (
    <FlatList
      data={data}
      overScrollMode="never"
      bounces={false}
      // onScrollBeginDrag={scroll}
      // onEndReached={scroll}
      /* onScrollEndDrag={() => console.log('from')}
      onScroll={() => console.log('end')} */
      renderItem={renderLocationsItem}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => {
        item.index;
      }}
    />
  );
  function renderLocationsItem({ ...itemData }) {
    function List() {
      let from;
      if ("from" in itemData.item) {
        from = itemData.item.from;
      } else {
        from = "Editablelist";
      }

      switch (WhichExpense) {
        case 1:
          if (!itemData.item.CustomData) {
            navigation.navigate("Daily Diem", {
              TourId: itemData.item.tour_id,
              FromDate: itemData.item.fromdate,
              ToDate: itemData.item.todate,
              ReqDate: itemData.item.Req,
              Date: itemData.item.Date,
              Remarks: reason,
              DailyDiemId: itemData.item.id,
              Data: data,
              from: from,
            });
          } else {
            navigation.navigate("Daily Diem", {
              TourId: itemData.item.tour_id,
              FromDate: itemData.item.fromdate,
              ToDate: itemData.item.todate,
              ReqDate: itemData.item.Req,
              Date: itemData.item.Date,
              CustomData: itemData.item.CustomData,
              Remarks: reason,
              DailyDiemId: "",
              Data: data,
              customid: itemData.item.id,
              from: from,
            });
          }
          break;
        case 2:
          navigation.navigate("LocalConveyance", {
            TourId: itemData.item.tour_id,
            FromDate: itemData.item.fromdate,
            ToDate: itemData.item.todate,
            ReqDate: itemData.item.Req,
            Comments: reason,
            LocalConveyanceId: itemData.item.id,
            from: from,
          });
          break;
        case 3:
          navigation.navigate("Lodging", {
            TourId: itemData.item.tour_id,
            FromDate: itemData.item.fromdate,
            ToDate: itemData.item.todate,
            ReqDate: itemData.item.Req,
            Comments: reason,
            LodgingId: itemData.item.id,
            from: from,
          });
          break;
        case 4:
          navigation.navigate("Traveling Expenses", {
            TourId: itemData.item.tour_id,
            FromDate: itemData.item.fromdate,
            ToDate: itemData.item.todate,
            ReqDate: itemData.item.Req,
            Comments: reason,
            TravelingExpenseId: itemData.item.id,
            from: from,
          });
          break;
        case 5:
          navigation.navigate("Associated Expenses", {
            TourId: itemData.item.tour_id,
            FromDate: itemData.item.fromdate,
            ToDate: itemData.item.todate,
            ReqDate: itemData.item.Req,
            Comments: reason,
            AssociatedExpensesId: itemData.item.id,
            from: from,
          });
          break;
      }
    }
    function expensecall() {
      console.log(itemData.index + "itemData.index");
      if (reason != "") {
        setdialogstatus(!dialogstatus);
        navigation.navigate("Daily Diem", {
          TourId: itemData.item.tour_id,
          FromDate: itemData.item.fromdate,
          ToDate: itemData.item.todate,
          ReqDate: itemData.item.Req,
          Date: itemData.item.Date,
          CustomData: itemData.item.CustomData,
          Remarks: reason,
          DailyDiemId: "",
          Data: data,
          customid: itemData.item.id,
        });
      }
    }

    return (
      <View style={styles.item}>
        <Pressable onPress={List}>
          
          <View style={styles.mainrow}>
            <View style={styles.row}>
              <Text style={styles.label}>Travel No : </Text>
              <Text style={styles.text}>{itemData.item.tour_id}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Req : </Text>
              <Text style={styles.text}>{itemData.item.Req}</Text>
            </View>
          </View>

          <View style={styles.mainrow}>
            <View style={styles.row}>
              <Text style={styles.label}>Claimed Amount : </Text>
              <Text style={styles.text}>{itemData.item.claimedamount}</Text>
            </View>
            
          </View>

          {WhichExpense == 1 && (
            <View style={styles.mainrow}>
              <View style={styles.row}>
                <Text style={styles.label}>Date : </Text>
                <Text style={styles.text}>{itemData.item.Date}</Text>
              </View>
            </View>
          )}

          <View style={styles.mainrow}>
            <View style={styles.row}>
              <Text style={styles.label}>Remarks : </Text>
              <Text style={styles.text}>{itemData.item.remarks}</Text>
              </View>
              <View style={styles.row}>
              {WhichExpense != 1 &&
                data.length > 1 &&
                itemData.item.from != "Approver" && (
                  <MaterialIcons
                    name="delete"
                    size={24}
                    color="red"
                    onPress={() => {
                      setid(itemData.item.id);
                    }}
                    onPressIn={deletedialogcall}
                  />
                )}
            </View>
          </View>
        </Pressable>
        {dialogstatus && (
          <ReasonDialog
            dialogstatus={dialogstatus}
            Tittle=""
            setdata={setreason}
            data={reason}
            setdialogstatus={setdialogstatus}
            selectedposition={position}
            confirmclicked={expensecall}
          ></ReasonDialog>
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
});
