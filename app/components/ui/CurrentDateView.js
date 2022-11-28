import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import moment from "moment";

export default function CurrentDateView({
  reqDate,
  setReqDate,
  setReqDateJson,
}) {
  useEffect(() => {
    let tempDate = new Date(new Date());
    setReqDate(moment(tempDate).format("DD-MM-YYYY"));
    setReqDateJson(moment(tempDate).format("YYYY-MM-DD"));
  }, [reqDate]);

  return (
    <View style={styles.currentDateView}>
      <MaterialCommunityIcons name="calendar" size={22} color="#A2A2A2" />
      <Text style={styles.currentDateText}>{reqDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  currentDateView: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "flex-end",
    alignItems: "center",
  },
  currentDateText: {
    fontSize: 14,
    marginStart: 10,
  },
});
