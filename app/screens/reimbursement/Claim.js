import { useEffect, useState, useContext, useRef } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { View, StyleSheet, Text, Image } from "react-native";
import { Picker } from "react-native-actions-sheet-picker";
import ReimbursementSummaryCard from "../../components/cards/ReimbursementSummaryCard";
import TourNoDateFilter from "../../components/dialog/TourNoDatefilter";
import SearchDialog from "../../components/dialog/SearchDialog";
import { CustomColors } from "../../utilities/CustomColors";
import moment from "moment";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";
import OnbehalfDialog from "../../components/dialog/Onbehalfof_Dialog";

export default function Claim({
  from,
  previous,
  dialogstatus,
  setdialogstatus,
  onBehalfofDialogstatus,
  setOnbehalfOfDialogstatus,
}) {
  const [selected, setSelected] = useState(null);
  const [count, setcount] = useState(1);
  const [getstatus, setstatus] = useState("");
  const [hasnext, setHasnext] = useState(true);
  const [tourno, settourno] = useState("");
  const [date, setdate] = useState("");
  const [progressBar, setProgressBar] = useState(true);
  const [datepicker, setdatepicker] = useState(false);
  const [jsondate, setjsondate] = useState("");
  const [getclaimsummary, setclaimsummary] = useState([]);
  const [filtercall, setfiltercall] = useState(false);
  const [onbehalfOfName, setOnbehalfOfName] = useState("");
  const [listname, setlistname] = useState("All");
  const [onbehalfOfId, setOnbehalfOfId] = useState(0);
  const [fromprevious, setfromprevious] = useState(false);
  const [self, setself] = useState(true);
  const [onbehalfofemployyeid, setonbehalfofemployeeid] = useState("");
  const [employyename, setemployeename] = useState("");
  const [onbehalfofbranchid, setonbehalfofbranchid] = useState("");
  const [branchname, setbranchname] = useState("");

  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  console.log(onbehalfofemployyeid+" onbehalfofemployyeid Name")

  useEffect(() => {
    if (from == "Expense Submit" || from == "backfromOnbehalf") {
      setfromprevious(!fromprevious);
      setclaimsummary([]);
      setProgressBar(true);
      setcount(1);
      setlistname("All");
      setstatus("");
      settourno("");
      setSelected(null);
      setdate("");
      setHasnext(true);
    }
  }, [from, previous]);

  function dialogstatusmethod() {
    setdialogstatus(!dialogstatus);
    if (tourno != "" || date != "") {
      setcount(1);
      setclaimsummary([]);
      setHasnext(true);
      setfiltercall(!filtercall);
      setProgressBar(true);
    }
  }
  function sweep() {
    settourno("");
    setdate("");
    setjsondate("");
  }
  function close() {
    setdialogstatus(!dialogstatus);
    settourno("");
    setdate("");
    setjsondate("");
  }

  useEffect(() => {
    if (hasnext) {
      console.log("here Called")
      getclaim();
    }
  }, [count, getstatus, filtercall, fromprevious, onbehalfofemployyeid,hasnext]);

  function clearmethod() {
    setcount(1);
    setclaimsummary([]);
    setProgressBar(true);
    setHasnext(true);
  }
  function onbehalfstatusmethod() {
    setOnbehalfOfDialogstatus(!onBehalfofDialogstatus);
    setHasnext(true);
    setclaimsummary([]);
    setProgressBar(true);
    setcount(1);
  }
  function closeonbehalfofdialog() {
    setOnbehalfOfDialogstatus(!onBehalfofDialogstatus);
    setonbehalfofemployeeid("");
    setemployeename("");
    setself(true);
  }

  useEffect(() => {
    if (selected != null) {
      settourno("");
      setjsondate("");
      setdate("");
      if (selected.position != 1 && selected.position != 9) {
        setcount(1);
        setclaimsummary([]);
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
          setstatus(1);
          break;
        case 5:
          setstatus(2);
          break;
        case 6:
          setstatus(-1);
          break;
        case 7:
          setstatus("");
          setOnbehalfOfId("");
          setOnbehalfOfName("");
          setonbehalfofbranchid("")
          setbranchname("");
          break;
        case 8:
          setstatus(5);
          break;
        case 9:
          setOnbehalfOfDialogstatus(!onBehalfofDialogstatus);
          break;
      }
    }
  }, [selected]);

  function setrequireddatemethod(selectedDate) {
    setdatepicker(false);
    setjsondate(moment(selectedDate).format("DD-MMM-YYYY"));
    setdate(moment(selectedDate).format("DD-MM-YYYY"));
  }

  let actions = [
    {
      name: "All",
      position: 7,
    },
    {
      name: "Expense List",
      position: 6,
    },
    {
      name: "Requested List",
      position: 4,
    },
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
      position: 8,
    },
    {
      name: "Rejected List",
      position: 2,
    },
  ];

  async function getclaim() {
    let claimsummaryarray = [];
    let Url;

    // if (from == "On Behalf Of" || from == "backfromOnbehalf") {
     if (onbehalfofemployyeid != "") {
      if (getstatus != "") {
        Url =
          URL.CLAIM_MAKER_SUMMARY +
          "?page=" +
          count +
          "&status=" +
          getstatus +
          "&onbehalf=" +
          onbehalfofemployyeid +
          "&request_date=" +
          jsondate +
          "&tour_no=" +
          tourno;
      } else {
        Url =
          URL.CLAIM_MAKER_SUMMARY +
          "?page=" +
          count +
          "&onbehalf=" +
          onbehalfofemployyeid +
          "&request_date=" +
          jsondate +
          "&tour_no=" +
          tourno;
      }
    } else {
      if (getstatus != "") {
        Url =
          URL.CLAIM_MAKER_SUMMARY +
          "?page=" +
          count +
          "&status=" +
          getstatus +
          "&request_date=" +
          jsondate +
          "&tour_no=" +
          tourno;
      } else {
        Url =
          URL.CLAIM_MAKER_SUMMARY +
          "?page=" +
          count +
          "&request_date=" +
          jsondate +
          "&tour_no=" +
          tourno;
      }
    }
    console.log(Url+" Claim Summarry Url")

    try {
      const response = await fetch(Url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      console.log(JSON.stringify(json) + "JSON Data");
      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        return;
        }
      }
      
      
        for (let i = 0; i < json.data.length; i++) {
          const obj = {
            id: json.data[i].id,
            requestdate: json.data[i].requestdate,
            is_tour_started: json.data[i].is_tour_started,
            max_applevel: json.data[i].max_applevel,
            claim_status_id: json.data[i].claim_status_id,
            date_relaxation: json.data[i].date_relaxation,
            claim_status: json.data[i].claim_status,
            employee_name: json.data[i].employee_name,
            previous: previous,
            empid: json.data[i].empgid,
            from: from,
          };

          if ("reason" in json.data[i]) {
            obj["reason"] = json.data[i].reason;
          }
          if ("reason_id" in json.data[i]) {
            obj["reason_id"] = json.data[i].reason_id;
          }
          if ("startdate" in json.data[i]) {
            obj["startdate"] = json.data[i].startdate;
          }
          if ("enddate" in json.data[i]) {
            obj["enddate"] = json.data[i].enddate;
          }
          if ("approvedby" in json.data[i]) {
            obj["approvedby"] = json.data[i].approvedby;
          }
          if ("permit_bycode" in json.data[i]) {
            obj["permit_bycode"] = json.data[i].permit_bycode;
          }
          if(onbehalfofemployyeid != ""){
            obj["onbehalf"] = true;
          }
          else{
            obj["onbehalf"] = false;
          }
          claimsummaryarray.push(obj);
        }

        setclaimsummary([...getclaimsummary, ...claimsummaryarray]);
       setProgressBar(false);

      if (json.pagination) {
        setHasnext(json.pagination.has_next);
      } else {
        setHasnext(false);
      }
      if (getclaimsummary.length == 0) {
        setfiltercall(false);
      }
    } catch (error) {
      setProgressBar(false);
    } finally {
    }
  }

  useEffect(() => {
    navigation.setOptions({
      title: "Claim",
    });
  });

  useEffect(() => {
    if (isFocused) {
      authCtx.currentReimbursementType("CLAIM");
      authCtx.SetMakerSummaryType("CLAIM");
    }
  }, [isFocused]);

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
              {
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{listname}</Text>
                  </View>
                  {onbehalfOfName !="" && (
                    <View style={styles.onBehalfofNameContainer}>
                      <Text
                        multiline={false}
                        numberOfLines={1}
                        style={styles.onBehalfofNameText}
                      >
                        On Behalf Of: {onbehalfOfName}
                      </Text>
                    </View>
                  )}
                </View>
              }

              {getclaimsummary.length > 0 ? (
                <ReimbursementSummaryCard
                  scroll={() => {
                    setcount(count + 1);
                  }}
                  data={getclaimsummary}
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
            {onBehalfofDialogstatus && (
                <OnbehalfDialog
                  dialogstatus={onBehalfofDialogstatus}
                  clicked={onbehalfstatusmethod}
                  setself={setself}
                  self={self}
                  employyeid={onbehalfofemployyeid}
                  branchname={branchname}
                  setbranchname={setbranchname}
                  onbehalfofbranchid={onbehalfOfId}
                  setonbehalfofbranchid={setOnbehalfOfId}
                  setemployeeid={setonbehalfofemployeeid}
                  employee_name={onbehalfOfName}
                  setemployeename={setOnbehalfOfName}
                  close={closeonbehalfofdialog}
                ></OnbehalfDialog>
               
            )}
              {/* <SearchDialog
                dialogstatus={onBehalfofDialogstatus}
                setdialogstatus={setOnbehalfOfDialogstatus}
                from="OnBehalfOfEmpclaim"
                setValue={(name) => {
                  setOnbehalfOfName(name);
                }}
                setId={(id) => {
                  setOnbehalfOfId(id);
                }}
                apicall={clearmethod}
              /> */}

            <Picker
              id="travelclaimlist"
              data={actions}
              searchable={false}
              label="Which list you want ?"
              setSelected={(select) => {
                if (selected != null) {
                  if (select.position != selected.position) {
                    setSelected(select);
                    setlistname(select.name);
                  } else {
                    if (select.position == 1) {
                      setdialogstatus(!dialogstatus);
                    } else if (select.position == 9) {
                      setOnbehalfOfDialogstatus(!onBehalfofDialogstatus);
                    } else if (
                      from == "On Behalf Of" ||
                      from == "backfromOnbehalf"
                    ) {
                      if (select.position == 7) {
                        setOnbehalfOfId("0");
                        setOnbehalfOfName("All");
                        setHasnext(true);
                        setcount(1);
                        setclaimsummary([]);
                        setProgressBar(true);
                      }
                    }
                  }
                } else {
                  if (select.position != 7) {
                    setSelected(select);
                    setlistname(select.name);
                  } else {
                    if (onbehalfOfId != "") {
                      setOnbehalfOfId("");
                      setOnbehalfOfName("");
                      setbranchname("");
                      setonbehalfofbranchid("");
                      setHasnext(true);
                      setcount(1);
                      setclaimsummary([]);
                      setProgressBar(true);
                    }
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
