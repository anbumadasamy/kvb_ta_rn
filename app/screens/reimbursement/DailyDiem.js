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
import DailyDiemDropDownDialog from "../../components/dialog/DailyDiemDropDownDialog ";
import ReimbursementCommentBox from "../../components/ui/ReimbursementCommentBox";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import SearchDialog from "../../components/dialog/SearchDialog";
import { CustomColors } from "../../utilities/CustomColors";
import CheckingAndCheckoutTime from "../../components/ui/CheckingAndCheckoutTimeSelector";
import moment from "moment";
import LabelTextColumnView from "../../components/ui/LabelTextColumnView";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";
import Datepicker from "../../components/ui/datepicker";

export default function DailyDiem({ route }) {
  const TourId = route.params.TourId;
  const ReqDate = route.params.ReqDate;
  let DailyDiemId = route.params.DailyDiemId;
  let customid = route.params.customid;
  let list = route.params.Data;
  let jsonobject;
  let obj;
  let eligible;
  const [boarding, setboarding] = useState(true);
  const navigation = useNavigation();
  const [dialogstatus, setdialogstatus] = useState(false);
  const [subcategory, setsubcategory] = useState("");
  const [first, setfirst] = useState(true);
  const [subcategorydata, setsubcategorydata] = useState();
  const authCtx = useContext(AuthContext);
  const [citydialogstatus, setcitydialogstatus] = useState(false);
  const [billno, setbillno] = useState("");
  const [claimamount, setclaimamount] = useState("");
  const [foodallowance, setfoodallowance] = useState("");
  const [medicalallowance, setmedicalallowance] = useState("");
  const [eligibleamount, seteligibleamount] = useState("");
  const [dailydiemdate, setdailydiemdate] = useState("");
  const [dailydiemdatems, setdailydiemdatems] = useState("");
  const [checkingTimeStatus, setcheckingTimeStatus] = useState(false);
  const [checkoutTimeStatus, setcheckoutTimeStatus] = useState(false);
  const [checkingTimeformat, setcheckingTimeformat] = useState("");
  const [checkoutTimeformat, setcheckoutTimeformat] = useState("");
  const [noofhour, setnoofhour] = useState();
  const [checkingTime, setCheckingTime] = useState("");
  const [checkoutTime, setcheckoutTime] = useState("");
  const [requestercomment, setrequestercomment] = useState("");
  const [iseligible, setiseligible] = useState(false);
  const [remarkslabel, setremarkslabel] = useState("Remarks :");
  const [progressBar, setProgressBar] = useState(true);
  const [editable, seteditable] = useState(true);
  const [city, setcity] = useState("");
  const [cityinputtextstatus, setcityinputtextstatus] = useState(false);
  const [remarks, setremarks] = useState("");

  const onPressRadioButton = (radioButtonsArray) => {
    setboarding(radioButtonsArray[0].selected);
  };

  useEffect(() => {
    navigation.setOptions({
      title: "Daily Diem",
    });
    getdata();
  }, []);

  useEffect(() => {
    if (route.params.from == "Approver") {
      seteditable(false);
    } else {
      seteditable(true);
    }
  }, [route]);

  useEffect(() => {
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
  }, [first, claimamount, eligibleamount]);

  useEffect(() => {
    if (checkoutTimeformat != "" && checkingTimeformat != "") {
      timedifference();
    }
  }, [checkoutTimeformat, noofhour]);

  useEffect(() => {
    eligibleamountvalidation();
  }, [checkingTime, checkoutTime, subcategory, boarding]);

  useEffect(() => {
    if (subcategory == "Domestic") {
      setcityinputtextstatus(false);
    } else {
      setcityinputtextstatus(true);
    }
  }, [subcategory]);

  useEffect(() => {
    if (foodallowance != "" && medicalallowance != "") {
      setclaimamount(parseInt(foodallowance) + parseInt(medicalallowance) + "");
    } else if (foodallowance != "" && medicalallowance == "") {
      setclaimamount(foodallowance);
    } else if (foodallowance == "" && medicalallowance != "") {
      setclaimamount(medicalallowance);
    }
  }, [foodallowance, medicalallowance]);

  function eligibleamountvalidation() {
    if (subcategory != "" && checkoutTime != "" && checkingTime != "") {
      EligibleAmountCalculation();
    }
  }

  async function EligibleAmountCalculation() {
    eligible = {
      citytype: subcategory,
      fromdate:
        moment(dailydiemdatems).format("YYYY-MM-DD") +
        " " +
        checkingTime +
        ":00",
      todate:
        moment(dailydiemdatems).format("YYYY-MM-DD") +
        " " +
        checkoutTime +
        ":00",
      tourgid: TourId,
      expensegid: 2,
    };

    if (boarding) {
      eligible["boardingbyorganiser"] = "YES";
    } else {
      eligible["boardingbyorganiser"] = "NO";
    }

    try {
      const response = await fetch(URL.DAILY_DIEM_ElIGIBLE, {
        method: "POST",
        body: JSON.stringify(eligible),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();
      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
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
      const response = await fetch(URL.COMMON_DROPDOWN + "dailydiem", {
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
      setremarks(route.params.Remarks);
      setdailydiemdate(route.params.Date);
      setdailydiemdatems(route.params.customid);
      setrequestercomment(route.params.requestercomment);
      setProgressBar(false);
    }
  }, [DailyDiemId]);

  function validation() {
    if (checkingTime != "") {
      if (checkoutTime != "") {
        if (subcategory != "") {
          if (city != "") {
            if (iseligible) {
              if (foodallowance != "") {
                if (medicalallowance != "") {
                  if (claimamount != "") {
                    if (parseInt(eligibleamount) < parseInt(claimamount)) {
                      if (remarks != "") {
                        create();
                      } else {
                        Alert.alert("Enter Valid Remarks");
                      }
                    } else {
                      create();
                    }
                  } else {
                    Alert.alert("Claim Amount Cant be empty");
                  }
                } else {
                  Alert.alert("Enter Medical Allowance");
                }
              } else {
                Alert.alert("Enter Food Allowance");
              }
            } else {
              create();
            }
          } else {
            Alert.alert("Enter City");
          }
        } else {
          Alert.alert("Choose SubCategory");
        }
      } else {
        Alert.alert("Enter Checkout Time");
      }
    } else {
      Alert.alert("Enter Checkin Time");
    }
  }

  function create() {
    if (DailyDiemId != "") {
      DailyDiemExpensePost();
    } else {
      DailyDiemCreation();
    }
  }

  function DailyDiemCreation() {
    for (const obj of list) {
      let sys = noofhour.split(":");
      let syshours = sys[0];

      if (obj.id == customid) {
        obj.fromdatewithtime =
          moment(obj.id).format("YYYY-MM-DD") + " " + checkingTime + ":00";
        obj.todatewithtime =
          moment(obj.id).format("YYYY-MM-DD") + " " + checkoutTime + ":00";
        obj.noofhours = syshours;
        obj.citytype = subcategory;
        obj.visitcity = city;
        obj.billno = billno;
        if (boarding) {
          obj.boardingbyorganiser = "YES";
        } else {
          obj.boardingbyorganiser = "NO";
        }
        if (claimamount != "") {
          obj.claimedamount = parseInt(claimamount);
        } else {
          obj.claimedamount = 0;
        }
        if (foodallowance != "") {
          obj.foodallowance = parseInt(foodallowance);
        } else {
          obj.foodallowance = 0;
        }
        if (medicalallowance != "") {
          obj.medicalexpense = parseInt(medicalallowance);
        } else {
          obj.medicalexpense = 0;
        }

        obj.eligibleamount = parseInt(eligibleamount);
        obj.remarks = remarks;
      }
    }
    DailyDiemCustomCreationPost();
  }
  function DailyDiemCustomCreationPost() {
    let customobj;
    let customobjarray = [];
    for (let i = 0; i < list.length; i++) {
      customobj = {
        tour_id: TourId,
        expensegid: 2,
        fromdate: list[i].fromdatewithtime,
        todate: list[i].todatewithtime,
        syshours: list[i].noofhours,
        eligibleamount: list[i].eligibleamount,
        claimedamount: parseInt(list[i].claimedamount),
        visitcity: list[i].visitcity,
        citytype: list[i].citytype,
        billno: list[i].billno,
        remarks: list[i].remarks,
        requestercomment: list[i].Comments,
        foodallowance: list[i].foodallowance,
        medicalexpense: list[i].medicalexpense,
        eligibleamount: list[i].eligibleamount,
      };
      if (list[i].boardingbyorganiser) {
        customobj["boardingbyorganiser"] = "YES";
      } else {
        customobj["boardingbyorganiser"] = "NO";
      }
      customobjarray.push(customobj);
    }

    jsonobject = JSON.stringify({
      data: customobjarray,
    });

    APICall();
  }

  function DailyDiemExpensePost() {
    let sys = noofhour.split(":");
    let syshours = sys[0];

    obj = {
      tour_id: TourId,
      expensegid: 2,
      fromdate:
        moment(dailydiemdatems).format("YYYY-MM-DD") +
        " " +
        checkingTime +
        ":00",
      todate:
        moment(dailydiemdatems).format("YYYY-MM-DD") +
        " " +
        checkoutTime +
        ":00",
      syshours: syshours,
      eligibleamount: parseInt(eligibleamount),
      visitcity: city,
      citytype: subcategory,
      billno: billno,
      remarks: remarks,
      mobile: 1,
      requestercomment: requestercomment,
    };

    if (claimamount != "") {
      obj["claimedamount"] = parseInt(claimamount);
    } else {
      obj["claimedamount"] = 0;
    }
    if (foodallowance != "") {
      obj["foodallowance"] = parseInt(foodallowance);
    } else {
      obj["foodallowance"] = 0;
    }
    if (medicalallowance != "") {
      obj["medicalexpense"] = parseInt(medicalallowance);
    } else {
      obj["medicalexpense"] = 0;
    }

    if (boarding) {
      obj["boardingbyorganiser"] = "YES";
    } else {
      obj["boardingbyorganiser"] = "NO";
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
          if(json.detail == "Invalid credentials/token."){
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
      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }
      else {

      for (let i = 0; i < json.data.length; i++) {
        if (json.data[i].id == DailyDiemId) {
          let datewithtime = json.data[i].fromdate.split(" ");
          let uniqdate = datewithtime[0].split("-");
          let uniqtime = datewithtime[1];

          let outdatewithtime = json.data[i].todate.split(" ");
          let uniqoutdate = outdatewithtime[0].split("-");
          let uniqouttime = outdatewithtime[1];

          setdailydiemdate(
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

          setCheckingTime(uniqtime);
          setcheckoutTime(uniqouttime);

          setcheckingTimeformat(
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

          setsubcategory(json.data[i].citytype);
          setcity(json.data[i].visitcity);
          setnoofhour(json.data[i].noofhours + ":00");
          setclaimamount(json.data[i].claimedamount + "");
          setbillno(json.data[i].billno);
          setremarks(json.data[i].remarks);
          setfoodallowance(json.data[i].foodallowance + "");
          setmedicalallowance(json.data[i].medicalexpense + "");
          seteligibleamount(json.data[i].eligibleamount + "");
          setrequestercomment(json.requestercomment);

          if (parseInt(json.data[i].noofhours) >= 9) {
            setiseligible(true);
          } else {
            setiseligible(false);
          }

          if (json.data[i].boardingbyorganiser == "YES") {
            setboarding(true);
          } else {
            setboarding(false);
          }
          setProgressBar(false);

          break;
        }
      }
    }
    } catch (error) {
      setProgressBar(false);
    }
  }

  const onStartTime = (selectedDate) => {
    setcheckingTimeStatus(false);
    setcheckingTimeformat(selectedDate);
    setCheckingTime(moment(selectedDate).format("HH:mm"));
    setcheckoutTime("");
    setcheckoutTimeformat("");
    setnoofhour("");
  };
  const onEndTime = (selectedDate) => {
    setcheckoutTimeStatus(false);
    setcheckoutTimeformat(selectedDate);
    setfirst(false);
  };
  function timedifference() {
    let time;
    let minutes;
    let ctime = moment(checkingTimeformat).format("HH:mm").split(":");
    let couttime = moment(checkoutTimeformat).format("HH:mm").split(":");
    let cminutes = parseInt(ctime[0] * 60) + parseInt(ctime[1]);
    let coutminutes = parseInt(couttime[0] * 60) + parseInt(couttime[1]);

    if (coutminutes > cminutes) {
      let differ = coutminutes - cminutes;
      let hour = ~~(differ / 60);
      minutes = differ % 60;
      time = hour + ":" + minutes;
      setcheckoutTime(moment(checkoutTimeformat).format("HH:mm"));
      if (minutes == 0) {
        setnoofhour(`${hour}:0${minutes}`);
      } else {
        setnoofhour(`${hour}:${minutes}`);
      }
      if (hour >= 9) {
        setiseligible(true);
      } else {
        Alert.alert("Minimum 9 Hours Required For Eligible");
        setiseligible(false);
        setfoodallowance("");
        setmedicalallowance("");
        setclaimamount("");
      }
    } else {
      setnoofhour("");
      setcheckoutTime("");
      Alert.alert("Enter Valid Checkout Time");
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
         {/*  <View style={styles.rowcontainer}>
            <View style={styles.rowcontainer}>
              <Text style={{ marginBottom: 20 }}>Date: </Text>
              <Text>{dailydiemdate}</Text>
            </View>
            <View style={styles.rowcontainer}>
              <Text style={{ marginBottom: 20 }}>System Calculated No of hours: </Text>
              <Text>{noofhour}</Text>
            </View>
          </View> */}
         
          <Datepicker
            onPressStart={() => {
              if (editable) {
                setpickerstatus(!pickerstatus);
              }
            }}
            startDate={"Start Date"}
            initial="Start Date"
          ></Datepicker>
          <CheckingAndCheckoutTime
            inTimeLabel={"Checkin Time* :"}
            outTimeLabel={"Checkout Time* :"}
            inTimeLabelhint={"Checkin Time:"}
            outTimeLabelhint={"Checkout Time:"}
            inTime={checkingTime}
            outTime={checkoutTime}
            inTimeOnPress={() => {
              if (editable) {
                setcheckingTimeStatus(!checkingTimeStatus);
              }
            }}
            outTimeOnPress={() => {
              if (editable) {
                if (checkingTime != "") {
                  setcheckoutTimeStatus(!checkoutTimeStatus);
                } else {
                  Alert.alert("Enter Checkin Time");
                }
              }
            }}
          ></CheckingAndCheckoutTime>
         

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
           <LabelTextColumnView
              label="System Calculated No of Hours:"
              hint=""
              value={claimamount}
            ></LabelTextColumnView>
           <Inputtextrow
            label="No of Hours*"
            hint=""
            value={claimamount}
            editable={editable}
            onChangeEvent={(updated) => {
              setbillno(updated);
            }}
          ></Inputtextrow>

          <DropDown
            label="Sub category*"
            hint="Choose"
            indata={subcategory}
            ontouch={() => {
              if (editable) {
                setdialogstatus(!dialogstatus);
                setfirst(false);
              }
            }}
          ></DropDown>
          {dialogstatus && (
            <DailyDiemDropDownDialog
              dialogstatus={dialogstatus}
              data={subcategorydata}
              Tittle="Sub Category"
              setdata={setsubcategory}
              setdialogstatus={setdialogstatus}
              setempty={setcity}
              // clicked={eligibleamountvalidation}
            ></DailyDiemDropDownDialog>
          )}
          {cityinputtextstatus && (
            <Inputtextrow
              label="City* :"
              hint="City"
              editable={editable}
              value={city}
              onChangeEvent={(updated) => {
                setcity(updated);
              }}
            ></Inputtextrow>
          )}
          {!cityinputtextstatus && (
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
          )}

          {citydialogstatus && (
            <SearchDialog
              dialogstatus={citydialogstatus}
              setValue={setcity}
              setdialogstatus={setcitydialogstatus}
              from="DAILYDIEM"
            />
          )}
        {/*   {iseligible && (
            <InputNumberrow
              label="Food Allowance* :"
              hint=""
              value={foodallowance}
              editable={editable}
              onChangeEvent={(updated) => {
                setfoodallowance(updated);
                setfirst(false);
              }}
            ></InputNumberrow>
          )}
          {iseligible && (
            <InputNumberrow
              label="Medical Expense* :"
              hint=""
              editable={editable}
              value={medicalallowance}
              onChangeEvent={(updated) => {
                setmedicalallowance(updated);
                setfirst(false);
              }}
            ></InputNumberrow>
          )} */}
         {/*  <Inputtextrow
            label="Bill Number :"
            hint="Bill No"
            value={billno}
            editable={editable}
            onChangeEvent={(updated) => {
              setbillno(updated);
            }}
          ></Inputtextrow> */}
           <Inputtextrow
            label="No of Leave Days :"
            hint="Bill No"
            value={billno}
            editable={editable}
            onChangeEvent={(updated) => {
              setbillno(updated);
            }}
          ></Inputtextrow>
          <LabelTextColumnView
              label="Eligible Amount:"
              hint=""
              value={claimamount}
            ></LabelTextColumnView>
           <Inputtextrow
            label="Claim Amount*"
            hint=""
            value={claimamount}
            editable={editable}
            onChangeEvent={(updated) => {
              setbillno(updated);
            }}
          ></Inputtextrow>
           
          <CustomizedRadioButton
            label="Accommodation Provided by bank* :"
            status={boarding}
            buttonpressed={onPressRadioButton}
          ></CustomizedRadioButton>
          <CustomizedRadioButton
            label="Boarding Provided by Organizer* :"
            status={boarding}
            buttonpressed={onPressRadioButton}
          ></CustomizedRadioButton>
          <CustomizedRadioButton
            label="Declaration for boarding submitted* :"
            status={boarding}
            buttonpressed={onPressRadioButton}
          ></CustomizedRadioButton>
          {/* <ReimbursementCommentBox
            label={remarkslabel}
            editable={editable}
            inputComment={remarks}
            hint="Orders/Remarks"
            onInputCommentChanged={(updated) => {
              setremarks(updated);
            }}
          ></ReimbursementCommentBox> */}
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
});
