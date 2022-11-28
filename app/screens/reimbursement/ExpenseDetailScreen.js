import { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import { View, StyleSheet, Text, Alert } from "react-native";
import ExpenseSummaryCard from "../../components/cards/ExpenseSummaryCard";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

export default function ExpenseDetailScreen({ route }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [expenseSummary, setExpenseSummary] = useState([]);
  let expenseSummaryArray = [];
  const travelNo = route.params.travelNo;
  const reqDate = route.params.reqDate;

  useEffect(() => {
    navigation.setOptions({
      title: "Expense Detail",
    });
    getExpenseSummary();
  }, []);

  async function getExpenseSummary() {
    try {
      const response = await fetch(URL.EXPENSE_SUMMARY + travelNo, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();
      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      } else {
        for (let i = 0; i < json.data.length; i++) {
          if (json.data[i].id !== null) {
            const obj = {
              id: json.data[i].id,
              expenseType: json.data[i].expensename,
              approvedAmount: json.data[i].approvedamount,
              claimAmount: json.data[i].claimedamount,
              reason: json.data[i].requestercomment,
            };
            expenseSummaryArray.push(obj);
          }
        }
        setExpenseSummary(expenseSummaryArray);
      }
    } catch (error) {}
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.travelNoView}>
            <Text style={styles.text}>Travel No: </Text>
            <Text style={styles.text}>{travelNo}</Text>
          </View>
          <View style={styles.currentDateView}>
            <Ionicons name="today-outline" size={20} color="#A2A2A2" />
            <Text style={styles.currentDateText}>{reqDate}</Text>
          </View>
        </View>
        {expenseSummary.length > 0 ? (
          <ExpenseSummaryCard data={expenseSummary} />
        ) : (
          <Text style={styles.noDataFoundText}>No data found</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: CustomColors.screen_background_gray,
  },
  mainContainer: {
    marginHorizontal: 10,
    marginBottom: "3%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  currentDateView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "flex-end",
    alignItems: "center",
  },
  currentDateText: {
    fontSize: 14,
    marginLeft: 10,
  },
  travelNoView: {
    flexDirection: "row",
  },
  text: {
    fontSize: 14,
  },
  noDataFoundText: {
    marginTop: "50%",
    fontSize: 15,
    textAlign: "center",
    color: CustomColors.primary_gray,
  },
});
