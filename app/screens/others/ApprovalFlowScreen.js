import { useEffect, useState, useContext } from "react";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import { View, StyleSheet, Text, Image } from "react-native";
import ApprovalFlowCard from "../../components/cards/ApprovalFlowCard";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import { CustomColors } from "../../utilities/CustomColors";
import moment from "moment";

export default function ApprovalFlowScreen({ route }) {
  const authCtx = useContext(AuthContext);
  const [onGoingSummary, setOnGoingSummary] = useState([]);
  const [progressBar, setProgressBar] = useState(true);
  const travelNo = route.params.travelNo;
  let onGoingSummaryArray = [];

  useEffect(() => {
    GetApprovalFlowSummary();
  }, [travelNo]);

  async function GetApprovalFlowSummary() {
    setProgressBar(true);
    try {
      const response = await fetch(URL.APPROVAL_FLOW_SUMMARY + travelNo, {
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

      for (let i = 0; i < json.approve.length; i++) {
        const obj = {
          id: json.approve[i].id,
          travelNo: json.approve[i].tourid,
          approvedDate: moment(json.approve[i].approveddate_ms).format(
            "DD-MM-YYYY"
          ),
          type: json.approve[i].apptype,
          employee: json.approve[i].approvedby,
          comment: json.approve[i].comment,
          status: json.approve[i].status_name,
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
        <View style={styles.maincontainer}>
          {onGoingSummary.length > 0 ? (
            <ApprovalFlowCard data={onGoingSummary} />
          ) : (
            <Text style={styles.noDataFoundText}>No data found</Text>
          )}
        </View>
      )}
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
    marginHorizontal: 10,
    marginTop: 10,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: CustomColors.screen_background_gray,
  },
});
