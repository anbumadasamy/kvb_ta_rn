import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CustomColors } from "../../utilities/CustomColors";

export default function CCBSSummaryCard({
  data,
  scroll,
  setdeletid,
  setdeletedialogstatus,
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
    function editccbs() {
      navigation.navigate("ExpenseAddCCBS", {
        data: data,
        id: itemData.item.id,
        claimamount: itemData.item.claimamount,
        TourId: itemData.item.TourId,
        FromDate: itemData.item.FromDate,
        ToDate: itemData.item.ToDate,
        ReqDate: itemData.item.ReqDate,
      });
    }

    return (
      <View style={styles.item}>
        <Pressable onPress={editccbs}>
        <View style={styles.mainrow}>
          <View style={styles.row}>
            <Text style={styles.label}>BS : </Text>
            <Text style={styles.text}>{itemData.item.bs}</Text>
          </View>
          </View>

          <View style={styles.mainrow}>
          <View style={styles.row}>
            <Text style={styles.label}>CC : </Text>
            <Text style={styles.text}>{itemData.item.cc}</Text>
          </View>
          </View>

          <View style={styles.mainrow}>
          <View style={styles.row}>
            <Text style={styles.label}>Expense Amount : </Text>
            <Text style={styles.text}>{itemData.item.getamount}</Text>
          </View>
          </View>


          <View style={styles.mainrow}>
            <View style={styles.row}>
              <Text style={styles.label}>Percentage : </Text>
              <Text style={styles.text}>{itemData.item.percentage}</Text>
            </View>
            <View style={styles.row}>
              <MaterialIcons
                name="delete"
                size={24}
                color="red"
                onPress={() => {
                  setdeletid(itemData.item.id);
                  setdeletedialogstatus(true);
                }}
                // onPressIn={deletedialogcall}
              ></MaterialIcons>
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
    padding: 3,
  },
  mainrow: {
    flexDirection: "row",
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
});
