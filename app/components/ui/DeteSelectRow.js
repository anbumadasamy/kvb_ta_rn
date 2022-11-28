import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import { MaterialIcons } from "@expo/vector-icons";

export default function DateSelectRow({ label, hint, selected, onPressEvent }) {
  return (
    <View>
      <View style={styles.inputTextContainer}>
        <Text style={styles.label}>{label}</Text>
        <Pressable style={styles.pressable} onPress={onPressEvent}>
          {selected ? (
            <Text style={styles.text}>{selected}</Text>
          ) : (
            <Text style={styles.textHint}>{hint}</Text>
          )}
          <View style={{ marginRight: 5 }}>
            <MaterialIcons name="date-range" size={22} color="#A2A2A2" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    color: CustomColors.primary_dark,
    fontSize: 14,
    marginBottom: 10,
  },
  pressable: {
    flexDirection: "row",
    height: 40,
    width: "60%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: CustomColors.primary_gray,
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    padding: 6,
    color: CustomColors.primary_dark,
  },
  textHint: {
    fontSize: 14,
    padding: 6,
    color: CustomColors.primary_gray,
  },
});
