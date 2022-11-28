import { useEffect, useState, useContext, useLayoutEffect } from "react";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Text,
  LogBox,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import SearchFilterDialog from "../../components/dialog/SearchFilterDialog";
import TravelSummaryCard from "../../components/cards/TravelSummaryCard";
import { CustomColors } from "../../utilities/CustomColors";
import ToastMessage from "../../components/toast/ToastMessage";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import { Picker } from "react-native-actions-sheet-picker";
import ApprovelReasonDialog from "../../components/dialog/ApprovelReasonDialog";
import moment from "moment";

let makerSummaryArray = [];

export default function TravelMakerSummaryScreen({
  travelDialogStatus,
  setTravelDialogStatus,
}) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [makerSummary, setMakerSummary] = useState([]);
  const [filterStatus, setFilterStatus] = useState(2);
  const [progressBar, setProgressBar] = useState(true);
  const [pagination, setPagination] = useState(true);
  const [reasonDialogStatus, setReasonDialogStatus] = useState(false);
  const [reason, setReason] = useState();
  const [pickerStatus, setPickerStatus] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [travelNo, setTravelNo] = useState("");
  const [reqDate, setReqDate] = useState("");
  const [jsonDate, setJsonDate] = useState("");
  const [status, setStatus] = useState("Pennding List");
  const [filStatus, setFilstatus] = useState(1);

  useEffect(() => {
    if (isFocused) {
      authCtx.SetMakerSummaryType("TRAVEL_SUMMARY");
    }
  }, [isFocused]);

  console.log("Tab :>> " + authCtx.makerSummaryType);

  useEffect(() => {
    if (pagination) {
      makerSummaryArray = [];
      GetMakerSummary();
    }
  }, [filStatus, pageNo]);

  useEffect(() => {
    LogBox.ignoreLogs([
      "value provided is not in a recognized RFC2822 or ISO format.",
    ]);
  });

  const filterList = [
    {
      id: 6,
      name: "All",
    },
    {
      id: 3,
      name: "Approved List",
    },
    {
      id: 2,
      name: "Pending List",
    },
    {
      id: 5,
      name: "Returned List",
    },
    {
      id: 4,
      name: "Rejected List",
    },
  ];

  function Clear() {
    setTravelNo("");
    setReqDate("");
    setJsonDate("");
  }

  const onDateChange = (selectedDate) => {
    setPickerStatus(!pickerStatus);
    setReqDate(moment(selectedDate).format("DD-MM-YYYY"));
    setJsonDate(moment(selectedDate).format("DD-MMM-YYYY"));
  };

  console.log("Filter Status :>> " + JSON.stringify(filStatus));

  async function GetMakerSummary() {
    let url;

    if (filterStatus != 6) {
      if (jsonDate == "" && travelNo == "") {
        url =
          URL.TRAVEL_MAKER_SUMMARY +
          "?status=" +
          filterStatus +
          "&page=" +
          pageNo;
      } else if (jsonDate != "" && travelNo == "") {
        url =
          URL.TRAVEL_MAKER_SUMMARY +
          "?page=" +
          pageNo +
          "&status=" +
          filterStatus +
          "&request_date=" +
          jsonDate;
      } else if (travelNo != "" && jsonDate == "") {
        url =
          URL.TRAVEL_MAKER_SUMMARY +
          "?page=" +
          pageNo +
          "&status=" +
          filterStatus +
          "&tour_no=" +
          travelNo;
      } else if (jsonDate != "" && travelNo != "") {
        url =
          URL.TRAVEL_MAKER_SUMMARY +
          "?page=" +
          pageNo +
          "&status=" +
          filterStatus +
          "&tour_no=" +
          travelNo +
          "&request_date=" +
          jsonDate;
      }
    } else if (filterStatus == 6) {
      if (jsonDate == "" && travelNo == "") {
        url = URL.TRAVEL_MAKER_SUMMARY + "?page=" + pageNo;
      } else if (jsonDate != "" && travelNo == "") {
        url =
          URL.TRAVEL_MAKER_SUMMARY +
          "?page=" +
          pageNo +
          "&request_date=" +
          jsonDate;
      } else if (travelNo != "" && jsonDate == "") {
        url =
          URL.TRAVEL_MAKER_SUMMARY + "?page=" + pageNo + "&tour_no=" + travelNo;
      } else if (jsonDate != "" && travelNo != "") {
        url =
          URL.TRAVEL_MAKER_SUMMARY +
          "?page=" +
          pageNo +
          "&tour_no=" +
          travelNo +
          "&request_date=" +
          jsonDate;
      }
    }

    console.log("url :>> " + JSON.stringify(url));

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

      if (json.data) {
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

          if (obj.tourCancelStatusId == -1) {
            makerSummaryArray.push(obj);
          }
        }
        setMakerSummary([...makerSummary, ...makerSummaryArray]);
      }

      setProgressBar(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function CancelRequest(cancelReason, cancelTravelId) {
    try {
      const response = await fetch(URL.TRAVEL_CANCEL_REQUEST, {
        method: "POST",
        body: JSON.stringify({
          appcomment: cancelReason,
          approval: 6,
          apptype: "TourCancel",
          status: 1,
          tour_id: cancelTravelId,
        }),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      if (json) {
        if (json.message) {
          ToastMessage(json.message);
          setTravelNo("");
          setReason("");
          navigation.goBack();
          navigation.goBack();
          navigation.navigate("Maker Summary");
        } else if (json.description) {
          Alert.alert(json.description);
        } else if (json.detail) {
          Err;
        }
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
            {makerSummary.length > 0 ? (
              <View>
                <TravelSummaryCard
                  scroll={() => {
                    setPageNo(pageNo + 1);
                  }}
                  data={makerSummary}
                  from="travel_update"
                  travelCancelRequest={(value) => {
                    setTravelNo(value);
                    setReasonDialogStatus(!reasonDialogStatus);
                  }}
                />
                {reasonDialogStatus && (
                  <ApprovelReasonDialog
                    dialogStatus={reasonDialogStatus}
                    setDialogStatus={setReasonDialogStatus}
                    tittle=""
                    setValue={setReason}
                    buttontext="Cancel"
                    value={reason}
                    from="cancel"
                    onPressEvent={() => {
                      CancelRequest(reason, travelNo);
                    }}
                  ></ApprovelReasonDialog>
                )}
              </View>
            ) : (
              <Text style={styles.noDataFoundText}>No data found</Text>
            )}
          </View>
        )}

        <Picker
          id="makerSummaryFilter"
          data={filterList}
          searchable={false}
          label="Which list you want?"
          placeholderTextColor="#A2A2A2"
          setSelected={(value) => {
            setPagination(true);
            setProgressBar(true);
            setMakerSummary([]);
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
        {travelDialogStatus && (
          <SearchFilterDialog
            Clear={Clear}
            dialogStatus={travelDialogStatus}
            close={() => {
              setTravelDialogStatus(!travelDialogStatus);
            }}
            confirmFilter={() => {
              setPagination(true);
              setProgressBar(true);
              setMakerSummary([]);
              setPageNo(1);
              setFilstatus(
                Math.floor(Math.random() * 100) +
                  1 +
                  "" +
                  Math.floor(Math.random() * 100) +
                  1
              );
              setTravelDialogStatus(!travelDialogStatus);
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
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
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