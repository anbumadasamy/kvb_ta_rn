import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

export default function Dateview({date}) {
  return (
    <View style={styles.currentDateView}>
      <Ionicons name="today-outline" size={20} color="#A2A2A2" />
      <Text style={styles.currentDateText}>{date}</Text>
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
