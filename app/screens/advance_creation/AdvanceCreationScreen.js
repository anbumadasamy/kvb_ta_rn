import { CustomColors } from "../../utilities/CustomColors";
import HeaderBox from "../../components/ui/HeaderBox";
import { useNavigation } from "@react-navigation/native";
import AdvanceClaimCard from "../../components/cards/AdvanceClaimCard";
import { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";

let advanceDetailArray = [];

export default function AdvanceCreation() {
  const navigation = useNavigation();
  const [advanceDetail, setAdvanceDetail] = useState([]);
  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset="35"
      style={styles.screenContainer}
    >
      <View style={styles.mainContainer}>
        <View style={styles.outerRowContainer}>
          <View style={styles.innnerRowContainer}>
            <Text style={styles.labelText}>Travel No:</Text>
            <Text style={styles.inputText}>1997</Text>
          </View>
          <View style={styles.innnerRowContainer}>
            <Text style={styles.labelText}>Requested Date:</Text>
            <Text style={styles.inputText}>28-09-1997</Text>
          </View>
        </View>
        <View style={{ marginTop: 15 }}>
          <HeaderBox
            onPressEvent={() => {
              navigation.navigate("Advance Detail", {ccbsData: null});
            }}
            label="Make Advance Amount Here"
            icon="add-circle-outline"
          />
          <AdvanceClaimCard />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: CustomColors.primary_white,
  },
  mainContainer: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: "4%",
    paddingBottom: "3%",
  },
  outerRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  innnerRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "normal",
    color: CustomColors.text_gray,
    textAlignVertical: "center",
  },
  inputText: {
    fontSize: 13.5,
    fontWeight: "bold",
    color: CustomColors.text_color,
    marginLeft: 5,
    textAlignVertical: "center",
  },
});
