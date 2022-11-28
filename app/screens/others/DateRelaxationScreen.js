import { useEffect, useState, useContext } from "react";
import DateRelaxationCard from "../../components/cards/DateRelaxationCard";
import { URL } from "../../utilities/UrlBase";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../data/Auth-Context";
import { View, StyleSheet, Text, Image } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import ToastMessage from "../../components/toast/ToastMessage";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import moment from "moment";

let dateRelaxationArray = [];

export default function TravelHistoryScreen() {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const [dateRelaxationSummary, setDateRelaxationSummary] = useState([]);
  const [progressBar, setProgressBar] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pagination, setPagination] = useState(true);

  useEffect(() => {
    if (pagination) {
      dateRelaxationArray = [];
      GetDateRelaxation();
    }
  }, [pageNo]);

  async function GetDateRelaxation() {
    console.log("URL :>> " + URL.DATE_RELAXATION_SUMMARY + pageNo);
    try {
      const response = await fetch(URL.DATE_RELAXATION_SUMMARY + pageNo, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      if (json.pagination) {
        setPagination(json.pagination.has_next);
      } else {
        setPagination(false);
      }

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      for (let i = 0; i < json.data.length; i++) {
        const obj = {
          id: json.data[i].id,
          travelNo: json.data[i].tour_id,
          requestdate: moment(json.data[i].request_date_ms).format(
            "DD-MM-YYYY"
          ),
          startdate: moment(json.data[i].from_date_ms).format("DD-MM-YYYY"),
          enddate: moment(json.data[i].to_date_ms).format("DD-MM-YYYY"),
          approvedby: json.data[i].employee_name,
          reason: json.data[i].reason,
          status: json.data[i].status == 1 ? true : false,
        };
        dateRelaxationArray.push(obj);
      }
      setDateRelaxationSummary([
        ...dateRelaxationSummary,
        ...dateRelaxationArray,
      ]);
      setProgressBar(false);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  async function DateRelaxation(id, travelNo, status) {
    const data = [
      {
        id: id,
        tour_id: travelNo,
        status: status,
      },
    ];

    try {
      const response = await fetch(URL.SWITCH_DATE_RELAXATION, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      console.log("Switch Data :>> " + JSON.stringify(json));

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      if (json) {
        if (json.message) {
          ToastMessage(json.message);
          navigation.goBack();
          navigation.navigate("Date Relaxation");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      console.error(error);
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
            {dateRelaxationSummary.length > 0 ? (
              <DateRelaxationCard
                scroll={() => {
                  setPageNo(pageNo + 1);
                }}
                data={dateRelaxationSummary}
                switchToggle={(id, travelNo, status) => {
                  DateRelaxation(id, travelNo, status);
                }}
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
