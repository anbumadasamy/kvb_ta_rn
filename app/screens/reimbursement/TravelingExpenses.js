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
import Inputtextrow from "../../components/ui/inputtextrow";
import Dateview from "../../components/ui/Dateview";
import SubmitButton from "../../components/ui/SubmitButton";
import InputNumberrow from "../../components/ui/InputNumberrow";
import CustomizedRadioButton from "../../components/ui/CustomizedRadiobutton";
import DropDown from "../../components/ui/DropDown";
import DropDownDialog from "../../components/dialog/DropDownDialog";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import DropDownDialogTravelingExpense from "../../components/dialog/DropDownDialogTravelingExpense";
import DateTimeSelector from "../../components/ui/DateTimeSelector";
import ReimbursementCommentBox from "../../components/ui/ReimbursementCommentBox";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

export default function TravelingExpenses({ route }) {
  const TourId = route.params.TourId;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  const ReqDate = route.params.ReqDate;
  let TravelingExpenseId = route.params.TravelingExpenseId;
  const [checkingDate, setCheckingDate] = useState("");
  const [checkoutDate, setcheckoutDate] = useState("");
  const [checkingTime, setCheckingTime] = useState("");
  const [checkoutTime, setcheckoutTime] = useState("");
  const [jsoncheckingDate, setjsonCheckingDate] = useState("");
  const [jsoncheckoutDate, setjsoncheckoutDate] = useState("");
  const [checkingdateStatus, setcheckingDateStatus] = useState(false);
  const [checkoutDateStatus, setcheckoutDateStatus] = useState(false);
  const [checkingTimeStatus, setcheckingTimeStatus] = useState(false);
  const [checkoutTimeStatus, setcheckoutTimeStatus] = useState(false);
  const [progressBar, setProgressBar] = useState(true);
  const [priority, setpriority] = useState(false);
  const [highermode, sethighermode] = useState(false);
  const [departureplace, setdepartureplace] = useState("");
  const [billno, setbillno] = useState("");
  const [claimamount, setclaimamount] = useState("");
  const [vendorname, setvendorname] = useState("");
  const [remarks, setremarks] = useState("");
  const [placeofvisit, setplaceofvisit] = useState("");
  const [traveltype, settraveltype] = useState("");
  const [traveldata, settraveldata] = useState();
  const [actualmodedata, setactualmodedata] = useState();
  const [traveltraindata, settraveltraindata] = useState();
  const [travelairdata, settravelairdata] = useState();
  const [dialogstatus, setdialogstatus] = useState(false);
  const [modedialogstatus, setmodedialogstatus] = useState(false);
  const [modeoftravel, setmodeoftravel] = useState("");
  const [classoftravelstatus, setclassoftravelstatus] = useState(false);
  const [classoftravellabel, setclassoftravellabel] = useState(false);
  const [classoftravel, setclassoftravel] = useState("");
  const [requestercomment, setrequestercomment] = useState("");
  const [editable, seteditable] = useState(true);
  const [tittle, settittle] = useState();
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Traveling Expenses",
    });
  });
  useEffect(() => {
    if (route.params.from == "Approver") {
      seteditable(false);
    } else {
      seteditable(true);
    }
  }, [route]);

  async function actualmode() {
    let actualmodearray = [];
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + "actualmode", {
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
      } else {
        for (let i = 0; i < json.length; i++) {
          const obj = {
            id: json[i].value,
            name: json[i].name,
          };
          actualmodearray.push(obj);
        }
        setactualmodedata(actualmodearray);
      }
    } catch (error) {}
  }
  async function traveltrain() {
    let traveltrainarray = [];
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + "travel_Train", {
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
      } else {
        for (let i = 0; i < json.length; i++) {
          const obj = {
            id: json[i].value,
            name: json[i].name,
          };
          traveltrainarray.push(obj);
        }
        settraveltraindata(traveltrainarray);
      }
    } catch (error) {}
  }
  async function travelair() {
    let travelairarray = [];
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + "travel_Air", {
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
      } else {
        for (let i = 0; i < json.length; i++) {
          const obj = {
            id: json[i].value,
            name: json[i].name,
          };
          travelairarray.push(obj);
        }
        settravelairdata(travelairarray);
      }
    } catch (error) {}
  }

  async function traveltypemethod() {
    let traveltypearray = [];
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + "traveltype", {
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
      } else {
        for (let i = 0; i < json.length; i++) {
          const obj = {
            id: json[i].value,
            name: json[i].name,
          };
          traveltypearray.push(obj);
        }
        settraveldata(traveltypearray);
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (TravelingExpenseId != "") {
      get();
    } else {
      setrequestercomment(route.params.Comments);
      setProgressBar(false);
    }
  }, [TravelingExpenseId]);

  useEffect(() => {
    traveltypemethod();
    travelair();
    traveltrain();
    actualmode();
  }, []);

  async function get() {
    setProgressBar(true);
    try {
      const response = await fetch(URL.TRAVELING_EXPENSES + "/tour/" + TourId, {
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
      } else {
        for (let i = 0; i < json.data.length; i++) {
          if (json.data[i].id == TravelingExpenseId) {
            let datewithtime = json.data[i].fromdate.split(" ");
            let uniqdate = datewithtime[0].split("-");
            let uniqtime = datewithtime[1];

            let outdatewithtime = json.data[i].todate.split(" ");
            let uniqoutdate = outdatewithtime[0].split("-");
            let uniqouttime = outdatewithtime[1];

            setCheckingDate(uniqdate);
            setcheckoutDate(uniqoutdate);
            setCheckingTime(uniqtime);
            setcheckoutTime(uniqouttime);

            setjsonCheckingDate(
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
              ).format("YYYY-MM-DD")
            );

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

            setjsoncheckoutDate(
              moment(
                new Date(
                  uniqoutdate[1] +
                    " " +
                    uniqoutdate[2] +
                    ", " +
                    uniqoutdate[0] +
                    " " +
                    uniqtime +
                    ":00"
                )
              ).format("YYYY-MM-DD")
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
                    uniqtime +
                    ":00"
                )
              ).format("DD-MM-YYYY")
            );

            settraveltype(json.data[i].traveltype);
            setdepartureplace(json.data[i].fromplace);
            setmodeoftravel(json.data[i].actualmode);
            setplaceofvisit(json.data[i].toplace);

            if (
              json.data[i].actualmode == "Train" ||
              json.data[i].actualmode == "Air"
            ) {
              setclassoftravellabel(!classoftravellabel);
              setclassoftravel(json.data[i].travelclass);
            }

            if (json.data[i].prior_permission == "YES") {
              setpriority(true);
            } else {
              setpriority(false);
            }
            if (json.data[i].highermodereason == "YES") {
              sethighermode(true);
            } else {
              sethighermode(false);
            }

            setvendorname(json.data[i].vendorname);
            setclaimamount(json.data[i].claimedamount + "");
            setbillno(json.data[i].billno);
            setremarks(json.data[i].remarks);
            setrequestercomment(json.requestercomment);
            setProgressBar(false);
            break;
          }
        }
      }
    } catch (error) {
      setProgressBar(false);
    }
  }

  const onStartDate = (selectedDate) => {
    setcheckingDateStatus(false);
    setjsonCheckingDate(moment(selectedDate).format("YYYY-MM-DD"));
    setCheckingDate(moment(selectedDate).format("DD-MM-YYYY"));
  };

  const onEndDate = (selectedDate) => {
    setcheckoutDateStatus(false);
    setjsoncheckoutDate(moment(selectedDate).format("YYYY-MM-DD"));
    setcheckoutDate(moment(selectedDate).format("DD-MM-YYYY"));
  };
  const onStartTime = (selectedDate) => {
    setcheckingTimeStatus(false);
    setCheckingTime(moment(selectedDate).format("HH:mm"));
  };
  const onEndTime = (selectedDate) => {
    setcheckoutTimeStatus(false);
    setcheckoutTime(moment(selectedDate).format("HH:mm"));
  };

  function Highermode(radioButtonsArray) {
    sethighermode(radioButtonsArray[0].selected);
  }
  function Priorpermission(radioButtonsArray) {
    setpriority(radioButtonsArray[0].selected);
  }

  function validation() {
    if (jsoncheckingDate != "") {
      if (jsoncheckoutDate != "") {
        if (checkingTime != "") {
          if (checkoutTime != "") {
            if (traveltype != "") {
              if (departureplace != "") {
                if (placeofvisit != "") {
                  if (claimamount != "") {
                    if (modeoftravel != "") {
                      if (modeoftravel == "Train" || modeoftravel == "Air") {
                        if (classoftravel != "") {
                          TravelingExpensePost();
                        } else {
                          Alert.alert("Choose Class of Travel");
                        }
                      } else {
                        TravelingExpensePost();
                      }
                    } else {
                      Alert.alert("Choose Mode of Travel");
                    }
                  } else {
                    Alert.alert("Enter Claim Amount");
                  }
                } else {
                  Alert.alert("Enter Visiting Place");
                }
              } else {
                Alert.alert("Enter Departure Place");
              }
            } else {
              Alert.alert("Choose Travel Type");
            }
          } else {
            Alert.alert("Enter Checkout Time");
          }
        } else {
          Alert.alert("Enter Checkin Time");
        }
      } else {
        Alert.alert("Enter Checkout Date");
      }
    } else {
      Alert.alert("Enter Checkin Date");
    }
  }
  async function TravelingExpensePost() {
    setProgressBar(true);
    let jsonobject;
    let obj;
    obj = {
      tour_id: TourId,
      expensegid: 1,
      fromdate: jsoncheckingDate + " " + checkingTime + ":00",
      todate: jsoncheckingDate + " " + checkoutTime + ":00",
      traveltype: traveltype,
      fromplace: departureplace,
      toplace: placeofvisit,
      actualmode: modeoftravel,
      billno: billno,
      totaltkttamt: parseInt(claimamount),
      vendorname: vendorname,
      remarks: remarks,
      mobile: 1,
      requestercomment: requestercomment,
      eligiblemodeoftravel: "why_this_key?",
    };
    if (modeoftravel == "Train" || modeoftravel == "Air") {
      obj["travelclass"] = classoftravel;
    }

    if (highermode) {
      obj["highermodereason"] = "YES";
    } else {
      obj["highermodereason"] = "NO";
    }
    if (priority) {
      obj["prior_permission"] = "YES";
    } else {
      obj["prior_permission"] = "NO";
    }

    if (TravelingExpenseId != "") {
      obj["id"] = TravelingExpenseId;
      jsonobject = {
        data: [obj],
      };
    } else {
      jsonobject = {
        data: [obj],
      };
    }
    console.log(JSON.stringify(jsonobject) + "Travelling Expense Post");

    try {
      const response = await fetch(URL.TRAVELING_EXPENSES, {
        method: "POST",
        body: JSON.stringify(jsonobject),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();
      console.log(JSON.stringify(json) + "Traveling Expense");

      if (json) {
        if ("detail" in json) {
          if(json.detail == "Invalid credentials/token."){
          AlertCredentialError(json.detail, navigation);
          }
        }
        setProgressBar(false);
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
          <DateTimeSelector
            inDate={checkingDate}
            inDateLabel={"Departure Date:*"}
            outDateLabel={"Arrival Date:*"}
            inTimeLabel={"Departure Time:*"}
            outTimeLabel={"Arrival Time:*"}
            inDateLabelhint={"Departure Date:"}
            outDateLabelhint={"Arrival Date:"}
            inTimeLabelhint={"Departure Time:"}
            outTimeLabelhint={"Arrival Time:"}
            outDate={checkoutDate}
            inTime={checkingTime}
            outTime={checkoutTime}
            inDateOnPress={() => {
              if (editable) {
                setcheckingDateStatus(!checkingdateStatus);
                setcheckoutDate("");
              }
            }}
            outDateOnPress={() => {
              if (editable) {
                if (checkingDate != "") {
                  setcheckoutDateStatus(!checkoutDateStatus);
                } else {
                  Alert.alert("First Fill Departure Date");
                }
              }
            }}
            inTimeOnPress={() => {
              if (editable) {
                setcheckingTimeStatus(!checkingTimeStatus);
              }
            }}
            outTimeOnPress={() => {
              if (editable) {
                setcheckoutTimeStatus(!checkoutTimeStatus);
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

          <DropDown
            label="Travel Type*"
            hint="Travel Type"
            indata={traveltype}
            ontouch={() => {
              if (editable) {
                setdialogstatus(!dialogstatus);
              }
            }}
          ></DropDown>
          {dialogstatus && (
            <DropDownDialog
              dialogstatus={dialogstatus}
              data={traveldata}
              Tittle="Travel Type"
              setdata={settraveltype}
              setdialogstatus={setdialogstatus}
            ></DropDownDialog>
          )}
          <Inputtextrow
            label="Departure Place* :"
            hint="Departure Place"
            editable={editable}
            value={departureplace}
            onChangeEvent={(updated) => {
              setdepartureplace(updated);
            }}
          ></Inputtextrow>

          <Inputtextrow
            label="Place of Visit* :"
            hint="Place of Visit"
            editable={editable}
            value={placeofvisit}
            onChangeEvent={(updated) => {
              setplaceofvisit(updated);
            }}
          ></Inputtextrow>
          <DropDown
            label="Actual Mode of Travel*"
            hint="Choose One"
            indata={modeoftravel}
            ontouch={() => {
              if (editable) {
                setmodedialogstatus(!modedialogstatus);
              }
            }}
          ></DropDown>
          {modedialogstatus && (
            <DropDownDialogTravelingExpense
              dialogstatus={modedialogstatus}
              data={actualmodedata}
              Tittle="Mode of Travel"
              setdata={setmodeoftravel}
              setempty={setclassoftravel}
              setheading={settittle}
              setdialogstatus={setmodedialogstatus}
              setlabelstatus={setclassoftravellabel}
            ></DropDownDialogTravelingExpense>
          )}
          {classoftravellabel && (
            <DropDown
              label="Class of Travel*"
              hint="Choose One"
              indata={classoftravel}
              ontouch={() => {
                if (editable) {
                  setclassoftravelstatus(!classoftravelstatus);
                }
              }}
            ></DropDown>
          )}

          {classoftravelstatus && (
            <DropDownDialog
              dialogstatus={classoftravelstatus}
              data={modeoftravel == "Train" ? traveltraindata : travelairdata}
              Tittle={tittle}
              setdata={setclassoftravel}
              setdialogstatus={setclassoftravelstatus}
            ></DropDownDialog>
          )}
          <Inputtextrow
            label="Bill Number :"
            hint="Bill No"
            editable={editable}
            value={billno}
            onChangeEvent={(updated) => {
              setbillno(updated);
            }}
          ></Inputtextrow>
          <InputNumberrow
            label="Claim Amount* :"
            hint="Claim Amount "
            editable={editable}
            value={claimamount}
            onChangeEvent={(updated) => {
              setclaimamount(updated);
            }}
          ></InputNumberrow>

          <CustomizedRadioButton
            label="Higher Mode Opted Due To Personal Reasons of Exigencies:"
            status={highermode}
            buttonpressed={Highermode}
          ></CustomizedRadioButton>

          <CustomizedRadioButton
            label="Prior Permission Taken for higher mode of travel:"
            status={priority}
            buttonpressed={Priorpermission}
          ></CustomizedRadioButton>

          {/*  {priority && (
          <Inputtextrow
            label="Who has opted Higher mode"
            hint="Higher Mode"
          ></Inputtextrow>
        )} */}
          <Inputtextrow
            label="Vendor Name :"
            hint="Vendor Name"
            editable={editable}
            value={vendorname}
            onChangeEvent={(updated) => {
              setvendorname(updated);
            }}
          ></Inputtextrow>
          <ReimbursementCommentBox
            label="Remarks :"
            editable={editable}
            inputComment={remarks}
            hint="Orders/Remarks"
            onInputCommentChanged={(updated) => {
              setremarks(updated);
            }}
          ></ReimbursementCommentBox>
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
});
