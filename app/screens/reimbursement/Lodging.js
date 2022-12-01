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
import ReimbursementCommentBox from "../../components/ui/ReimbursementCommentBox";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CustomColors } from "../../utilities/CustomColors";
import SearchDialog from "../../components/dialog/SearchDialog";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

export default function Lodging({ route }) {
  const TourId = route.params.TourId;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  const ReqDate = route.params.ReqDate;
  let LodgingId = route.params.LodgingId;
  const [subcategory, setsubcategory] = useState("Lodging");
  const [city, setcity] = useState("");
  const [subcategorydata, setsubcategorydata] = useState();
  const authCtx = useContext(AuthContext);
  const [dialogstatus, setdialogstatus] = useState(false);
  const [citydialogstatus, setcitydialogstatus] = useState(false);
  const [progressBar, setProgressBar] = useState(true);
  const [checkingDate, setCheckingDate] = useState("");
  const [checkoutDate, setcheckoutDate] = useState("");
  const [checkingTime, setCheckingTime] = useState("");
  const [checkoutTime, setcheckoutTime] = useState("");
  const [first, setfirst] = useState(true);
  const [jsoncheckingDate, setjsonCheckingDate] = useState("");
  const [jsoncheckoutDate, setjsoncheckoutDate] = useState("");
  const [checkingdateStatus, setcheckingDateStatus] = useState(false);
  const [checkoutDateStatus, setcheckoutDateStatus] = useState(false);
  const [checkingTimeStatus, setcheckingTimeStatus] = useState(false);
  const [checkoutTimeStatus, setcheckoutTimeStatus] = useState(false);
  const [billno, setbillno] = useState("");
  const [remarks, setremarks] = useState("");
  const [totalbillamount, settotalbillamount] = useState("");
  const [claimamount, setclaimamount] = useState("");
  const [taxamount, settaxamount] = useState("");
  const [vendorname, setvendorname] = useState("");
  const [eligibleamount, seteligibleamount] = useState("");
  const [requestercomment, setrequestercomment] = useState("");
  const [remarkslabel, setremarkslabel] = useState("Remarks :");
  const [editable, seteditable] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Lodging",
    });
    getdata();
  }, []);
  useEffect(() => {
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
  }, [claimamount, eligibleamount]);

  useEffect(() => {
    if (route.params.from == "Approver") {
      seteditable(false);
    } else {
      seteditable(true);
    }
  }, [route]);

  useEffect(() => {
    eligibleamountvalidation();
  }, [
    jsoncheckingDate,
    jsoncheckoutDate,
    checkingTime,
    checkoutTime,
    subcategory,
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
      Lodge_Homestay: subcategory,
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
      if ("detail" in json) {
        if (json.detail == "Invalid credentials/token.") {
          AlertCredentialError(json.detail, navigation);
        }
      } else {
        seteligibleamount(json.Eligible_amount + "");
      }
    } catch (error) {}
  }
  async function getdata() {
    try {
      let subcategoryarray = [];
      const response = await fetch(URL.COMMON_DROPDOWN + "lodge_homestay", {
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
            label="City*"
            hint="City"
            indata={subcategory}
            ontouch={() => {
              if (editable) {
                setdialogstatus(!dialogstatus);
              }
            }}
          ></DropDown>
          <DropDown
            label="Center Classification"
            hint="Center Classification"
            indata={subcategory}
            ontouch={() => {
              if (editable) {
                setdialogstatus(!dialogstatus);
              }
            }}
          ></DropDown>
          {/*    <DropDown
            label="Sub category*"
            hint="Sub category"
            indata={subcategory}
            ontouch={() => {
              if (editable) {
                setdialogstatus(!dialogstatus);
              }
            }}
          ></DropDown> */}
          {dialogstatus && (
            <DropDownDialog
              dialogstatus={dialogstatus}
              data={subcategorydata}
              Tittle="Sub category"
              setdata={setsubcategory}
              setdialogstatus={setdialogstatus}
              clicked={() => setfirst(false)}
            ></DropDownDialog>
          )}
          <DropDown
            label="City*"
            hint="City"
            indata={city}
            ontouch={() => {
              if (editable) {
                setcitydialogstatus(!citydialogstatus);
              }
            }}
          ></DropDown>
          {citydialogstatus && (
            <SearchDialog
              dialogstatus={citydialogstatus}
              setValue={setcity}
              setdialogstatus={setcitydialogstatus}
              from="LODGING"
              setfirst={setfirst}
            />
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
            label="Total Bill Amount (Excluding Tax):*"
            hint="Total Bill Amount"
            editable={editable}
            value={totalbillamount}
            onChangeEvent={(updated) => {
              settotalbillamount(updated);
            }}
          ></InputNumberrow>
          <InputNumberrow
            label="Claim Amount (INR) (Including Tax):*"
            hint="Claim Amount"
            value={claimamount}
            editable={editable}
            onChangeEvent={(updated) => {
              setclaimamount(updated);
            }}
          ></InputNumberrow>
          <InputNumberrow
            label="Tax only (Luxury Service):*"
            hint="Tax"
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
          <ReimbursementCommentBox
            label={remarkslabel}
            inputComment={remarks}
            hint="Orders/Remarks"
            editable={editable}
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
