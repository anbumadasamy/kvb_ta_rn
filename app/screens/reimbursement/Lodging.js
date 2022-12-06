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
import DropDown from "../../components/ui/DropDown";
import DropDownDialog from "../../components/dialog/DropDownDialog";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import DateTimeSelector from "../../components/ui/DateTimeSelector";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CustomColors } from "../../utilities/CustomColors";
import SearchDialog from "../../components/dialog/SearchDialog";
import CustomizedRadioButton from "../../components/ui/CustomizedRadiobutton";
import LabelTextColumnView from "../../components/ui/LabelTextColumnView";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

export default function Lodging({ route }) {
  const TourId = route.params.TourId;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  const ReqDate = route.params.ReqDate;
  let LodgingId = route.params.LodgingId;

  const [first, setfirst] = useState(true);
  const [checkingDate, setCheckingDate] = useState("");
  const [checkoutDate, setcheckoutDate] = useState("");
  const [LcheckoutDate, setLcheckoutDate] = useState("");
  const [checkingTime, setCheckingTime] = useState("");
  const [checkoutTime, setcheckoutTime] = useState("");
  const [LcheckoutTime, setLcheckoutTime] = useState("");
  const [checkingdateStatus, setcheckingDateStatus] = useState(false);
  const [checkoutDateStatus, setcheckoutDateStatus] = useState(false);
  const [LcheckoutDateStatus, setLcheckoutDateStatus] = useState(false);
  const [checkingTimeStatus, setcheckingTimeStatus] = useState(false);
  const [checkoutTimeStatus, setcheckoutTimeStatus] = useState(false);
  const [LcheckoutTimeStatus, setLcheckoutTimeStatus] = useState(false);
  const [jsoncheckingDate, setjsonCheckingDate] = useState("");
  const [jsoncheckoutDate, setjsoncheckoutDate] = useState("");
  const [jsonLcheckoutDate, setLjsoncheckoutDate] = useState("");
  const [city, setcity] = useState("");
  const [citydialogstatus, setcitydialogstatus] = useState(false);
  const [Center_Classification, setCenter_Classification] = useState("");
  const [CC_dialogstatus, setCC_dialogstatus] = useState(false);
  const [CC_data, setCC_data] = useState("");
  const [actualplace, setactualplace] = useState("");
  const [nodays, setnodays] = useState("");
  const [accomodation, setaccomodation] = useState("");
  const [accomodation_id, setaccomodation_id] = useState(0);
  const [yesornodata, setyesornodata] = useState("");
  const [accomodationdialogststus, setaccomodationdialogststus] =
    useState(false);
  const [tourgrade, settourgrade] = useState("");
  const [is_bill, setis_bill] = useState("");
  const [is_bill_id, setis_bill_id] = useState(0);
  const [is_billdialogststus, setis_billdialogststus] = useState(false);
  const [ac_refno, setac_refno] = useState("");
  const [billno, setbillno] = useState("");
  const [totalbillamount, settotalbillamount] = useState("");
  const [eligibleamount, seteligibleamount] = useState("");
  const [claimamount, setclaimamount] = useState("");
  const [taxamount, settaxamount] = useState("");
  const [vendorname, setvendorname] = useState("");
  const [requestercomment, setrequestercomment] = useState("");
  const [editable, seteditable] = useState(true);
  const [progressBar, setProgressBar] = useState(true);
  const [HSN_number, setHSN_number] = useState("");
  const [Hsn_dialogstatus, setHsn_dialogstatus] = useState(false);
  const [bank_gstno, setbank_gstno] = useState("");
  const [bank_dialogstatus, setbank_dialogststus] = useState(false);
  const [lodge_gstno, setlodge_gstno] = useState("");
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);

  const [subcategory, setsubcategory] = useState("Lodging");
  const [subcategorydata, setsubcategorydata] = useState();
  const [dialogstatus, setdialogstatus] = useState(false);
  const [remarks, setremarks] = useState("");
  const [remarkslabel, setremarkslabel] = useState("Remarks :");

  useEffect(() => {
    navigation.setOptions({
      title: "Lodging",
    });
    getdata("lodging_center", 0);
    getdata("yn", 1);
    getTourGrade();
  }, []);
  /* useEffect(() => {
    if (parseInt(eligibleamount) < parseInt(claimamount)) {
      setremarkslabel("Remarks:*");
      if (!first) {
        Alert.alert(
          "You are exceeding the eligible amount. Please enter a valid remarks"
        );
      }
    } else {
      setremarkslabel("Remarks:");
    }
  }, [claimamount, eligibleamount]); */

  useEffect(() => {
    if (route.params.from == "Approver") {
      seteditable(false);
    } else {
      seteditable(true);
    }
  }, [route]);

  useEffect(() => {
    if (!first) {
      if (
        checkoutTime != "" &&
        checkingTime != "" &&
        jsoncheckingDate != "" &&
        jsoncheckoutDate != "" &&
        city != ""
      ) {
        EligibleAmountCalculation();
      }
    }
  }, [
    jsoncheckingDate,
    jsoncheckoutDate,
    checkingTime,
    checkoutTime,
    accomodation_id,
    city,
  ]);

  function eligibleamountvalidation() {
    if (
      subcategory != "" &&
      checkoutTime != "" &&
      checkingTime != "" &&
      jsoncheckingDate != "" &&
      jsoncheckoutDate != "" &&
      city != ""
    ) {
      EligibleAmountCalculation();
    }
  }
  async function EligibleAmountCalculation() {
    let eligible;
    eligible = {
      accbybank: accomodation_id,
      tourgid: TourId,
      fromdate: jsoncheckingDate + " " + checkingTime + ":00",
      todate: jsoncheckingDate + " " + checkoutTime + ":00",
      city: city,
      expensegid: 5,
    };

    try {
      const response = await fetch(URL.LODGING_ElIGIBLE, {
        method: "POST",
        body: JSON.stringify(eligible),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();
      console.log(JSON.stringify(json)+" Eligible Amount JSON response")
      if (response.status == 403) {
        AlertCredentialError(json.detail, navigation);
        return;
      }

      seteligibleamount(json.Eligible_amount + "");
    } catch (error) {}
  }
  async function getdata(getparam, id) {
    try {
      let subcategoryarray = [];
      const response = await fetch(URL.COMMON_DROPDOWN + getparam, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      if (response.status == 403) {
        AlertCredentialError(json.detail, navigation);
        return;
      }
      for (let i = 0; i < json.length; i++) {
        const obj = {
          id: json[i].value,
          name: json[i].name,
        };
        subcategoryarray.push(obj);
      }
      switch (id) {
        case 0:
          setCC_data(subcategoryarray);
          break;
        case 1:
          setyesornodata(subcategoryarray);
          break;
      }
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

      if (response.status == 403) {
        AlertCredentialError(json.detail, navigation);
        return;
      }

      settourgrade(json.employee_grade);
    } catch (error) {}
  }
  useEffect(() => {
    if (LodgingId != "") {
      get();
    } else {
      setrequestercomment(route.params.Comments);
      setProgressBar(false);
    }
  }, [LodgingId]);

  async function get() {
    setProgressBar(true);
    try {
      const response = await fetch(URL.LODGING + "/tour/" + TourId, {
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
        for (let i = 0; i < json.data.length; i++) {
          if (json.data[i].id == LodgingId) {
            let datewithtime = json.data[i].fromdate.split(" ");
            let uniqdate = datewithtime[0].split("-");
            let uniqtime = datewithtime[1];

            let outdatewithtime = json.data[i].todate.split(" ");
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

            setsubcategory(json.data[i].Lodge_Homestay);
            setcity(json.data[i].city);
            setbillno(json.data[i].billno);
            settotalbillamount(json.data[i].Billamountexculdingtax + "");
            setclaimamount(json.data[i].claimedamount + "");
            settaxamount(json.data[i].taxonly + "");
            setvendorname(json.data[i].vendorname);
            setremarks(json.data[i].remarks);
            seteligibleamount(json.data[i].eligibleamount);
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
    setfirst(false);
  };

  const onEndDate = (selectedDate) => {
    setcheckoutDateStatus(false);
    setjsoncheckoutDate(moment(selectedDate).format("YYYY-MM-DD"));
    setcheckoutDate(moment(selectedDate).format("DD-MM-YYYY"));
    setfirst(false);
  };
  const onLEndDate = (selectedDate) => {
    setLcheckoutDateStatus(false);
    setLjsoncheckoutDate(moment(selectedDate).format("YYYY-MM-DD"));
    setLcheckoutDate(moment(selectedDate).format("DD-MM-YYYY"));
    setfirst(false);
  };
  const onStartTime = (selectedDate) => {
    setcheckingTimeStatus(false);
    setCheckingTime(moment(selectedDate).format("HH:mm"));
    setfirst(false);
  };
  const onEndTime = (selectedDate) => {
    setcheckoutTimeStatus(false);
    setcheckoutTime(moment(selectedDate).format("HH:mm"));
    setfirst(false);
  };
  const onLEndTime = (selectedDate) => {
    setLcheckoutTimeStatus(false);
    setLcheckoutTime(moment(selectedDate).format("HH:mm"));
    setfirst(false);
  };
  function validation() {
    if (jsoncheckingDate != "") {
      if (jsoncheckoutDate != "") {
        if (checkingTime != "") {
          if (checkoutTime != "") {
            if (subcategory != "") {
              if (city != "") {
                if (totalbillamount != "") {
                  if (taxamount != "") {
                    if (claimamount != "") {
                      if (parseInt(eligibleamount) < parseInt(claimamount)) {
                        if (remarks != "") {
                          LodgingExpensePost();
                        } else {
                          Alert.alert("Enter Valid Remarks");
                        }
                      } else {
                        LodgingExpensePost();
                      }
                    } else {
                      Alert.alert("Enter Claim Amount");
                    }
                  } else {
                    Alert.alert("Enter Tax Amount");
                  }
                } else {
                  Alert.alert("Enter Total Bill Amount");
                }
              } else {
                Alert.alert("Choose City");
              }
            } else {
              Alert.alert("Choose Subcategory");
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

  async function LodgingExpensePost() {
    setProgressBar(true);
    let jsonobject;
    let obj;
    obj = {
      tour_id: TourId,
      expensegid: 5,
      fromdate: jsoncheckingDate + " " + checkingTime + ":00",
      todate: jsoncheckingDate + " " + checkoutTime + ":00",
      Lodge_Homestay: subcategory,
      city: city,
      billno: billno,
      Billamountexculdingtax: parseInt(totalbillamount),
      claimedamount: parseInt(claimamount),
      taxonly: parseInt(taxamount),
      vendorname: vendorname,
      remarks: remarks,
      mobile: 1,
      requestercomment: requestercomment,
      eligibleamount: eligibleamount,
      approvedamount: claimamount,
    };

    if (LodgingId != "") {
      obj["id"] = LodgingId;
      jsonobject = {
        data: [obj],
      };
    } else {
      jsonobject = {
        data: [obj],
      };
    }

    try {
      const response = await fetch(URL.LODGING, {
        method: "POST",
        body: JSON.stringify(jsonobject),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

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
            inDateLabel={"Checkin Date:* "}
            outDateLabel={"Checkout Date:*"}
            inTimeLabel={"Checkin Time:*"}
            outTimeLabel={"Checkout Time:*"}
            inDateLabelhint={"Checkin Date:"}
            outDateLabelhint={"Checkout Date:"}
            inTimeLabelhint={"Checkin Time:"}
            outTimeLabelhint={"Checkout Time:"}
            LodgingoutDateLabelhint={"Lodge out Date:"}
            LodgingoutTimeLabelhint={"Lodge out Time:"}
            LodgingoutDateLabel={"Lodge out Date:*"}
            LodgingoutTimeLabel={"Lodge out Time:*"}
            lodgingOutDate={LcheckoutDate}
            lodingOutTime={LcheckoutTime}
            from="Lodging"
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
                  Alert.alert("First Fill Departure Date");
                }
              }
            }}
            LoutDateOnPress={() => {
              if (editable) setLcheckoutDateStatus(!LcheckoutDateStatus);
            }}
            inTimeOnPress={() => {
              if (editable) {
                setcheckingTimeStatus(!checkingTimeStatus);
                setfirst(false)
              }
            }}
            outTimeOnPress={() => {
              if (editable) {
                setcheckoutTimeStatus(!checkoutTimeStatus);
                setfirst(false)
              }
            }}
            LoutTimeOnPress={() => {
              if (editable) {
                console.log("Anbuuuuuuu");
                setLcheckoutTimeStatus(!LcheckoutTimeStatus);
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
            isVisible={LcheckoutDateStatus}
            mode="date"
            onConfirm={onLEndDate}
            onCancel={() => {
              setLcheckoutDateStatus(false);
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
          <DateTimePickerModal
            isVisible={LcheckoutTimeStatus}
            mode="time"
            locale="en_GB"
            date={new Date()}
            display={Platform.OS == "ios" ? "spinner" : "default"}
            is24Hour={true}
            minuteInterval={15}
            onConfirm={onLEndTime}
            onCancel={() => {
              setLcheckoutTimeStatus(false);
            }}
          />
          <DropDown
            label="City*"
            hint="City"
            indata={city}
            ontouch={() => {
              if (editable) {
                setcitydialogstatus(!citydialogstatus);
                setfirst(false)
              }
            }}
          ></DropDown>
          {citydialogstatus && (
            <SearchDialog
              dialogstatus={citydialogstatus}
              setValue={setcity}
              setdialogstatus={setcitydialogstatus}
              from="Lodging_City_search"
              grade={tourgrade}
              setfirst={setfirst}
            />
          )}

          <DropDown
            label="Center Classification"
            hint="Center Classification"
            indata={Center_Classification}
            ontouch={() => {
              if (editable) {
                setCC_dialogstatus(!CC_dialogstatus);
              }
            }}
          ></DropDown>
          {CC_dialogstatus && (
            <DropDownDialog
              dialogstatus={CC_dialogstatus}
              data={CC_data}
              Tittle="Center Classification"
              setdata={setCenter_Classification}
              setdialogstatus={setCC_dialogstatus}
              clicked={() => setfirst(false)}
            ></DropDownDialog>
          )}

          <Inputtextrow
            label="Place of Actual stay* :"
            hint="Place of Actual stay"
            editable={editable}
            value={actualplace}
            onChangeEvent={(updated) => {
              setactualplace(updated);
            }}
          ></Inputtextrow>
          <InputNumberrow
            label="No of Days* :"
            hint="No of Days"
            editable={editable}
            value={nodays}
            onChangeEvent={(updated) => {
              setnodays(updated);
            }}
          ></InputNumberrow>

          <DropDown
            label="Accommodation provided by Bank"
            hint="Accommodation provided by Bank"
            indata={accomodation}
            ontouch={() => {
              if (editable) {
                setaccomodationdialogststus(!accomodationdialogststus);
                setfirst(false)
              }
            }}
          ></DropDown>
          {accomodationdialogststus && (
            <DropDownDialog
              dialogstatus={accomodationdialogststus}
              data={yesornodata}
              Tittle="Accommodation"
              setdata={setaccomodation}
              setdialogstatus={setaccomodationdialogststus}
              setid={setaccomodation_id}
              from="0"
              clicked={() => setfirst(false)}
            ></DropDownDialog>
          )}
          {accomodation_id == 1 && (
            <Inputtextrow
              label="Accommodation Ref No:*"
              hint="Accommodation Ref No"
              editable={editable}
              value={ac_refno}
              onChangeEvent={(updated) => {
                setac_refno(updated);
              }}
            ></Inputtextrow>
          )}

          <DropDown
            label="Bill Available"
            hint="Bill Available"
            indata={is_bill}
            ontouch={() => {
              if (editable) {
                setis_billdialogststus(!is_billdialogststus);
              }
            }}
          ></DropDown>
          {is_billdialogststus && (
            <DropDownDialog
              dialogstatus={is_billdialogststus}
              data={yesornodata}
              Tittle="Bill Available"
              setdata={setis_bill}
              setid={setis_bill_id}
              from="0"
              setdialogstatus={setis_billdialogststus}
              clicked={() => setfirst(false)}
            ></DropDownDialog>
          )}
          {is_bill_id == 1 && (
            <InputNumberrow
              label="Bill Number:*"
              hint="Bill Number"
              value={billno}
              editable={editable}
              onChangeEvent={(updated) => {
                setbillno(updated);
              }}
            ></InputNumberrow>
          )}
          <InputNumberrow
            label="Total Bill Amount(Excluding Tax)*"
            hint="Total Bill Amount"
            editable={editable}
            value={totalbillamount}
            onChangeEvent={(updated) => {
              settotalbillamount(updated);
            }}
          ></InputNumberrow>
          <InputNumberrow
            label="Claim Amount(Excluding Tax)*"
            hint="Claim Amount"
            editable={editable}
            value={claimamount}
            onChangeEvent={(updated) => {
              setclaimamount(updated);
            }}
          ></InputNumberrow>
          <LabelTextColumnView
            label="Eligible Amount(Excluding Tax):"
            hint="Eligible Amount"
            value={eligibleamount}
          ></LabelTextColumnView>
          <InputNumberrow
            label="Tax Only(Luxury & Service)*"
            hint="Tax Only"
            editable={editable}
            value={taxamount}
            onChangeEvent={(updated) => {
              settaxamount(updated);
            }}
          ></InputNumberrow>
          <Inputtextrow
            label="Vendor Name :"
            hint="Vendor Name"
            editable={editable}
            value={vendorname}
            onChangeEvent={(updated) => {
              setvendorname(updated);
            }}
          ></Inputtextrow>
          <DropDown
            label="HSN Code*"
            hint="HSN Code"
            indata={HSN_number}
            ontouch={() => {
              if (editable) {
                setHsn_dialogstatus(!Hsn_dialogstatus);
              }
            }}
          ></DropDown>
          {Hsn_dialogstatus && (
            <SearchDialog
              dialogstatus={Hsn_dialogstatus}
              setValue={setHSN_number}
              setdialogstatus={setHsn_dialogstatus}
              from="HSN_Code"
              setfirst={setfirst}
            />
          )}

          <DropDown
            label="Bank GST No*"
            hint="Bank GST No"
            indata={bank_gstno}
            ontouch={() => {
              if (editable) {
                setbank_dialogststus(!bank_dialogstatus);
              }
            }}
          ></DropDown>
          {bank_dialogstatus && (
            <SearchDialog
              dialogstatus={bank_dialogstatus}
              setValue={setbank_gstno}
              setdialogstatus={setbank_dialogststus}
              from="Bank_GST"
              setfirst={setfirst}
            />
          )}
          <Inputtextrow
            label="Lodge GST Number :"
            hint="Lodge GST Number"
            editable={editable}
            value={lodge_gstno}
            onChangeEvent={(updated) => {
              setlodge_gstno(updated);
            }}
          ></Inputtextrow>
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
