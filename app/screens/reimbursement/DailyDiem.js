import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  Platform,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import Dateview from "../../components/ui/Dateview";
import SubmitButton from "../../components/ui/SubmitButton";
import InputNumberrow from "../../components/ui/InputNumberrow";
import CustomizedRadioButton from "../../components/ui/CustomizedRadiobutton";
import DropDown from "../../components/ui/DropDown";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import SearchDialog from "../../components/dialog/SearchDialog";
import { CustomColors } from "../../utilities/CustomColors";
import moment from "moment";
import LabelTextColumnView from "../../components/ui/LabelTextColumnView";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";
import DateTimeSelector from "../../components/ui/DateTimeSelector";

export default function DailyDiem({ route }) {
  const TourId = route.params.TourId;
  const ReqDate = route.params.ReqDate;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  let DailyDiemId = route.params.DailyDiemId;
  console.log(DailyDiemId+" DailyDiemId")
  let customid = route.params.customid;
  // let list = route.params.Data;
  let jsonobject;
  let obj;
  let eligible;
  const [boarding, setboarding] = useState(false);
  const [accomodation, setaccomodation] = useState(false);
  const [declaration, setdeclaration] = useState(false);
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [citydialogstatus, setcitydialogstatus] = useState(false);
  const [claimamount, setclaimamount] = useState("");
  const [eligibleamount, seteligibleamount] = useState("");
  const [dailydiemdatems, setdailydiemdatems] = useState("");
  const [dailydiemtodatems, setdailydiemtodatems] = useState("");
  const [checkingTimeStatus, setcheckingTimeStatus] = useState(false);
  const [checkoutTimeStatus, setcheckoutTimeStatus] = useState(false);
  const [noofhour, setnoofhour] = useState("");
  const [enternoofhour, setenternoofhour] = useState();
  const [checkingTime, setCheckingTime] = useState("");
  const [checkoutTime, setcheckoutTime] = useState("");
  const [checkingDate, setCheckingDate] = useState("");
  const [checkoutDate, setcheckoutDate] = useState("");
  const [checkingdateStatus, setcheckingDateStatus] = useState(false);
  const [checkoutDateStatus, setcheckoutDateStatus] = useState(false);
  const [requestercomment, setrequestercomment] = useState("");
  const [progressBar, setProgressBar] = useState(true);
  const [editable, seteditable] = useState(true);
  const [city, setcity] = useState("");
  const [tourgrade, settourgrade] = useState("");
  const [leavedays, setleavedays] = useState("");
  const [nooghourseditable, setnoofhourseditable] = useState(false);
  const [first, setfirst] = useState(true);

  const onPressboarding = (radioButtonsArray) => {
    setboarding(radioButtonsArray[0].selected);
  };
  const onPressaccomodation = (radioButtonsArray) => {
    setaccomodation(radioButtonsArray[0].selected);
  };
  const onPressdeclaration = (radioButtonsArray) => {
    setdeclaration(radioButtonsArray[0].selected);
  };

  useEffect(() => {
    navigation.setOptions({
      title: "Daily Diem",
    });
    getdata();
    getTourGrade();
  }, []);

  useEffect(() => {
    if (route.params.from == "Approver") {
      seteditable(false);
    } else {
      seteditable(true);
    }
  }, [route]);

  /*  useEffect(() => {
    if (parseInt(eligibleamount) < parseInt(claimamount)) {
      setremarkslabel("Remarks* :");
      if (!first) {
        Alert.alert(
          "You are exceeding the eligible amount. Please enter a valid remarks"
        );
      }
    } else {
      setremarkslabel("Remarks:");
    }
  }, [first, claimamount, eligibleamount]); */

  /*  useEffect(() => {
    if (checkoutTimeformat != "" && checkingTimeformat != "") {
      
      timedifference();
    }
  }, [checkoutTimeformat, noofhour]); */

  useEffect(() => {
    // return () => {
      
     
    if (!first) {
      if (
        city != "" &&
        checkoutTime != "" &&
        checkingTime != "" &&
        checkingDate != "" &&
        checkoutDate != ""
      ) {
        console.log("Inga Vanthutten")
        EligibleAmountCalculation();
      }
    } /* else {
      setfirst(false);
    } */
    console.log("Eligible Calculation");
    // };
  }, [
    checkingTime,
    checkoutTime,
    city,
    boarding,
    checkingDate,
    checkoutDate,
    accomodation,
    declaration,
    first,
  ]);
  /* 
  function eligibleamountvalidation() {
    if (
      city != "" &&
      checkoutTime != "" &&
      checkingTime != "" &&
      checkingDate != "" &&
      checkoutDate != ""
    ) {
      EligibleAmountCalculation();
    }
  } */

  async function EligibleAmountCalculation() {
    eligible = {
      city: city,
      fromdate:
        moment(dailydiemdatems).format("YYYY-MM-DD") +
        " " +
        checkingTime +
        ":00",
      todate:
        moment(dailydiemtodatems).format("YYYY-MM-DD") +
        " " +
        checkoutTime +
        ":00",
      tourgid: TourId,
      isleave: 0,
      // expensegid: 2,
    };

    if (boarding) {
      eligible["boardingbybank"] = 1;
    } else {
      eligible["boardingbybank"] = 0;
    }
    if (accomodation) {
      eligible["accbybank"] = 1;
    } else {
      eligible["accbybank"] = 0;
    }
    if (declaration) {
      eligible["declaration"] = 1;
    } else {
      eligible["declaration"] = 0;
    }

    console.log(JSON.stringify(eligible)+" Eligible")
    console.log(JSON.stringify(URL.DAILY_DIEM_ElIGIBLE)+" Eligible")

    try {
      const response = await fetch(URL.DAILY_DIEM_ElIGIBLE, {
        method: "POST",
        body: JSON.stringify(eligible),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      console.log(JSON.stringify(response) + " response.status");
      let json = await response.json();

      console.log(JSON.stringify(json) + " Eligible Amount Data");
      if ("detail" in json) {
        if (json.detail == "Invalid credentials/token.") {
          AlertCredentialError(json.detail, navigation);
          return;
        }
      }

      seteligibleamount(json.Eligible_amount + "");
      setnoofhour(json.sys_hours + "");
      // setenternoofhour("");
    } catch (error) {}
  }

  async function getTourGrade() {
    try {
      const response = await fetch(URL.TOUR_GRADE + route.params.TourId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      console.log(JSON.stringify(json) + " Tour Grade");

      if(response.status ==403){
        AlertCredentialError(json.detail, navigation);
        return;
      }
     
      settourgrade(json.employee_grade);
    } catch (error) {}
  }

  async function getdata() {
    try {
      let subcategoryarray = [];
      const response = await fetch(URL.COMMON_DROPDOWN + "dailydiem", {
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
      } else {
        for (let i = 0; i < json.length; i++) {
          const obj = {
            id: json[i].value,
            name: json[i].name,
          };
          subcategoryarray.push(obj);
        }
        setsubcategorydata(subcategoryarray);
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (DailyDiemId != "") {
      get();
    } else {
      // setremarks(route.params.Remarks);
      // setdailydiemdate(route.params.Date);
      // setdailydiemdatems(route.params.customid);
      setrequestercomment(route.params.Comments);
      setProgressBar(false);
    }
  }, [DailyDiemId]);

  function validation() {
    if (checkingDate == "") {
      Alert.alert("Enter From Date");
      return;
    }
    if (checkoutDate == "") {
      Alert.alert("Enter To Date");
      return;
    }
    if (checkingTime == "") {
      Alert.alert("Enter From Time");
      return;
    }
    if (checkoutTime == "") {
      Alert.alert("Enter To Time");
      return;
    }
    if (enternoofhour == "") {
      Alert.alert("Enter No of Hour");
      return;
    }
    /*  if (leavedays == "") {
      Alert.alert("Enter Leave Days");
      return;
    } */
    if (city == "") {
      Alert.alert("Choose City");
      return;
    }
    if (claimamount == "") {
      Alert.alert("Claim Amount Can't be empty");
      return;
    }

    DailyDiemExpensePost();
  }

  function DailyDiemExpensePost() {
    obj = {
      tourgid: TourId,
      expenseid: 2,
      fromdate:
        moment(dailydiemdatems).format("YYYY-MM-DD") +
        " " +
        checkingTime +
        ":00",
      todate:
        moment(dailydiemtodatems).format("YYYY-MM-DD") +
        " " +
        checkoutTime +
        ":00",
      syshours: noofhour,
      noofhours: enternoofhour,
      city: city,
      mobile: 1,
      isleave: 0,
      requestercomment: requestercomment,
    };

    if (claimamount != "") {
      obj["claimedamount"] = parseInt(claimamount);
    } else {
      obj["claimedamount"] = 0;
    }

    if (boarding) {
      obj["boardingbybank"] = 1;
    } else {
      obj["boardingbybank"] = 0;
    }
    if (accomodation) {
      obj["accbybank"] = 1;
    } else {
      obj["accbybank"] = 0;
    }
    if (declaration) {
      obj["declaration"] = 1;
    } else {
      obj["declaration"] = 0;
    }

    if (DailyDiemId != "") {
      obj["id"] = DailyDiemId;
      jsonobject = JSON.stringify({
        data: [obj],
      });
    } else {
      jsonobject = JSON.stringify({
        data: [obj],
      });
    }
    APICall();
  }
  async function APICall() {
    setProgressBar(true);
    try {
      const response = await fetch(URL.DAILY_DIEM, {
        method: "POST",
        body: jsonobject,
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      console.log(JSON.stringify(jsonobject) + " Daily Diem Object");

      if (json) {
        setProgressBar(false);
        if ("detail" in json) {
          if (json.detail == "Invalid credentials/token.") {
            AlertCredentialError(json.detail, navigation);
          }
        }
        if (json.message) {
          ToastMessage(json.message);
          // Alert.alert(json.message);
          navigation.goBack();
          navigation.goBack();
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      setProgressBar(false);
    }
  }

  async function get() {
    setProgressBar(true);
    try {
      const response = await fetch(URL.DAILY_DIEM + "/tour/" + TourId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();
      console.log(JSON.stringify(json) + " Daily Diem Data");
      /*   if ("detail" in json) {
        if (json.detail == "Invalid credentials/token.") {
          AlertCredentialError(json.detail, navigation);
          return;
        }
      }  */

      for (let i = 0; i < json.data.length; i++) {
        if (json.data[i].id == DailyDiemId) {
          let datewithtime = json.data[i].fromdate.split(" ");
          let uniqdate = datewithtime[0].split("-");
          let uniqtime = datewithtime[1];

          let outdatewithtime = json.data[i].todate.split(" ");
          let uniqoutdate = outdatewithtime[0].split("-");
          let uniqouttime = outdatewithtime[1];

          setCheckingDate(
            moment(
              new Date(
                uniqdate[1] +
                  " " +
                  uniqdate[2] +
                  ", " +
                  uniqdate[0] +
                  " " +
                  uniqtime +
                  ":00"
              )
            ).format("DD-MM-YYYY")
          );
          setcheckoutDate(
            moment(
              new Date(
                uniqoutdate[1] +
                  " " +
                  uniqoutdate[2] +
                  ", " +
                  uniqoutdate[0] +
                  " " +
                  uniqouttime +
                  ":00"
              )
            ).format("DD-MM-YYYY")
          );
          setdailydiemdatems(
            new Date(
              uniqdate[1] +
                " " +
                uniqdate[2] +
                ", " +
                uniqdate[0] +
                " " +
                uniqtime +
                ":00"
            )
          );
          setdailydiemtodatems(
            new Date(
              uniqoutdate[1] +
                " " +
                uniqoutdate[2] +
                ", " +
                uniqoutdate[0] +
                " " +
                uniqouttime +
                ":00"
            )
          );

          setCheckingTime(uniqtime);
          setcheckoutTime(uniqouttime);

          /*  setcheckingTimeformat(
              new Date(
                uniqdate[1] +
                  " " +
                  uniqdate[2] +
                  ", " +
                  uniqdate[0] +
                  " " +
                  uniqtime +
                  ":00"
              )
            );
            setcheckoutTimeformat(
              new Date(
                uniqoutdate[1] +
                  " " +
                  uniqoutdate[2] +
                  ", " +
                  uniqoutdate[0] +
                  " " +
                  uniqouttime +
                  ":00"
              )
            ); */

          setcity(json.data[i].city);
          setnoofhour(json.data[i].syshours + "");
          setenternoofhour(json.data[i].noofhours + "");
          setclaimamount(json.data[i].claimedamount + "");

          seteligibleamount(json.data[i].eligibleamount + "");
          setrequestercomment(json.requestercomment);

          if (json.data[i].boardingbybank.value == 1) {
            setboarding(true);
          } else {
            setboarding(false);
          }

          if (json.data[i].accbybank.value == 1) {
            setaccomodation(true);
          } else {
            setaccomodation(false);
          }

          if (json.data[i].declaration.value == 1) {
            setdeclaration(true);
          } else {
            setdeclaration(false);
          }
          if(editable){
            setnoofhourseditable(true)
          }

          setProgressBar(false);

          break;
        }
      }
    } catch (error) {
      setProgressBar(false);
    }
  }
  const onStartDate = (selectedDate) => {
    setcheckingDateStatus(false);
    setCheckingDate(moment(selectedDate).format("DD-MM-YYYY"));
    setdailydiemdatems(selectedDate);
  };

  const onEndDate = (selectedDate) => {
    setcheckoutDateStatus(false);
    setdailydiemtodatems(selectedDate);
    setcheckoutDate(moment(selectedDate).format("DD-MM-YYYY"));
  };

  const onStartTime = (selectedDate) => {
    setcheckingTimeStatus(false);

    setCheckingTime(moment(selectedDate).format("HH:mm"));
    setcheckoutTime("");
  };
  const onEndTime = (selectedDate) => {
    setcheckoutTimeStatus(false);
    setcheckoutTime(moment(selectedDate).format("HH:mm"));
    if (editable) {
      setnoofhourseditable(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset="35"
      style={styles.safeAreaView}
    >
      {progressBar ? (
        <View
          style={{
            flex: 1,
            backgroundColor: CustomColors.primary_white,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View>
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../../assets/icons/Progressbar.gif")}
            />
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}
        >
          <View style={styles.rowcontainer}>
            <View style={styles.rowcontainer}>
              <Text>Travel No : </Text>
              <Text>{TourId}</Text>
            </View>
            <Dateview date={ReqDate}></Dateview>
          </View>
          <DropDown
            label="City*"
            hint="City"
            indata={city}
            ontouch={() => {
              if (editable) {
                setcitydialogstatus(!citydialogstatus);
                setfirst(false);
              }
            }}
          ></DropDown>

          {citydialogstatus && (
            <SearchDialog
              dialogstatus={citydialogstatus}
              setValue={setcity}
              setdialogstatus={setcitydialogstatus}
              from="DailyDiemCitySearch"
              grade={tourgrade}
            />
          )}

          <DateTimeSelector
            inDate={checkingDate}
            inDateLabel={"From Date:* "}
            outDateLabel={"To Date:*"}
            inTimeLabel={"From Time:*"}
            outTimeLabel={"To Time:*"}
            inDateLabelhint={"From Date:"}
            outDateLabelhint={"To Date:"}
            inTimeLabelhint={"From Time:"}
            outTimeLabelhint={"To Time:"}
            outDate={checkoutDate}
            inTime={checkingTime}
            outTime={checkoutTime}
            inDateOnPress={() => {
              if (editable) {
                setcheckingDateStatus(!checkingdateStatus);
                setcheckoutDate("");
                setfirst(false)
              }
            }}
            outDateOnPress={() => {
              if (editable) {
                if (checkingDate != "") {
                  setcheckoutDateStatus(!checkoutDateStatus);
                  setfirst(false)
                } else {
                  Alert.alert("First Fill Start Date");
                }
              }
            }}
            inTimeOnPress={() => {
              if (editable) {
                setcheckingTimeStatus(!checkingTimeStatus);
                setfirst(false)
              }
            }}
            outTimeOnPress={() => {
              if (editable) {
                if (checkingTime != "") {
                  setcheckoutTimeStatus(!checkoutTimeStatus);
                  setfirst(false)
                } else {
                  Alert.alert("First Fill Start time");
                }
              }
            }}
          ></DateTimeSelector>
          <DateTimePickerModal
            isVisible={checkingdateStatus}
            mode="date"
            onConfirm={onStartDate}
            onCancel={() => {
              setcheckingDateStatus(false);
            }}
            display={Platform.OS == "ios" ? "inline" : "default"}
            maximumDate={new Date(ToDate)}
            minimumDate={new Date(FromDate)}
          />
          <DateTimePickerModal
            isVisible={checkoutDateStatus}
            mode="date"
            onConfirm={onEndDate}
            onCancel={() => {
              setcheckoutDateStatus(false);
            }}
            display={Platform.OS == "ios" ? "inline" : "default"}
            maximumDate={new Date(ToDate)}
            minimumDate={new Date(FromDate)}
          />

          <DateTimePickerModal
            isVisible={checkingTimeStatus}
            mode="time"
            locale="en_GB"
            date={new Date()}
            display={Platform.OS == "ios" ? "spinner" : "default"}
            is24Hour={true}
            minuteInterval={15}
            onConfirm={onStartTime}
            onCancel={() => {
              setcheckingTimeStatus(false);
            }}
          />
          <DateTimePickerModal
            isVisible={checkoutTimeStatus}
            mode="time"
            locale="en_GB"
            date={new Date()}
            display={Platform.OS == "ios" ? "spinner" : "default"}
            is24Hour={true}
            minuteInterval={15}
            onConfirm={onEndTime}
            onCancel={() => {
              setcheckoutTimeStatus(false);
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <View style={styles.inputTextContainerLeft}>
              <LabelTextColumnView
                label="No of Hours(System):"
                hint="System No of Hours"
                value={noofhour}
              ></LabelTextColumnView>
            </View>
            <View style={styles.inputTextContainerRight}>
              <InputNumberrow
                label="No of Hours :*"
                hint="No of Hours"
                value={enternoofhour}
                editable={nooghourseditable}
                onChangeEvent={(updated) => {
                  console.log(nooghourseditable + " no of hour editable");
                  if (noofhour != "") {
                    if (
                      parseFloat(noofhour.split(":")[0]) >= parseFloat(updated)
                    ) {
                      setenternoofhour(updated);
                    } else {
                      setenternoofhour("");
                    }
                  } else {
                    setenternoofhour("");
                  }
                }}
              ></InputNumberrow>
            </View>
          </View>
          {/*  <InputNumberrow
            label="No of Leave Days:*"
            hint="Leave Days"
            value={leavedays}
            editable={editable}
            onChangeEvent={(updated) => {
              setleavedays(updated);
            }}
          ></InputNumberrow> */}
          <LabelTextColumnView
            label="Eligible Amount:"
            hint=""
            value={eligibleamount}
          ></LabelTextColumnView>
          <InputNumberrow
            label="Claim Amount:*"
            hint=""
            value={claimamount}
            editable={editable}
            onChangeEvent={(updated) => {
              setclaimamount(updated);
            }}
          ></InputNumberrow>

          <CustomizedRadioButton
            label="Accommodation Provided by bank* :"
            status={accomodation}
            buttonpressed={onPressaccomodation}
          ></CustomizedRadioButton>
          <CustomizedRadioButton
            label="Boarding Provided by Organizer* :"
            status={boarding}
            buttonpressed={onPressboarding}
          ></CustomizedRadioButton>
          <CustomizedRadioButton
            label="Declaration for boarding submitted* :"
            status={declaration}
            buttonpressed={onPressdeclaration}
          ></CustomizedRadioButton>
        </ScrollView>
      )}

      {editable && !progressBar && (
        <View>
          <SubmitButton onPressEvent={validation}>Submit</SubmitButton>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    marginLeft: "4%",
    marginRight: "4%",
    marginBottom: "3%",
    marginTop: "3%",
  },
  rowcontainer: {
    flexDirection: "row",
    padding: 2,
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  container: {
    flex: 1,
  },
  inputTextContainerLeft: {
    flex: 1,
    flexDirection: "column",
    marginRight: 10,
  },
  inputTextContainerRight: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 10,
  },
});
