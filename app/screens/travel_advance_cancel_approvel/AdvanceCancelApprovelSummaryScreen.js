import { useEffect, useState, useContext } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { View, StyleSheet, Text, Image } from "react-native";
import SearchFilterDialog from "../../components/dialog/SearchFilterDialog";
import { Picker } from "react-native-actions-sheet-picker";
import TravelApprovelSummaryCard from "../../components/cards/TravelApprovelSummaryCard";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import moment from "moment";
import { URL } from "../../utilities/UrlBase";
import { CustomColors } from "../../utilities/CustomColors";
import { AuthContext } from "../../data/Auth-Context";

let first = false;
let travelAdvanceApprovelSummaryArray = [];

export default function AdvanceCancelApprovelSummaryScreen({
  advanceDialogStatus,
  setAdvanceDialogStatus,
}) {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [travelAdvanceApprovelSummary, setTravelAdvanceApprovelSummary] =
    useState([]);
  const [filterStatus, setFilterStatus] = useState(2);
  const [pagination, setPagination] = useState(true);
  const [progressBar, setProgressBar] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pickerStatus, setPickerStatus] = useState(false);
  const [travelNo, setTravelNo] = useState("");
  const [reqDate, setReqDate] = useState("");
  const [jsonDate, setJsonDate] = useState("");
  const [status, setStatus] = useState("Pennding List");
  const [filStatus, setFilstatus] = useState(1);

  useEffect(() => {
    if (pagination) {
      travelAdvanceApprovelSummaryArray = [];
      getApprovelSummary();
    }
  }, [filStatus, pageNo]);

  useEffect(() => {
    if (isFocused) {
      authCtx.SetMemberType("CANCEL_APPROVEL");
    }
  }, [isFocused]);

  function Clear() {
    setTravelNo("");
    setReqDate("");
    setJsonDate("");
  }

  if (first) {
    first = false;
    travelAdvanceApprovelSummaryArray = [];
  } else {
    first = true;
  }

  const filterList = [
    {
      id: 2,
      name: "Pending List",
    },
    {
      id: 3,
      name: "Approved List",
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

  async function getApprovelSummary(from) {
    let url;

    if (jsonDate == "" && travelNo == "") {
      url =
        URL.APPROVAL_SUMMARY_API +
        "advance" +
        "?status=" +
        filterStatus +
        "&page=" +
        pageNo;
    } else if (jsonDate != "" && travelNo == "") {
      url =
        URL.APPROVAL_SUMMARY_API +
        "advance" +
        "?page=" +
        pageNo +
        "&status=" +
        filterStatus +
        "&request_date=" +
        jsonDate;
    } else if (travelNo != "" && jsonDate == "") {
      url =
        URL.APPROVAL_SUMMARY_API +
        "advance" +
        "?page=" +
        pageNo +
        "&status=" +
        filterStatus +
        "&tour_no=" +
        travelNo;
    } else if (jsonDate != "" && travelNo != "") {
      url =
        URL.APPROVAL_SUMMARY_API +
        "advance" +
        "?page=" +
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
        if (json.detail == "Invalid credentials/token.") {
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
          id: json.data[i].tourid,
          appGid: json.data[i].id,
          raiserName: json.data[i].employee_name,
          desigination: json.data[i].empdesignation,
          requestDate: moment(json.data[i].requestdate_ms).format("DD-MM-YYYY"),
          travelStatus: json.data[i].tour_status,
          tourStatusId: json.data[i].tour_status_id,
          tourCancelStatusId: json.data[i].tour_cancel_status_id,
          reason: json.data[i].reason,
        };
        travelAdvanceApprovelSummaryArray.push(obj);
      }

      setTravelAdvanceApprovelSummary([
        ...travelAdvanceApprovelSummary,
        ...travelAdvanceApprovelSummaryArray,
      ]);
      setProgressBar(false);
      if (from == "search_filter") {
        setFilter(!filter);
        setTravelNo("");
        setReqDate("");
        setJsonDate("");
      }
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
            {travelAdvanceApprovelSummary.length > 0 ? (
              <View>
                <TravelApprovelSummaryCard
                  data={travelAdvanceApprovelSummary}
                  from="cancel_approvel"
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
          id="memberCancelApprovelFilter"
          data={filterList}
          searchable={false}
          label="Which list you want ?"
          setSelected={(value) => {
            setPagination(true);
            setProgressBar(true);
            setTravelAdvanceApprovelSummary([]);
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
        {advanceDialogStatus && (
          <SearchFilterDialog
            Clear={Clear}
            dialogStatus={advanceDialogStatus}
            close={() => {
              setAdvanceDialogStatus(!advanceDialogStatus);
            }}
            confirmFilter={() => {
              setTravelAdvanceApprovelSummary([]);
              setPageNo(1);
              setProgressBar(true);
              setPagination(true);
              setFilstatus(
                Math.floor(Math.random() * 100) +
                  1 +
                  "" +
                  Math.floor(Math.random() * 100) +
                  1
              );
              setAdvanceDialogStatus(!advanceDialogStatus);
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
