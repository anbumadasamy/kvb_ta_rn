import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { Picker, onOpen } from "react-native-actions-sheet-picker";
import { CustomColors } from "../../utilities/CustomColors";
import { MaterialIcons } from "@expo/vector-icons";

export default function PopUpPickerColumn({
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
            <Text style={styles.textHint}>{hint}</Text>
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
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: {
    color: CustomColors.primary_dark,
    fontSize: 14,
    marginBottom: 10
  },
  pressable: {
    flexDirection: "row",
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
  },
  textHint: {
    fontSize: 14,
    padding: 6,
    color: CustomColors.primary_gray,
  },
});
