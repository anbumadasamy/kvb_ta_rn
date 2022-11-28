import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { Picker, onOpen } from "react-native-actions-sheet-picker";
import { CustomColors } from "../../utilities/CustomColors";
import { MaterialIcons } from "@expo/vector-icons";

export default function PopUpPicker({
  listData,
  label,
  title,
  hint,
  pickerId,
  selectedName,
  setSelectedId,
  setSelectedName,
  clear,
}) {

  return (
    <View>
      <View style={styles.inputTextContainer}>
        <Text style={styles.label}>{label}</Text>
        <Pressable
          style={styles.pressable}
          onPress={() => {
            onOpen(pickerId);
          }}
        >
          {selectedName ? (
            <Text numberOfLines={1} style={styles.text}>{selectedName}</Text>
          ) : (
            <Text numberOfLines={1} style={styles.textHint}>{hint}</Text>
          )}
          <MaterialIcons name="arrow-drop-down" size={24} color="#A2A2A2" />
        </Pressable>
      </View>

      <Picker
        id={pickerId}
        data={listData}
        searchable={false}
        label={title}
        setSelected={(value) => {
          if(setSelectedId){
          setSelectedId(value.id);}
          if(setSelectedName){
          setSelectedName(value.name);
          }
          if (pickerId == "booking_needed") {
            clear();
          }
        }}
        placeholderTextColor="#A2A2A2"
      />
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
    marginRight: "5%",
    width: "35%",
  },
  pressable: {
    flexDirection: "row",
    width: "60%",
    height: 40,
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
    width: "85%"
  },
  textHint: {
    fontSize: 14,
    padding: 6,
    color: CustomColors.primary_gray,
    width: "85%"
  },
});
