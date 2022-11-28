import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import { View, StyleSheet, Text, Image } from "react-native";
import TravelSummaryCard from "../../components/cards/TravelSummaryCard";
import moment from "moment";

export default function OnGoingTravelScreen({ route }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [progressBar, setProgressBar] = useState(true);
  const [onGoingSummary, setOnGoingSummary] = useState([]);
  let onGoingSummaryArray = [];

  useEffect(() => {
    navigation.setOptions({
      title: "On-Going",
    });
    getOnGoingSummary();
  }, []);

  async function getOnGoingSummary() {
    try {
      const response = await fetch(URL.ONGOING_TOUR_SUMMARY, {
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
      }

      for (let i = 0; i < json.data.length; i++) {
        const obj = {
          id: json.data[i].id,
          requestdate: moment(json.data[i].requestdate).format("DD-MM-YYYY"),
          startdate: moment(json.data[i].startdate).format("DD-MM-YYYY"),
          enddate: moment(json.data[i].enddate).format("DD-MM-YYYY"),
          approvedby: json.data[i].approvedby,
          reason: json.data[i].reason,
          travelStatusId: json.data[i].tour_status_id,
          travelStatus: json.data[i].tour_status,
        };
        onGoingSummaryArray.push(obj);
      }
      setOnGoingSummary(onGoingSummaryArray);
      setProgressBar(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.safeAreaViewContainer}>
      <View style={styles.screenContainer}>
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
            {onGoingSummary.length > 0 ? (
              <TravelSummaryCard
                scroll={getOnGoingSummary}
                data={onGoingSummary}
                from="on_going"
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
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: CustomColors.screen_background_gray,
  },
  screenContainer: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
  },
  noDataFoundText: {
    fontSize: 15,
    textAlign: "center",
    color: CustomColors.primary_gray,
    marginTop: "50%",
  },
});
