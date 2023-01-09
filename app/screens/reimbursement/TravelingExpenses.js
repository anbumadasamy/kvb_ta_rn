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
import LabelTextColumnView from "../../components/ui/LabelTextColumnView";
import SearchDialog from "../../components/dialog/SearchDialog";

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
  const [departureplace, setdepartureplace] = useState("");
  const [placeofvisit, setplaceofvisit] = useState("");
  const [totaltkttamt, settotaltkttamt] = useState("");
  const [tkt_bybank, settkt_bybank] = useState("No");
  const [tkt_bybank_id, settkt_bybank_id] = useState(0);
  const [tkt_bybank_dstatus, settkt_bybank_dstatus] = useState(false);
  const [highermode, sethighermode] = useState("No");
  const [highermode_id, sethighermode_id] = useState(0);
  const [highermode_dstatus, sethighermode_dstatus] = useState(false);
  const [priority, setpriority] = useState("No");
  const [priority_id, setpriority_id] = useState(0);
  const [priority_dstatus, setpriority_dstatus] = useState(false);
  const [tkt_refno, settkt_refno] = useState("");
  const [actualmodeoftravel, setactualmodeoftravel] = useState();
  const [actualmodedata, setactualmodedata] = useState();
  const [actualmodestatus, setactualmodestatus] = useState();
  const [classoftravel, setclassoftravel] = useState("");
  const [classoftravel_id, setclassoftravel_id] = useState("");
  const [classoftraveldata, setclassoftraveldata] = useState("");
  const [yesornodata, setyesornodata] = useState("");
  const [classoftravelstatus, setclassoftravelstatus] = useState(false);
  const [eligiblemodeoftravel, seteligiblemodeoftravel] = useState(false);
  const [is_igst, setis_igst] = useState(true);
  const [who_higher, setwho_higher] = useState("");
  const [no_of_dependent, setno_of_dependent] = useState("");
  const [dependent, setdependent] = useState("");
  const [dependentstatus, setdependentstatus] = useState(false);
  const [claimamount, setclaimamount] = useState("");
  const [vendorname, setvendorname] = useState("");
  const [vendorcode, setvendorcode] = useState("");
  const [HSN_number, setHSN_number] = useState("");
  const [Hsn_dialogstatus, setHsn_dialogstatus] = useState(false);
  const [bank_gstno, setbank_gstno] = useState("");
  const [bank_dialogstatus, setbank_dialogststus] = useState(false);
  const [vendor_gstno, setvendor_gstno] = useState("");
  const [requestercomment, setrequestercomment] = useState("");
  const [editable, seteditable] = useState(true);
  const [first, setfirst] = useState(true);

  const [igst, setigst] = useState("0");
  const [cgst, setcgst] = useState("0");
  const [sgst, setsgst] = useState("0");
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  const [billno, setbillno] = useState("");
  const [remarks, setremarks] = useState("");
  const [traveltype, settraveltype] = useState("");
  const [traveldata, settraveldata] = useState();
  const [traveltraindata, settraveltraindata] = useState();
  const [travelairdata, settravelairdata] = useState();
  const [dialogstatus, setdialogstatus] = useState(false);
  const [modedialogstatus, setmodedialogstatus] = useState(false);
  const [modeoftravel, setmodeoftravel] = useState("");
  const [classoftravellabel, setclassoftravellabel] = useState(false);
  const [tittle, settittle] = useState();

  console.log(tkt_bybank_id + " tkt_bybank_id");

  useEffect(() => {
    navigation.setOptions({
      title: "Traveling Expenses",
    });
    getdata("travel_travelmode", 0);
    getdata("yn", 2);
    tournogradeget();
  }, []);
  useEffect(() => { 
    if (route.params.from == "Approver") {
      seteditable(false);
    } else {
      seteditable(true);
    }
  }, [route]);

  async function getdata(getparam, id) {
    let traveltrainarray = [];
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + getparam, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      console.log(JSON.stringify(json) + " Drop Down Response");

      if (response.status == 403) {
        AlertCredentialError(json.detail, navigation);
        return;
      }

      for (let i = 0; i < json.length; i++) {
        const obj = {
          id: json[i].value,
          name: json[i].name,
        };
        traveltrainarray.push(obj);
      }
      switch (id) {
        case 0:
          setactualmodedata(traveltrainarray);
          break;
        case 1:
          setclassoftraveldata(traveltrainarray);
          break;
        case 2:
          setyesornodata(traveltrainarray);
          break;
      }
    } catch (error) {}
  }

  async function tournogradeget() {
    try {
      const response = await fetch(URL.TOUR_GRADE + +TourId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      console.log(JSON.stringify(json) + "TourNoGrade");

      if (response.status == 403) {
        AlertCredentialError(json.detail, navigation);
        return;
      }
      seteligiblemodeoftravel(json.travelclass);
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
    if (actualmodeoftravel != "") {
      switch (actualmodeoftravel) {
        case "Road":
          getdata("travel_Road", 1);
          break;
        case "Train":
          getdata("travel_Train", 1);
          break;
        case "Air":
          getdata("travel_Air", 1);
          break;
        case "Sea":
          getdata("travel_Sea", 1);
          break;
      }
    }
  }, [actualmodeoftravel]);

  useEffect(() => {
    if (!first) {
      console.log("Inga vanthiyada mandaya");
      if (HSN_number != "" && bank_gstno != "" && vendor_gstno.length >= 2) {
        if (
          bank_gstno[0] + bank_gstno[1] + "" ==
          vendor_gstno[0] + vendor_gstno[1] + ""
        ) {
          setcgst(parseFloat(igst / 2) + "");
          setsgst(parseFloat(igst / 2) + "");
          // setigst(0+"");
          setis_igst(false);
        } else {
          // setigst(igst + "");
          setis_igst(true);
          /* setcgst(0+"");
          setsgst(0+""); */
        }
      }
    }
  }, [HSN_number, bank_gstno, vendor_gstno]);

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

      console.log(JSON.stringify(json) + " Traveling Expense Get");

      if (response.status == 403) {
        AlertCredentialError(json.detail, navigation);
        return;
      }

      for (let i = 0; i < json.data.length; i++) {
        if (json.data[i].id == TravelingExpenseId) {
          let datewithtime = json.data[i].depaturedate.split(" ");
          let uniqdate = datewithtime[0].split("-");
          let uniqtime = datewithtime[1];

          let outdatewithtime = json.data[i].arrivaldate.split(" ");
          let uniqoutdate = outdatewithtime[0].split("-");
          let uniqouttime = outdatewithtime[1];

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
          setdepartureplace(json.data[i].depatureplace);
          setplaceofvisit(json.data[i].placeofvisit);
          settotaltkttamt(json.data[i].totaltkttamt + "");
          settkt_bybank(json.data[i].tktbybank.name);
          settkt_bybank_id(json.data[i].tktbybank.value + "");
          settkt_refno(json.data[i].tktrefno + "");
          setactualmodeoftravel(json.data[i].actualtravel.name);
          setclassoftravel(json.data[i].classoftravel.name);
          setclassoftravel_id(json.data[i].classoftravel.value);
          seteligiblemodeoftravel(json.data[i].eligibletravel);
          setpriority(json.data[i].priorpermission.name + "");
          setpriority_id(json.data[i].priorpermission.value + "");
          setno_of_dependent(json.data[i].noofdependents + "");
          setclaimamount(json.data[i].claimedamount + "");
          setvendorname(json.data[i].vendorname);
          setvendorcode(json.data[i].vendorcode);
          setvendor_gstno(json.data[i].vendorgstno);
          if (json.data[i].bankgstno != "0") {
            setbank_gstno(json.data[i].bankgstno);
          }
          if (json.data[i].hsncode.code != null) {
            setHSN_number(json.data[i].hsncode.code);
          }
          if (json.data[i].igst == 0) {
            setcgst(json.data[i].cgst + "");
            setsgst(json.data[i].sgst + "");
            setis_igst(false);
          } else {
            setigst(json.data[i].igst + "");
            setis_igst(true);
          }
          if (json.data[i].highermodereasons == "1") {
            setwho_higher(json.data[i].highermodeopted + "");
            sethighermode("Yes");
          } else {
            sethighermode("No");
          }
          sethighermode_id(json.data[i].highermodereasons + "");
          setrequestercomment(json.requestercomment);
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

  function validation() {
    if (jsoncheckingDate == "") {
      Alert.alert("Enter Checkin Date");
      return;
    }
    if (jsoncheckoutDate == "") {
      Alert.alert("Enter Checkout Date");
      return;
    }

    if (checkingTime == "") {
      Alert.alert("Enter Checkin Time");
      return;
    }
    if (checkoutTime == "") {
      Alert.alert("Enter Checkout Time");
      return;
    }
    if (departureplace == "") {
      Alert.alert("Enter Departure Place");
      return;
    }
    if (placeofvisit == "") {
      Alert.alert("Enter Place of Visit");
      return;
    }
    if (tkt_bybank == 1 && tkt_refno == "") {
      Alert.alert("Enter Ticket Reference Number");
      return;
    }
    if (priority_id == 1 && who_higher == "") {
      Alert.alert("Enter Who has opter Higher Mode");
      return;
    }
    if (totaltkttamt == "") {
      Alert.alert("Enter Total Ticket Amount");
      return;
    }
    if (actualmodeoftravel == "") {
      Alert.alert("Choose Mode of Travel");
      return;
    }
    if (actualmodeoftravel == "") {
      Alert.alert("Choose Mode of Travel");
      return;
    }
    if (classoftravel == "") {
      Alert.alert("Choose Class of Travel");
      return;
    }
    if (claimamount == "") {
      Alert.alert("Enter Claim Amount");
      return;
    }
    TravelingExpensePost();
  }
  async function TravelingExpensePost() {
    setProgressBar(true);
    let jsonobject;
    let obj;
    obj = {
      dependencies: [],
      requestercomment: requestercomment,
      tourid: TourId,
      expenseid: 1,
      depaturedate: jsoncheckingDate + " " + checkingTime + ":00",
      arrivaldate: jsoncheckingDate + " " + checkoutTime + ":00",
      claimedamount: parseInt(claimamount),
      depatureplace: departureplace,
      placeofvisit: placeofvisit,
      totaltkttamt: totaltkttamt,
      tktbybank: tkt_bybank_id + "",
      actualtravel: actualmodeoftravel,
      highermodereasons: highermode_id + "",
      priorpermission: priority_id + "",
      classoftravel: classoftravel_id,
      mobile: 1,
      vendorname: vendorname,
      vendorcode: vendorcode,
      vendorgstno: vendor_gstno,
      hsncode: HSN_number,

      approvedamount: parseInt(claimamount),
      noofdependents: 0,
    };
    if (tkt_bybank_id == 1) {
      obj["tktrefno"] = tkt_refno;
    } else {
      obj["tktrefno"] = 0;
    }
    if (highermode_id == 1) {
      obj["highermodeopted"] = who_higher;
    } else {
      obj["highermodeopted"] = "0";
    }

    if (bank_gstno != "") {
      obj["bankgstno"] = bank_gstno;
    } else {
      obj["bankgstno"] = 0;
    }
    if (is_igst) {
      obj["igst"] = parseFloat(igst);
      obj["cgst"] = 0;
      obj["sgst"] = 0;
    } else {
      obj["igst"] = 0;
      obj["cgst"] = parseFloat(cgst);
      obj["sgst"] = parseFloat(sgst);
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
          if (json.detail == "Invalid credentials/token.") {
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
          <InputNumberrow
            label="Total Ticket Amount* :"
            hint="Total Ticket Amount "
            editable={editable}
            value={totaltkttamt}
            onChangeEvent={(updated) => {
              settotaltkttamt(updated);
            }}
          ></InputNumberrow>

          <DropDown
            label="Ticket By Bank"
            hint="Ticket By Bank"
            indata={tkt_bybank}
            ontouch={() => {
              if (editable) {
                settkt_bybank_dstatus(!tkt_bybank_dstatus);
              }
            }}
          ></DropDown>
          {tkt_bybank_dstatus && (
            <DropDownDialog
              dialogstatus={tkt_bybank_dstatus}
              data={yesornodata}
              Tittle="Ticket By Bank"
              setdata={settkt_bybank}
              setdialogstatus={settkt_bybank_dstatus}
              setid={settkt_bybank_id}
              from="0"
            ></DropDownDialog>
          )}
          {tkt_bybank_id == 1 && (
            <InputNumberrow
              label="Ticket Reference Number* :"
              hint="Ticket Reference Number "
              editable={editable}
              value={tkt_refno}
              onChangeEvent={(updated) => {
                settkt_refno(updated);
              }}
            ></InputNumberrow>
          )}
          <DropDown
            label="Actual Mode of Travel*"
            hint="Actual Mode of Travel"
            indata={actualmodeoftravel}
            ontouch={() => {
              if (editable) {
                setactualmodestatus(!actualmodestatus);
              }
            }}
          ></DropDown>
          {actualmodestatus && (
            <DropDownDialog
              dialogstatus={actualmodestatus}
              data={actualmodedata}
              Tittle="Actual Mode of Travel"
              setdata={setactualmodeoftravel}
              setdialogstatus={setactualmodestatus}
              clicked={() => {
                setclassoftravel("");
              }}
            ></DropDownDialog>
          )}
          <DropDown
            label="Class of Travel*"
            hint="Class of Travel"
            indata={classoftravel}
            ontouch={() => {
              if (editable) {
                setclassoftravelstatus(!classoftravelstatus);
              }
            }}
          ></DropDown>

          {classoftravelstatus && (
            <DropDownDialog
              dialogstatus={classoftravelstatus}
              data={classoftraveldata}
              Tittle="Class of Travel"
              setdata={setclassoftravel}
              setdialogstatus={setclassoftravelstatus}
              from="0"
              setid={setclassoftravel_id}
            ></DropDownDialog>
          )}

          <LabelTextColumnView
            label="Eligible Mode of Travel:"
            hint="Eligible Mode of Travel"
            value={eligiblemodeoftravel}
          ></LabelTextColumnView>

          <DropDown
            label="Higher Mode Opted Due To Personal Reasons of Exigencies:"
            hint="Higher Mode"
            indata={highermode}
            ontouch={() => {
              if (editable) {
                sethighermode_dstatus(!highermode_dstatus);
              }
            }}
          ></DropDown>
          {highermode_dstatus && (
            <DropDownDialog
              dialogstatus={highermode_dstatus}
              data={yesornodata}
              Tittle="Higher Mode"
              setdata={sethighermode}
              setdialogstatus={sethighermode_dstatus}
              setid={sethighermode_id}
              from="0"
            ></DropDownDialog>
          )}

          <DropDown
            label="Prior Permission Taken for higher mode of travel:"
            hint="Prior Permission "
            indata={priority}
            ontouch={() => {
              if (editable) {
                setpriority_dstatus(!priority_dstatus);
              }
            }}
          ></DropDown>
          {priority_dstatus && (
            <DropDownDialog
              dialogstatus={priority_dstatus}
              data={yesornodata}
              Tittle="Higher Mode"
              setdata={setpriority}
              setdialogstatus={setpriority_dstatus}
              setid={setpriority_id}
              from="0"
            ></DropDownDialog>
          )}

          {priority_id == 1 && (
            <Inputtextrow
              label="Who has opted Higher mode* :"
              hint="Higher Mode"
              editable={editable}
              value={who_higher}
              onChangeEvent={(updated) => {
                setwho_higher(updated);
              }}
            ></Inputtextrow>
          )}

          <InputNumberrow
            label="No of Tickets/No of dependent Traveling* :"
            hint="No of Tickets/No of dependent Traveling "
            editable={editable}
            value={no_of_dependent}
            onChangeEvent={(updated) => {
              setno_of_dependent(updated);
            }}
          ></InputNumberrow>

          <DropDown
            label="Dependent On Traveling*"
            hint="Dependent On Traveling"
            indata={dependent}
            ontouch={() => {
              if (editable) {
                setdependentstatus(!dependentstatus);
              }
            }}
          ></DropDown>

          {dependentstatus && (
            <SearchDialog
              dialogstatus={dependentstatus}
              setValue={setdependent}
              setdialogstatus={setdependentstatus}
              from="Dependent"
              setfirst={setfirst}
            />
          )}

          <InputNumberrow
            label="Claim Amount* :"
            hint="Claim Amount"
            editable={editable}
            value={claimamount}
            onChangeEvent={(updated) => {
              setclaimamount(updated);
            }}
          ></InputNumberrow>

          <Inputtextrow
            label="Vendor Name* :"
            hint="Vendor Name "
            editable={editable}
            value={vendorname}
            onChangeEvent={(updated) => {
              setvendorname(updated);
            }}
          ></Inputtextrow>

          <Inputtextrow
            label="Vendor Code :"
            hint="Vendor Code"
            editable={editable}
            value={vendorcode}
            onChangeEvent={(updated) => {
              setvendorcode(updated);
            }}
          ></Inputtextrow>

          <DropDown
            label="HSN Code*"
            hint="HSN Code"
            indata={HSN_number}
            ontouch={() => {
              if (editable) {
                setHsn_dialogstatus(!Hsn_dialogstatus);
                setfirst(false);
              }
            }}
          ></DropDown>
          {Hsn_dialogstatus && (
            <SearchDialog
              dialogstatus={Hsn_dialogstatus}
              setValue={setHSN_number}
              setdialogstatus={setHsn_dialogstatus}
              from="HSN_Code"
              setigst={setigst}
            />
          )}

          <DropDown
            label="Bank GST No*"
            hint="Bank GST No"
            indata={bank_gstno}
            ontouch={() => {
              if (editable) {
                setbank_dialogststus(!bank_dialogstatus);
                setfirst(false);
              }
            }}
          ></DropDown>
          {bank_dialogstatus && (
            <SearchDialog
              dialogstatus={bank_dialogstatus}
              setValue={setbank_gstno}
              setdialogstatus={setbank_dialogststus}
              from="Bank_GST"
            />
          )}
          <Inputtextrow
            label="Vendor GST Number :"
            hint="Vendor GST Number"
            editable={editable}
            value={vendor_gstno}
            onChangeEvent={(updated) => {
              setvendor_gstno(updated);
              setfirst(false);
            }}
          ></Inputtextrow>
          {HSN_number != "" &&
            bank_gstno != "" &&
            vendor_gstno != "" &&
            is_igst && (
              <LabelTextColumnView
                label="IGST Percentage:"
                hint="IGST Percentage"
                value={igst}
              ></LabelTextColumnView>
            )}
          {!is_igst &&
            HSN_number != "" &&
            bank_gstno != "" &&
            vendor_gstno != "" && (
              <LabelTextColumnView
                label="CGST Percentage:"
                hint="CGST Percentage"
                value={cgst}
              ></LabelTextColumnView>
            )}
          {!is_igst &&
            HSN_number != "" &&
            bank_gstno != "" &&
            vendor_gstno != "" && (
              <LabelTextColumnView
                label="SGST Percentage:"
                hint="SGST Percentage"
                value={sgst}
              ></LabelTextColumnView>
            )}
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
