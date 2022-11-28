import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import HistorySummaryCard from "../../components/cards/HistorySummaryCard";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import { View, StyleSheet, Text, Image } from "react-native";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import { CustomColors } from "../../utilities/CustomColors";
import moment from "moment";

let start_value = 0;
let historySummaryArray = [];

export default function TravelHistoryScreen() {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [getHistorySummary, setHistorySummary] = useState([]);
  const [progressBar, setProgressBar] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: "Travel History",
    });
    getHistory();
  }, []);
  async function getHistory() {
    start_value = start_value + 1;
    try {
      const response = await fetch(
        URL.TRAVEL_MAKER_SUMMARY + "?page=" + start_value,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.auth_token,
          },
        }
      );
      let json = await response.json();

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      for (let i = 0; i < json.data.length; i++) {
        const obj = {
          id: json.data[i].id,
          requestdate: moment(json.data[i].requestdate).format("DD-MM-YYYY"),
          startdate: moment(json.data[i].startdate).format("DD-MM-YYYY"),
          enddate: moment(json.data[i].enddate).format("DD-MM-YYYY"),
          approvedby: json.data[i].approver_data.name,
          reason: json.data[i].reason,
        };
        historySummaryArray.push(obj);
      }
      setHistorySummary(historySummaryArray);
      setProgressBar(false);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.maincontainer}>
        {progressBar ? (
          <View
            style={{
              flex: 1,
              backgroundColor: CustomColors.screen_background_gray,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View>
              <Image
                style={{ width: 100, height: 100 }}
                source={require("../../assets/icons/Progressbar2.gif")}
              />
            </View>
          </View>
        ) : (
          <View>
            {getHistorySummary.length > 0 ? (
              <HistorySummaryCard
                scroll={getHistory}
                data={getHistorySummary}
              />
            ) : (
              <Text style={styles.noDataFoundText}>No data found</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noDataFoundText: {
    marginTop: "50%",
    fontSize: 15,
    textAlign: "center",
    color: CustomColors.primary_gray,
  },
  maincontainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: CustomColors.screen_background_gray,
  },
});
