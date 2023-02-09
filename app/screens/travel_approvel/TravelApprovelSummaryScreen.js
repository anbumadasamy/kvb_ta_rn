import { useEffect, useState, useContext, useLayoutEffect } from "react";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import { useIsFocused } from "@react-navigation/native";
import { View, StyleSheet, Text, LogBox, Image } from "react-native";
import OnbehalfDialog from "../../components/dialog/Onbehalfof_Dialog";
import SearchFilterDialog from "../../components/dialog/SearchFilterDialog";
import TravelApprovelSummaryCard from "../../components/cards/TravelApprovelSummaryCard";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import SearchDialog from "../../components/dialog/SearchDialog";
import { Picker } from "react-native-actions-sheet-picker";
import moment from "moment";

let travelApprovelSummaryArray = [];

export default function TravelApprovelSummaryScreen({
  travelDialogStatus,
  setTravelDialogStatus,
  onBehalfDialogStatus,
  setOnBehalfDialogStatus,
}) {
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [actions, setActions] = useState([]);
  const [onbehalfof, setonbehalfof] = useState(false);
  const [onBehalfOfEmpId, setOnBehalfOfEmpId] = useState("");
  const [onBehalfOfEmpName, setOnBehalfOfEmpName] = useState("");
  const [travelApprovelSummary, setTravelApprovelSummary] = useState([]);
  const [filterStatus, setFilterStatus] = useState(2);
  const [progressBar, setProgressBar] = useState(true);
  const [pagination, setPagination] = useState(true);
  const [pickerStatus, setPickerStatus] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [travelNo, setTravelNo] = useState("");
  const [reqDate, setReqDate] = useState("");
  const [jsonDate, setJsonDate] = useState("");
  const [status, setStatus] = useState("Pennding List");
  const [filStatus, setFilstatus] = useState(1);
  const [searchDialogStatus, setSearchDialogStatus] = useState(false);
  const [self, setSelf] = useState(false);

  useEffect(() => {
    if (isFocused) {
      authCtx.SetMemberType("TRAVEL_APPROVEL");
    }
  }, [isFocused]);

  useEffect(() => {
    if (self) {
      setOnBehalfOfEmpId("");
      setOnBehalfOfEmpName("");
    }
  }, [self]);

  useEffect(() => {
    //  CeoTeamCheck();
  }, []);

  useEffect(() => {
    if (pagination) {
      travelApprovelSummaryArray = [];
      getApprovelSummary();
    }
  }, [filStatus, pageNo]);

  useLayoutEffect(() => {
    LogBox.ignoreLogs([
      "Deprecation warning: value provided is not in a recognized RFC2822 or ISO format.",
    ]);
  });
  useEffect(() => {
    let filterList;
    if (onbehalfof) {
      filterList = [
        {
          id: 2,
          name: "Pending List",
        },
        {
          id: 3,
          name: "Approved List",
        },
        {
          id: 6,
          name: "Forward List",
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
    } else {
      filterList = [
        {
          id: 2,
          name: "Pending List",
        },
        {
          id: 3,
          name: "Approved List",
        },
        {
          id: 6,
          name: "Forward List",
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
    }

    setActions(filterList);
  }, [onbehalfof]);

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

  async function CeoTeamCheck() {
    try {
      const response = await fetch(URL.CEO_TEAMCHECK, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      const json = await response.json();

      setonbehalfof(json.onbehalf);
    } catch (error) {
      console.error(error);
    }
  }

  async function getApprovelSummary() {
    let url;

    if (onBehalfOfEmpId == "") {
      if (jsonDate == "" && travelNo == "") {
        url =
          URL.TRAVEL_APPROVEL_SUMMARY +
          "status=" +
          filterStatus +
          "&page=" +
          pageNo;
      } else if (jsonDate != "" && travelNo == "") {
        url =
          URL.TRAVEL_APPROVEL_SUMMARY +
          "page=" +
          pageNo +
          "&status=" +
          filterStatus +
          "&request_date=" +
          jsonDate;
      } else if (travelNo != "" && jsonDate == "") {
        url =
          URL.TRAVEL_APPROVEL_SUMMARY +
          "page=" +
          pageNo +
          "&status=" +
          filterStatus +
          "&tour_no=" +
          travelNo;
      } else if (jsonDate != "" && travelNo != "") {
        url =
          URL.TRAVEL_APPROVEL_SUMMARY +
          "page=" +
          pageNo +
          "&status=" +
          filterStatus +
          "&tour_no=" +
          travelNo +
          "&request_date=" +
          jsonDate;
      }
    } else if (onBehalfOfEmpId != "") {
      if (jsonDate == "" && travelNo == "") {
        url =
          URL.TRAVEL_APPROVEL_SUMMARY +
          "status=" +
          filterStatus +
          "&onbehalf=" +
          parseInt(onBehalfOfEmpId) +
          "&page=" +
          pageNo;
      } else if (jsonDate != "" && travelNo == "") {
        url =
          URL.TRAVEL_APPROVEL_SUMMARY +
          "page=" +
          pageNo +
          "&status=" +
          filterStatus +
          "&onbehalf=" +
          parseInt(onBehalfOfEmpId) +
          "&request_date=" +
          jsonDate;
      } else if (travelNo != "" && jsonDate == "") {
        url =
          URL.TRAVEL_APPROVEL_SUMMARY +
          "page=" +
          pageNo +
          "&status=" +
          filterStatus +
          "&onbehalf=" +
          parseInt(onBehalfOfEmpId) +
          "&tour_no=" +
          travelNo;
      } else if (jsonDate != "" && travelNo != "") {
        url =
          URL.TRAVEL_APPROVEL_SUMMARY +
          "page=" +
          pageNo +
          "&status=" +
          filterStatus +
          "&onbehalf=" +
          parseInt(onBehalfOfEmpId) +
          "&tour_no=" +
          travelNo +
          "&request_date=" +
          jsonDate;
      }
    }

    console.log("URL :>> " + JSON.stringify(url));

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      console.log("Travel approvel summary data :>> " + JSON.stringify(json));

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
        if (json.data[i].tour_cancel_status_id != "2") {
          const obj = {
            id: json.data[i].tourid,
            appGid: json.data[i].id,
            raiserName: json.data[i].employee_name,
            desigination: json.data[i].empdesignation,
            requestDate: moment(json.data[i].requestdate_ms).format(
              "DD-MM-YYYY"
            ),
            travelStatus: json.data[i].tour_status,
            tourStatusId: json.data[i].tour_status_id,
            reason: json.data[i].reason,
          };
          travelApprovelSummaryArray.push(obj);
        }
      }

      setTravelApprovelSummary([
        ...travelApprovelSummary,
        ...travelApprovelSummaryArray,
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
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>{status}</Text>
              </View>
              {authCtx.ceoPermission && onBehalfOfEmpName != "" && (
                <View style={styles.onBehalfofNameContainer}>
                  <Text
                    multiline={false}
                    numberOfLines={1}
                    style={styles.onBehalfofNameText}
                  >
                    On Behalf Of: {onBehalfOfEmpName}
                  </Text>
                </View>
              )}
            </View>
            {travelApprovelSummary.length > 0 ? (
              <View>
                <TravelApprovelSummaryCard
                  scroll={() => {
                    setPageNo(pageNo + 1);
                  }}
                  data={travelApprovelSummary}
                  from="travel_approvel_summary"
                  onBehalfOfEmpId={onBehalfOfEmpId}
                />
              </View>
            ) : (
              <Text style={styles.noDataFoundText}>No data found</Text>
            )}
          </View>
        )}

        <Picker
          id="memberApplovelFilter"
          data={actions}
          searchable={false}
          label="Which list you want?"
          placeholderTextColor="#A2A2A2"
          setSelected={(value) => {
            setPagination(true);
            setProgressBar(true);
            setTravelApprovelSummary([]);
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

        {onBehalfDialogStatus && (
          <OnbehalfDialog
            dialogstatus={onBehalfDialogStatus}
            clicked={() => {
              setPagination(true);
              setProgressBar(true);
              setTravelApprovelSummary([]);
              setFilstatus(
                Math.floor(Math.random() * 100) +
                  1 +
                  "" +
                  Math.floor(Math.random() * 100) +
                  1
              );
              setPageNo(1);
              setOnBehalfDialogStatus(!onBehalfDialogStatus);
            }}
            setself={setSelf}
            self={self}
            employyeid={onBehalfOfEmpId}
            setemployeeid={setOnBehalfOfEmpId}
            employee_name={onBehalfOfEmpName}
            setemployeename={setOnBehalfOfEmpName}
            close={() => {
              setOnBehalfDialogStatus(!onBehalfDialogStatus);
            }}
          ></OnbehalfDialog>
        )}

        {searchDialogStatus && (
          <SearchDialog
            dialogstatus={searchDialogStatus}
            setdialogstatus={setSearchDialogStatus}
            from="CeoTeam"
            setValue={(name) => {
              setOnBehalfOfEmpName(name);
            }}
            setId={(id) => {
              setOnBehalfOfEmpId(id);
            }}
          />
        )}
        {travelDialogStatus && (
          <SearchFilterDialog
            Clear={Clear}
            dialogStatus={travelDialogStatus}
            close={() => {
              setTravelDialogStatus(!travelDialogStatus);
            }}
            confirmFilter={() => {
              setTravelApprovelSummary([]);
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
  onBehalfofNameContainer: {
    marginBottom: 8,
    width: "70%",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  onBehalfofNameText: {
    fontSize: 12,
    padding: 2,
    marginLeft: 5,
    color: CustomColors.primary_dark,
    alignSelf: "flex-end",
  },
});
