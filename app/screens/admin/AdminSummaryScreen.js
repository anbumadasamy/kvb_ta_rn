import { useEffect, useState, useContext, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import TravelSummaryCard from "../../components/cards/TravelSummaryCard";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import { View, StyleSheet, Text, LogBox, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import AdminFilterDialog from "../../components/dialog/AdminFilterDialog";
import moment from "moment";

let status = 2;
let adminSummaryListArray = [];

export default function AdminSummaryScreen() {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [filter, setFilter] = useState(false);
  const [adminSummary, setAdminSummary] = useState([]);
  const [filterDialog, setFilterDialog] = useState(false);
  const [pagination, setPagination] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [progressBar, setProgressBar] = useState(true);
  const [filterData, setFilterData] = useState({
    travelNo: "",
    requirementCode: "",
    requestedDate: "",
    requirements: "101",
    employeeCode: "",
    employeeName: "",
    empoloyeeBranch: "",
    bookingStatus: -5,
    travelStatus: "Travel_3",
  });

  function changedHandlerFilter(inputIdentifier, enteredValue) {
    setFilterData((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginRight: 20 }}>
              <MaterialIcons
                name="refresh"
                size={24}
                color="white"
                onPress={() => {
                  if (filter) {
                    setAdminSummary([]);
                    setPagination(true);
                    setFilter(false);
                    setPageNo(1);
                  }
                }}
              />
            </View>
            <View>
              <MaterialIcons
                name="filter-list"
                size={24}
                color="white"
                onPress={() => setFilterDialog(true)}
              />
            </View>
          </View>
        );
      },
    });
  });

  useEffect(() => {
    navigation.setOptions({
      title: "Admin Summary",
    });
    LogBox.ignoreLogs([
      "Deprecation warning: value provided is not in a recognized RFC2822 or ISO format",
    ]);
  });

  useEffect(() => {
    if (pagination) {
      adminSummaryListArray = [];
      if (filter) {
        AdminSummaryFilter();
      } else {
        GetAdminSummary();
      }
    }
  }, [pageNo, filter]);

  async function GetAdminSummary() {
    try {
      const response = await fetch(
        URL.ADMIN_SUMMARY +
          "status=" +
          status +
          "&booking_type=0" +
          "&page=" +
          pageNo +
          "&type=Travel_3&booking_status=" +
          -5,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.auth_token,
          },
        }
      );

      let json = await response.json();

      setPagination(json.pagination.has_next);

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      for (let i = 0; i < json.data.length; i++) {
        const obj = {
          id: json.data[i].tourid,
          requestdate: moment(json.data[i].requestdate).format("DD-MM-YYYY"),
          startdate: moment(json.data[i].startdate).format("DD-MM-YYYY"),
          enddate: moment(json.data[i].enddate).format("DD-MM-YYYY"),
          tourStatusId: json.data[i].tour_status_id,
          approvedby: json.data[i].employee_name,
          reason: json.data[i].reason,
          cabStatusId: json.data[i].cab_status_id,
        };
        adminSummaryListArray.push(obj);
      }
      setAdminSummary([...adminSummary, ...adminSummaryListArray]);
      setProgressBar(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function AdminSummaryFilter() {
    let url;

    if (
      filterData.travelNo == "" &&
      filterData.employeeCode == "" &&
      filterData.employeeName == "" &&
      filterData.empoloyeeBranch == ""
    ) {
      url =
        "status=3" +
        "&page=" +
        parseInt(pageNo) +
        "&booking_status=" +
        parseInt(filterData.bookingStatus) +
        "&booking_type=" +
        parseInt(filterData.requirements) +
        "&type=" +
        filterData.travelStatus;
    } else if (filterData.travelNo != "") {
      url =
        "status=3" +
        "&page=" +
        parseInt(pageNo) +
        "&booking_status=" +
        parseInt(filterData.bookingStatus) +
        "&booking_type=" +
        parseInt(filterData.requirements) +
        "&type=" +
        filterData.travelStatus +
        "&tour_no=" +
        parseInt(filterData.travelNo);
    } else if (filterData.employeeName != "") {
      url =
        "status=3" +
        "&page=" +
        parseInt(pageNo) +
        "&booking_status=" +
        parseInt(filterData.bookingStatus) +
        "&booking_type=" +
        parseInt(filterData.requirements) +
        "&type=" +
        filterData.travelStatus +
        "&makerid=" +
        filterData.employeeName;
    } else if (filterData.employeeCode != "") {
      url =
        "status=3" +
        "&page=" +
        parseInt(pageNo) +
        "&booking_status=" +
        parseInt(filterData.bookingStatus) +
        "&booking_type=" +
        parseInt(filterData.requirements) +
        "&type=" +
        filterData.travelStatus +
        "&makerid=" +
        filterData.employeeCode;
    } else if (filterData.empoloyeeBranch != "") {
      url =
        "status=3" +
        "&page=" +
        parseInt(pageNo) +
        "&booking_status=" +
        parseInt(filterData.bookingStatus) +
        "&booking_type=" +
        parseInt(filterData.requirements) +
        "&type=" +
        filterData.travelStatus +
        "&branch_id=" +
        parseInt(filterData.empoloyeeBranch);
    }

    try {
      const response = await fetch(URL.ADMIN_SUMMARY + url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      if ("pagination" in json) {
        setPagination(json.pagination.has_next);
      }

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      for (let i = 0; i < json.data.length; i++) {
        const obj = {
          id: json.data[i].tourid,
          requestdate: moment(json.data[i].requestdate).format("DD-MM-YYYY"),
          startdate: moment(json.data[i].startdate).format("DD-MM-YYYY"),
          enddate: moment(json.data[i].enddate).format("DD-MM-YYYY"),
          tourStatusId: json.data[i].tour_status_id,
          approvedby: json.data[i].employee_name,
          reason: json.data[i].reason,
          cabStatusId: json.data[i].cab_status_id,
        };
        adminSummaryListArray.push(obj);
      }
      setAdminSummary([...adminSummary, ...adminSummaryListArray]);
      setProgressBar(false);
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
            {adminSummary.length > 0 ? (
              <View>
                <TravelSummaryCard
                  scroll={() => setPageNo(pageNo + 1)}
                  data={adminSummary}
                  from="admin_screen"
                />
                {filterDialog && (
                  <AdminFilterDialog
                    travelNo={filterData.travelNo}
                    requirementCode={filterData.requirementCode}
                    requirements={filterData.requirements}
                    requestedDate={filterData.requestedDate}
                    employeeCode={filterData.employeeCode}
                    employeeName={filterData.employeeName}
                    employeeBranch={filterData.empoloyeeBranch}
                    bookingStatus={filterData.bookingStatus}
                    travelStatus={filterData.travelStatus}
                    setTravelNo={changedHandlerFilter.bind(this, "travelNo")}
                    setRequirementCode={changedHandlerFilter.bind(
                      this,
                      "requirementCode"
                    )}
                    setRequirements={changedHandlerFilter.bind(
                      this,
                      "requirements"
                    )}
                    setRequestedDate={(value) => {
                      changedHandlerFilter("requestedDate", value);
                    }}
                    setEmployeeCode={changedHandlerFilter.bind(
                      this,
                      "employeeCode"
                    )}
                    setEmployeeName={changedHandlerFilter.bind(
                      this,
                      "employeeName"
                    )}
                    setEmployeeBranch={changedHandlerFilter.bind(
                      this,
                      "empoloyeeBranch"
                    )}
                    setBookingStatus={changedHandlerFilter.bind(
                      this,
                      "bookingStatus"
                    )}
                    setTravelStatus={changedHandlerFilter.bind(
                      this,
                      "travelStatus"
                    )}
                    filterDialogStatus={filterDialog}
                    filterSubmit={() => {
                      setProgressBar(true);
                      setFilterDialog(false);
                      setFilter(true);
                      setPageNo(1);
                      setAdminSummary([]);
                    }}
                  />
                )}
              </View>
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
