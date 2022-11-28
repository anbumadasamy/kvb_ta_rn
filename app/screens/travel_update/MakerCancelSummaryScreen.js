import { useEffect, useState, useContext } from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, StyleSheet, Text, Image, LogBox } from "react-native";
import SearchFilterDialog from "../../components/dialog/SearchFilterDialog";
import { Picker } from "react-native-actions-sheet-picker";
import TravelSummaryCard from "../../components/cards/TravelSummaryCard";
import moment from "moment";
import { URL } from "../../utilities/UrlBase";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import { AuthContext } from "../../data/Auth-Context";

let first = false;
let travelCancelSummaryArray = [];

export default function MakerCancelSummaryScreen({
  cancelDialogStatus,
  setCancelDialogStatus,
}) {
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [travelCancelSummary, setTravelCancelSummary] = useState([]);
  const [filterStatus, setFilterStatus] = useState(2);
  const [pagination, setPagination] = useState(true);
  const [progressBar, setProgressBar] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pickerStatus, setPickerStatus] = useState(false);
  const [travelNo, setTravelNo] = useState("");
  const [reqDate, setReqDate] = useState("");
  const [jsonDate, setJsonDate] = useState("");
  const [status, setStatus] = useState("Pending List");
  const [filStatus, setFilstatus] = useState(1);

  useEffect(() => {
    if (pagination) {
      travelCancelSummaryArray = [];
      GetCancelSummary();
    }
  }, [filStatus, pageNo]);

  useEffect(() => {
    LogBox.ignoreLogs([
      "value provided is not in a recognized RFC2822 or ISO format.",
    ]);
  });

  useEffect(() => {
    if (isFocused) {
      authCtx.SetMakerSummaryType("CANCEL_SUMMARY");
    }
  }, [isFocused]);

  function Clear() {
    setTravelNo("");
    setReqDate("");
    setJsonDate("");
  }

  if (first) {
    first = false;
    travelCancelSummaryArray = [];
  } else {
    first = true;
  }

  const filterList = [
    {
      id: 3,
      name: "Approved List",
    },
    {
      id: 2,
      name: "Pending List",
    },
    {
      id: 4,
      name: "Rejected List",
    },
  ];

  const onDateChange = (selectedDate) => {
    setPickerStatus(!pickerStatus);
    setReqDate(moment(selectedDate).format("DD-MM-YYYY"));
    setJsonDate(moment(selectedDate).format("DD-MMM-YYYY"));
  };

  async function GetCancelSummary() {
    let url;

    if (jsonDate == "" && travelNo == "") {
      url =
        URL.TRAVEL_MAKER_SUMMARY +
        "?apptype=TourCancel" +
        "&status=" +
        filterStatus +
        "&page=" +
        pageNo;
    } else if (jsonDate != "" && travelNo == "") {
      url =
        URL.TRAVEL_MAKER_SUMMARY +
        "?apptype=TourCancel" +
        "&page=" +
        pageNo +
        "&status=" +
        filterStatus +
        "&request_date=" +
        jsonDate;
    } else if (travelNo != "" && jsonDate == "") {
      url =
        URL.TRAVEL_MAKER_SUMMARY +
        "?apptype=TourCancel" +
        "&page=" +
        pageNo +
        "&status=" +
        filterStatus +
        "&tour_no=" +
        travelNo;
    } else if (jsonDate != "" && travelNo != "") {
      url =
        URL.TRAVEL_MAKER_SUMMARY +
        "?apptype=TourCancel" +
        "&page=" +
        pageNo +
        "&status=" +
        filterStatus +
        "&tour_no=" +
        travelNo +
        "&request_date=" +
        jsonDate;
    }

    try {
      const response = await fetch(url, {
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

      if ("pagination" in json) {
        setPagination(json.pagination.has_next);
      } else {
        setPagination(true);
      }

      for (let i = 0; i < json.data.length; i++) {
        const obj = {
          id: json.data[i].id,
          requestdate: moment(json.data[i].requestdate).format("DD-MM-YYYY"),
          startdate: moment(json.data[i].startdate).format("DD-MM-YYYY"),
          enddate: moment(json.data[i].enddate).format("DD-MM-YYYY"),
          approvedby: json.data[i].approver_data.name,
          reason: json.data[i].reason,
          travelStatus: json.data[i].tour_status,
          travelStatusId: json.data[i].tour_status_id,
          tourCancelStatus: json.data[i].tour_cancel_status,
          tourCancelStatusId: json.data[i].tour_cancel_status_id,
          isTourEnded: json.data[i].is_tour_ended,
        };
        travelCancelSummaryArray.push(obj);
      }
      setTravelCancelSummary([
        ...travelCancelSummary,
        ...travelCancelSummaryArray,
      ]);
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
          <View style={{ flex: 1, paddingBottom: 30 }}>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
            {travelCancelSummary.length > 0 ? (
              <View>
                <TravelSummaryCard
                  data={travelCancelSummary}
                  from="travel_cancel_summary"
                  scroll={() => {
                    setPageNo(pageNo + 1);
                  }}
                />
              </View>
            ) : (
              <Text style={styles.noDataFoundText}>No data found</Text>
            )}
          </View>
        )}

        <Picker
          id="cancelSummaryFilter"
          data={filterList}
          searchable={false}
          label="Which list you want ?"
          setSelected={(value) => {
            setPagination(true);
            setProgressBar(true);
            setTravelCancelSummary([]);
            setFilterStatus(value.id);
            setStatus(value.name);
            setFilstatus(
              Math.floor(Math.random() * 100) +
                1 +
                "" +
                Math.floor(Math.random() * 100) +
                1
            );
            setPageNo(1);
          }}
        />
        {cancelDialogStatus && (
          <SearchFilterDialog
            Clear={Clear}
            dialogStatus={cancelDialogStatus}
            close={() => {
              setCancelDialogStatus(!cancelDialogStatus);
            }}
            confirmFilter={() => {
              setTravelCancelSummary([]);
              setPageNo(1);
              setPagination(true);
              setProgressBar(true);
              setFilstatus(
                Math.floor(Math.random() * 100) +
                  1 +
                  "" +
                  Math.floor(Math.random() * 100) +
                  1
              );
              setCancelDialogStatus(!cancelDialogStatus);
            }}
            travelNo={travelNo}
            setTravelNo={setTravelNo}
            reqDate={reqDate}
            setReqDate={onDateChange}
            pickerStatus={pickerStatus}
            setPickerStatus={() => setPickerStatus(!pickerStatus)}
          ></SearchFilterDialog>
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
  screenContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: CustomColors.screen_background_gray,
  },
  statusContainer: {
    marginBottom: 8,
    marginLeft: 5,
    width: "28%",
    alignContent: "center",
    borderRadius: 5,
  },
  statusText: {
    fontSize: 12,
    marginRight: 5,
    padding: 2,
    color: CustomColors.primary_dark,
    fontWeight: "bold",
  },
});
