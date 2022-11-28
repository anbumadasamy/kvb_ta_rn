import { useEffect, useState, useContext } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { View, StyleSheet, Text, Image } from "react-native";
import { Picker } from "react-native-actions-sheet-picker";
import MemberApprovalSummaryCard from "../../components/cards/MemberApprovalSummaryCard";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import TourNoDateFilter from "../../components/dialog/TourNoDatefilter";
import moment from "moment";
import OnbehalfDialog from "../../components/dialog/Onbehalfof_Dialog";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

export default function MemberApproval({
  from,
  previous,
  dialogstatus,
  setdialogstatus,
  onbehalfdialogstatus,
  setonbehalfdialogstatus,
}) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [selected, setSelected] = useState(undefined);
  const isFocused = useIsFocused();
  const [count, setcount] = useState(1);
  const [getstatus, setstatus] = useState(2);
  const [hasnext, setHasnext] = useState(true);
  const [filtercall, setfiltercall] = useState(false);
  const [tourno, settourno] = useState("");
  const [date, setdate] = useState("");
  const [datepicker, setdatepicker] = useState(false);
  const [onbehalfof, setonbehalfof] = useState(false);
  const [self, setself] = useState(true);
  const [onbehalfofemployyeid, setonbehalfofemployeeid] = useState("");
  const [employyename, setemployeename] = useState("");
  const [jsondate, setjsondate] = useState("");
  const [getmemberapprovalsummary, setmemberapprovalsummary] = useState([]);
  const [actions, setactions] = useState([]);
  const [changed, setchanged] = useState(false);
  const [fromprevious, setfromprevious] = useState(false);
  const [progressBar, setProgressBar] = useState(true);
  const [listname, setlistname] = useState("Pending List");

  function dialogstatusmethod() {
    setdialogstatus(!dialogstatus);
    if (tourno != "" || date != "") {
      setcount(1);
      setmemberapprovalsummary([]);
      setProgressBar(true);
      setHasnext(true);
      setfiltercall(true);
    }
  }
  function onbehalfstatusmethod() {
    setonbehalfdialogstatus(!onbehalfdialogstatus);
    setHasnext(true);
    setmemberapprovalsummary([]);
    setProgressBar(true);
    setcount(1);
  }

  function close() {
    setdialogstatus(!dialogstatus);
    settourno("");
    setdate("");
    setjsondate("");
  }
  function sweep() {
    settourno("");
    setdate("");
    setjsondate("");
  }
  function closeonbehalfofdialog() {
    setonbehalfdialogstatus(!onbehalfdialogstatus);
    setonbehalfofemployeeid("");
    setemployeename("");
    setself(true);
  }

  useEffect(() => {
    if (from == "MemberApprovalTabScreen") {
      setfromprevious(!fromprevious);
      setmemberapprovalsummary([]);
      setProgressBar(true);
      setcount(1);
      setstatus(2);
      settourno("");
      setdate("");
      setHasnext(true);
    }
  }, [from, previous]);

  useEffect(() => {
    if (selected != null) {
      settourno("");
      setjsondate("");
      setdate("");
      if (selected.position != 1 && selected.position != 7) {
        setcount(1);
        setmemberapprovalsummary([]);
        setProgressBar(true);
        setHasnext(true);
        setfiltercall(false);
      }
      switch (selected.position) {
        case 1:
          setdialogstatus(!dialogstatus);
          break;
        case 2:
          setstatus(4);
          break;
        case 3:
          setstatus(3);
          break;
        case 4:
          setstatus(5);
          break;
        case 5:
          setstatus(2);
          break;
        case 6:
          setstatus(-1);
          break;
        case 7:
          setonbehalfdialogstatus(!onbehalfdialogstatus);
          break;
      }
    }
  }, [selected]);

  useEffect(() => {
    if (hasnext) {
      getmemberapproval();
    }
  }, [
    count,
    getstatus,
    filtercall,
    fromprevious,
    hasnext,
    onbehalfofemployyeid,
  ]);

  useEffect(() => {
    let obj;

    if (onbehalfof) {
      obj = [
        {
          name: "Pending List",
          position: 5,
        },
        {
          name: "Approved List",
          position: 3,
        },
        {
          name: "Return List",
          position: 4,
        },
        {
          name: "Rejected List",
          position: 2,
        },
      ];
    } else {
      obj = [
        {
          name: "Pending List",
          position: 5,
        },
        {
          name: "Approved List",
          position: 3,
        },
        {
          name: "Return List",
          position: 4,
        },
        {
          name: "Rejected List",
          position: 2,
        },
      ];
    }
    setactions(obj);
  }, [onbehalfof]);

  function setrequireddatemethod(selectedDate) {
    setdatepicker(false);
    setjsondate(moment(selectedDate).format("DD-MMM-YYYY"));
    setdate(moment(selectedDate).format("DD-MM-YYYY"));
  }
  async function getmemberapproval() {
    let memberapprovalsummary = [];
    let Url;

    try {
      if (onbehalfofemployyeid != "") {
        Url =
          URL.APPROVAL_SUMMARY +
          "?status=" +
          getstatus +
          "&page=" +
          count +
          "&request_date=" +
          jsondate +
          "&tour_no=" +
          tourno +
          "&onbehalf=" +
          onbehalfofemployyeid;
      } else {
        Url =
          URL.APPROVAL_SUMMARY +
          "?status=" +
          getstatus +
          "&page=" +
          count +
          "&request_date=" +
          jsondate +
          "&tour_no=" +
          tourno;
      }

      const response = await fetch(Url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      const json = await response.json();

      console.log(JSON.stringify(json) + "Member Approval Data");

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      } else {
        for (let i = 0; i < json.data.length; i++) {
          const obj = {
            id: json.data[i].tourid,
            approverid: json.data[i].id,
            requestdate: json.data[i].requestdate,
            startdate: json.data[i].startdate,
            enddate: json.data[i].enddate,
            approvedby: json.data[i].approvedby,
            reason: json.data[i].reason,
            empdesignation: json.data[i].empdesignation,
            claim_status: json.data[i].claim_status,
            claim_status_id: json.data[i].claim_status_id,
            employee_name: json.data[i].employee_name,
            appgid: json.data[i].id,
            onbehalfid: onbehalfofemployyeid,
            previous: previous,
            approver: json.data[i].approvedby,
          };
          memberapprovalsummary.push(obj);
        }

        setmemberapprovalsummary([
          ...getmemberapprovalsummary,
          ...memberapprovalsummary,
        ]);
      }
      setProgressBar(false);

      if (json.pagination) {
        setHasnext(json.pagination.has_next);
      } else {
        setHasnext(false);
      }
      if (getmemberapprovalsummary.length == 0) {
        setfiltercall(false);
      }
    } catch (error) {
      setProgressBar(false);
    } finally {
    }
  }

  /* async function Ceoteamcheck() {
    try {
      const response = await fetch(URL.CEO_TEAMCHECK, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      const json = await response.json();
      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      } else {
        setonbehalfof(json.onbehalf);
      }
    } catch (error) {
    } finally {
    }
  } */

  useEffect(() => {
    if (isFocused) {
      authCtx.currentReimbursementType("MEMBERAPPROVAL");
    }
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      title: "RM Approval",
    });
    // Ceoteamcheck();
  });
  return (
    <View style={styles.safeAreaView}>
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
            <View style={{ paddingBottom: 50 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={styles.statusContainer}>
                  <Text style={styles.statusText}>{listname}</Text>
                </View>
                {onbehalfdialogstatus != null && !self && (
                  <View style={styles.onBehalfofNameContainer}>
                    <Text
                      multiline={false}
                      numberOfLines={1}
                      style={styles.onBehalfofNameText}
                    >
                      On Behalf Of: {employyename}
                    </Text>
                  </View>
                )}
              </View>

              {getmemberapprovalsummary.length > 0 ? (
                <MemberApprovalSummaryCard
                  data={getmemberapprovalsummary}
                  scroll={() => {
                    setcount(count + 1);
                  }}
                />
              ) : (
                <Text style={styles.noDataFoundText}>No data found</Text>
              )}
            </View>

            {dialogstatus && (
              <TourNoDateFilter
                dialogstatus={dialogstatus}
                clicked={dialogstatusmethod}
                tourno={(value) => {
                  settourno(value);
                }}
                requireddate={setrequireddatemethod}
                close={close}
                number={tourno}
                setrequireddate={date}
                pickerstatus={datepicker}
                setpicker={setdatepicker}
                sweep={() => {
                  sweep();
                }}
              ></TourNoDateFilter>
            )}
            {onbehalfdialogstatus && (
              <OnbehalfDialog
                dialogstatus={onbehalfdialogstatus}
                clicked={onbehalfstatusmethod}
                setself={setself}
                self={self}
                employyeid={onbehalfofemployyeid}
                setemployeeid={setonbehalfofemployeeid}
                employee_name={employyename}
                setemployeename={setemployeename}
                close={closeonbehalfofdialog}
              ></OnbehalfDialog>
            )}
            <Picker
              id="memberapprovallist"
              data={actions}
              // inputValue={query}
              searchable={false}
              label="Which list you want ?"
              setSelected={(select) => {
                // setSelected(selected);

                if (selected != null) {
                  if (select.position != selected.position) {
                    setSelected(select);
                    setlistname(select.name);
                  } else {
                    if (select.position == 1) {
                      setdialogstatus(!dialogstatus);
                    } else if (select.position == 7) {
                      setonbehalfdialogstatus(!onbehalfdialogstatus);
                    }
                  }
                } else {
                  if (select.position != 5) {
                    setSelected(select);
                    setlistname(select.name);
                  }
                }
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noDataFoundText: {
    marginTop: 50,
    fontSize: 14,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  maincontainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
  safeAreaView: {
    flex: 1,
  },
  statusContainer: {
    marginBottom: 8,
    width: "28%",
    alignContent: "center",
    borderRadius: 5,
  },
  onBehalfofNameContainer: {
    marginBottom: 8,
    width: "70%",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    marginRight: 5,
    padding: 2,
    color: CustomColors.primary_dark,
    fontWeight: "bold",
  },
  onBehalfofNameText: {
    fontSize: 12,
    padding: 2,
    marginLeft: 5,
    color: CustomColors.primary_dark,
    alignSelf: "flex-end",
  },
});
