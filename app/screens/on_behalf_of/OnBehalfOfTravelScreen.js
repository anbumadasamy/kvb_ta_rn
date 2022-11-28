import { useEffect, useState, useContext, useLayoutEffect } from "react";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import { useIsFocused } from "@react-navigation/native";
import { View, StyleSheet, Text, LogBox, Image } from "react-native";
import SearchFilterDialog from "../../components/dialog/SearchFilterDialog";
import OnBehalfOfTravelSummaryCard from "../../components/cards/OnBehalfOfTravelSummaryCard";
import SearchDialog from "../../components/dialog/SearchDialog";
import { CustomColors } from "../../utilities/CustomColors";
import { Picker } from "react-native-actions-sheet-picker";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import moment from "moment";

let onBehalfOfTravelSummaryArray = [];

export default function OnBehalfOfTravelScreen({
  travelNoDialogStatus,
  setTravelNoDialogStatus,
  empSearchDialogStatus,
  setEmpSearchDialogStatus,
}) {
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [onBehalfOfTravelSummary, setOnBehalfOfTravelSummary] = useState([]);

  const [progressBar, setProgressBar] = useState(true);
  const [pagination, setPagination] = useState(true);
  const [pickerStatus, setPickerStatus] = useState(false);

  const [status, setStatus] = useState("Pending List");

  const [pageNo, setPageNo] = useState(1);

  const [filStatus, setFilstatus] = useState(1);
  const [filterStatus, setFilterStatus] = useState(2);
  const [onbehalfOfName, setOnbehalfOfName] = useState("All");
  const [onbehalfOfId, setOnbehalfOfId] = useState(0);
  const [travelNo, setTravelNo] = useState("");
  const [reqDate, setReqDate] = useState("");
  const [jsonDate, setJsonDate] = useState("");

  useEffect(() => {
    if (isFocused) {
      authCtx.SetMakerSummaryType("TRAVEL_SUMMARY");
    }
  }, [isFocused]);

  useEffect(() => {
    if (pagination) {
      onBehalfOfTravelSummaryArray = [];
      GetMakerSummary();
    }
  }, [filStatus, onbehalfOfId]);

  useLayoutEffect(() => {
    LogBox.ignoreLogs([
      "Deprecation warning: value provided is not in a recognized RFC2822 or ISO format.",
    ]);
  });

  const filterList = [
    {
      id: 1,
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

  async function GetMakerSummary() {
    let url;
    if (
      (onbehalfOfId == 0 || onbehalfOfId != 0) &&
      travelNo == "" &&
      jsonDate == ""
    ) {
      url =
        URL.ON_BEHALF_OF_SUMMARY +
        parseInt(onbehalfOfId) +
        "&status=" +
        filterStatus +
        "&page=" +
        pageNo;
    } else if (
      (onbehalfOfId == 0 || onbehalfOfId != 0) &&
      travelNo != "" &&
      jsonDate != ""
    ) {
      url =
        URL.ON_BEHALF_OF_SUMMARY +
        parseInt(onbehalfOfId) +
        "&page=" +
        pageNo +
        "&status=" +
        filterStatus +
        "&request_date=" +
        jsonDate +
        "&tour_no=" +
        parseInt(travelNo);
    } else if (
      (onbehalfOfId == 0 || onbehalfOfId != 0) &&
      travelNo != "" &&
      jsonDate == ""
    ) {
      url =
        URL.ON_BEHALF_OF_SUMMARY +
        parseInt(onbehalfOfId) +
        "&page=" +
        pageNo +
        "&status=" +
        filterStatus +
        "&tour_no=" +
        parseInt(travelNo);
    } else if (
      (onbehalfOfId == 0 || onbehalfOfId != 0) &&
      travelNo == "" &&
      jsonDate != ""
    ) {
      url =
        URL.ON_BEHALF_OF_SUMMARY +
        parseInt(onbehalfOfId) +
        "&page=" +
        pageNo +
        "&status=" +
        filterStatus +
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
          approvedby: json.data[i].employee_name,
          reason: json.data[i].reason,
          travelStatus: json.data[i].tour_status,
          travelStatusId: json.data[i].tour_status_id,
          tourCancelStatus: json.data[i].tour_cancel_status,
          tourCancelStatusId: json.data[i].tour_cancel_status_id,
          onBehalfOfName: json.data[i].employee_name,
          onBehalfOfId: json.data[i].empgid,
          onBehalfOfDesigination: json.data[i].empdesignation,
        };
        onBehalfOfTravelSummaryArray.push(obj);
      }
      setOnBehalfOfTravelSummary([
        ...onBehalfOfTravelSummary,
        ...onBehalfOfTravelSummaryArray,
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
              <View style={styles.onBehalfofNameContainer}>
                <Text
                  multiline={false}
                  numberOfLines={1}
                  style={styles.onBehalfofNameText}
                >
                  On Behalf Of: {onbehalfOfName}
                </Text>
              </View>
            </View>
            {onBehalfOfTravelSummary.length > 0 ? (
              <View>
                <OnBehalfOfTravelSummaryCard
                  scroll={() => {
                    setPageNo(pageNo + 1);
                  }}
                  data={onBehalfOfTravelSummary}
                  from="on_behalf_of"
                />
              </View>
            ) : (
              <Text style={styles.noDataFoundText}>No data found</Text>
            )}
          </View>
        )}

        {travelNoDialogStatus && (
          <SearchFilterDialog
            Clear={Clear}
            dialogStatus={travelNoDialogStatus}
            close={() => {
              setTravelNoDialogStatus(!travelNoDialogStatus);
            }}
            confirmFilter={() => {
              setPagination(true);
              setProgressBar(true);
              setOnBehalfOfTravelSummary([]);
              setFilstatus(
                Math.floor(Math.random() * 100) +
                  1 +
                  "" +
                  Math.floor(Math.random() * 100) +
                  1
              );
              setPageNo(1);
              setTravelNoDialogStatus(!travelNoDialogStatus);
            }}
            travelNo={travelNo}
            setTravelNo={setTravelNo}
            reqDate={reqDate}
            setReqDate={onDateChange}
            pickerStatus={pickerStatus}
            setPickerStatus={() => setPickerStatus(!pickerStatus)}
          ></SearchFilterDialog>
        )}

        {empSearchDialogStatus && (
          <SearchDialog
            dialogstatus={empSearchDialogStatus}
            setdialogstatus={setEmpSearchDialogStatus}
            from="OnBehalfOfEmp"
            setValue={(name) => {
              setOnbehalfOfName(name);
            }}
            setId={(id) => {
              setOnbehalfOfId(id);
              setPagination(true);
              setProgressBar(true);
              setOnBehalfOfTravelSummary([]);
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
        )}

        <Picker
          id="onBehalfOfSummaryFilter"
          data={filterList}
          searchable={false}
          label="Which list you want?"
          placeholderTextColor="#A2A2A2"
          setSelected={(value) => {
            setPagination(true);
            setProgressBar(true);
            setOnBehalfOfTravelSummary([]);
            if (value.id != 1) {
              setFilterStatus(value.id);
            } else {
              setFilterStatus(2);
            }
            setStatus(value.name);

            if (value.id == 1) {
              setOnbehalfOfId(0);
              setStatus("Pending List");
            }

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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noDataFoundText: {
    marginTop: "50%",
    fontSize: 15,
    textAlign: "center",
    height: "100%",
    height: "100%",
    color: CustomColors.primary_gray,
  },
  screenContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
  safeAreaViewContainer: {
    flex: 1,
    height: "100%",
    height: "100%",
    backgroundColor: CustomColors.screen_background_gray,
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
