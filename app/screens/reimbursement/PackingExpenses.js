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

export default function PackingExpenses({ route }) {
  const TourId = route.params.TourId;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  const ReqDate = route.params.ReqDate;
  let PackingExpenseId = route.params.PackingExpenseId;

  const [progressBar, setProgressBar] = useState(true);
  const [is_twowheeler, setis_twowheeler] = useState(false);
  const [is_household, setis_household] = useState(false);
  const [twowheelerby, settwowheelerby] = useState();
  const [twowheelerdata, settwowheelerdata] = useState();
  const [twowheelerstatus, settwowheelerstatus] = useState();
  const [vendorname, setvendorname] = useState("");
  const [vendorcode, setvendorcode] = useState("");
  const [totaldistance, settotaldistance] = useState("");
  const [hillyterraindistance, sethillyterraindistance] = useState("");
  const [tonnageofhousehold, settonnageofhousehold] = useState("");
  const [eligibletonnage, seteligibletonnage] = useState("");
  const [householdbillamount, sethouseholdbillamount] = useState("");
  const [eligibletransportation, seteligibletransportation] = useState("");
  const [transportationcharge, settransportationcharge] = useState("");
  const [is_driver, setis_driver] = useState(false);
  const [traveltime, settraveltime] = useState("");
  const [noofdriver, setnoofdriver] = useState("");
  const [eligibledriverbattas, seteligibledriverbattas] = useState("");
  const [diverbattas, setdriverbattas] = useState("");
  const [octroicharges, setoctroicharges] = useState("");
  const [breakupcharges, setbreakupcharges] = useState("");
  const [have_receipt, sethave_receipt] = useState(false);
  const [eligiblebreakupcharges, seteligiblebreakupcharges] = useState("");
  const [totaleligibleamount, settotaleligibleamount] = useState("");
  const [HSN_number, setHSN_number] = useState("");
  const [Hsn_dialogstatus, setHsn_dialogstatus] = useState(false);
  const [bank_gstno, setbank_gstno] = useState("");
  const [bank_dialogstatus, setbank_dialogststus] = useState(false);
  const [vendor_gstno, setvendor_gstno] = useState("");
  const [requestercomment, setrequestercomment] = useState("");
  const [editable, seteditable] = useState(true);
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();


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
  const [departureplace, setdepartureplace] = useState("");
  const [placeofvisit, setplaceofvisit] = useState("");
  const [totaltkttamt, settotaltkttamt] = useState("");
  const [tkt_bybank, settkt_bybank] = useState(false);
  const [tkt_refno, settkt_refno] = useState("");
  const [actualmodeoftravel, setactualmodeoftravel] = useState();
  const [actualmodedata, setactualmodedata] = useState();
  const [actualmodestatus, setactualmodestatus] = useState();
  const [classoftravel, setclassoftravel] = useState("");
  const [classoftraveldata, setclassoftraveldata] = useState("");
  const [classoftravelstatus, setclassoftravelstatus] = useState(false);
  const [eligiblemodeoftravel, seteligiblemodeoftravel] = useState(false);
  const [highermode, sethighermode] = useState(false);
  const [priority, setpriority] = useState(false);
  const [who_higher, setwho_higher] = useState("");
  const [no_of_dependent, setno_of_dependent] = useState("");
  const [dependent, setdependent] = useState("");
  const [dependentstatus, setdependentstatus] = useState(false);
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

  function Priorpermission(radioButtonsArray) {
    setpriority(radioButtonsArray[0].selected);
  }
  function Highermoderadiobutton(radioButtonsArray) {
    sethighermode(radioButtonsArray[0].selected);
  }
  function isbank(radioButtonsArray) {
    settkt_bybank(radioButtonsArray[0].selected);
  }
  function istwowheelertransport(radioButtonsArray) {
    is_twowheeler(radioButtonsArray[0].selected);
  }
  function ishouseholdtransport(radioButtonsArray) {
    is_household(radioButtonsArray[0].selected);
  }
  function isdrivertransport(radioButtonsArray) {
    setis_driver(radioButtonsArray[0].selected);
  }
  function havingreceipt(radioButtonsArray) {
    have_receipt(radioButtonsArray[0].selected);
  }

  useEffect(() => {
    navigation.setOptions({
      title: "Packing and Moving ",
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
        if (json.detail == "Invalid credentials/token.") {
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
        if (json.detail == "Invalid credentials/token.") {
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
        if (json.detail == "Invalid credentials/token.") {
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
        if (json.detail == "Invalid credentials/token.") {
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
    if (PackingExpenseId != "") {
      get();
    } else {
      setrequestercomment(route.params.Comments);
      setProgressBar(false);
    }
  }, [PackingExpenseId]);

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
        if (json.detail == "Invalid credentials/token.") {
          AlertCredentialError(json.detail, navigation);
        }
      } else {
        for (let i = 0; i < json.data.length; i++) {
          if (json.data[i].id == PackingExpenseId) {
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

    if (PackingExpenseId != "") {
      obj["id"] = PackingExpenseId;
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
          <CustomizedRadioButton
            label="Two Wheeler Transport:"
            status={is_twowheeler}
            buttonpressed={istwowheelertransport}
          ></CustomizedRadioButton>
          <CustomizedRadioButton
            label="Household Goods Transport:"
            status={is_household}
            buttonpressed={ishouseholdtransport}
          ></CustomizedRadioButton>
          
          <DropDown
            label="Transport of Two Wheeler by*"
            hint="Transport of Two Wheeler by"
            indata={twowheelerby}
            ontouch={() => {
              if (editable) {
                settwowheelerstatus(!twowheelerstatus);
              }
            }}
          ></DropDown>
          {twowheelerstatus && (
            <DropDownDialog
              dialogstatus={twowheelerstatus}
              data={twowheelerdata}
              Tittle="Transport of Two Wheeler by"
              setdata={settwowheelerby}
              setdialogstatus={settwowheelerstatus}
            ></DropDownDialog>
          )}
          <InputNumberrow
            label="Vendor Name* :"
            hint="Vendor Name "
            editable={editable}
            value={vendorname}
            onChangeEvent={(updated) => {
              setvendorname(updated);
            }}
          ></InputNumberrow>

          <Inputtextrow
            label="Vendor Code :"
            hint="Vendor Code"
            editable={editable}
            value={vendorcode}
            onChangeEvent={(updated) => {
              setvendorcode(updated);
            }}
          ></Inputtextrow>
          <InputNumberrow
            label="Total Distance(KM) (Including Hilly Terrain)* :"
            hint="Total Distance(KM)"
            editable={editable}
            value={totaldistance}
            onChangeEvent={(updated) => {
              settotaldistance(updated);
            }}
          ></InputNumberrow>
          <InputNumberrow
            label="Distance in Hilly Terrain* :"
            hint="Distance(KM)"
            editable={editable}
            value={hillyterraindistance}
            onChangeEvent={(updated) => {
              sethillyterraindistance(updated);
            }}
          ></InputNumberrow>
          <InputNumberrow
            label="Tonnage of Household Goods* :"
            hint="Tonnage of Household Goods"
            editable={editable}
            value={tonnageofhousehold}
            onChangeEvent={(updated) => {
              settonnageofhousehold(updated);
            }}
          ></InputNumberrow>
          <LabelTextColumnView
            label="Max Eligible Tonnage:"
            hint="Max Eligible Tonnage"
            value={eligibletonnage}
          ></LabelTextColumnView>
          <InputNumberrow
            label="Billed Amount of Household Goods Transport* :"
            hint="Billed Amount of Household Goods Transport"
            editable={editable}
            value={householdbillamount}
            onChangeEvent={(updated) => {
              sethouseholdbillamount(updated);
            }}
          ></InputNumberrow>

           <LabelTextColumnView
            label="Eligible Transportation Amount:"
            hint="Eligible Transportation Amount"
            value={eligibletonnage}
          ></LabelTextColumnView>

           <InputNumberrow
            label="Transport Charges for Vehicle* :"
            hint="Transport Charges for Vehicle"
            editable={editable}
            value={transportationcharge}
            onChangeEvent={(updated) => {
              settransportationcharge(updated);
            }}
          ></InputNumberrow>
            <CustomizedRadioButton
            label="Vehicle Transport By Driver:"
            status={is_driver}
            buttonpressed={isdrivertransport}
          ></CustomizedRadioButton>

           <InputNumberrow
            label="Travel Time in Hours(HH)* :"
            hint="Travel Time in Hours(HH)"
            editable={editable}
            value={traveltime}
            onChangeEvent={(updated) => {
              settraveltime(updated);
            }}
          ></InputNumberrow>
           <InputNumberrow
            label="No of Days Driver Engaged* :"
            hint="No of Days Driver Engaged"
            editable={editable}
            value={noofdriver}
            onChangeEvent={(updated) => {
              setnoofdriver(updated);
            }}
          ></InputNumberrow>

             <LabelTextColumnView
            label="Driver Battas:"
            hint="Driver Battas"
            value={eligibledriverbattas}
          ></LabelTextColumnView>
           <InputNumberrow
            label="Octroi Charges for Transport Vehicle* :"
            hint="Octroi Charges for Transport Vehicle"
            editable={editable}
            value={octroicharges}
            onChangeEvent={(updated) => {
              setoctroicharges(updated);
            }}
          ></InputNumberrow>
          <InputNumberrow
            label="Breakage Charges* :"
            hint="Breakage Charges"
            editable={editable}
            value={breakupcharges}
            onChangeEvent={(updated) => {
              setbreakupcharges(updated);
            }}
          ></InputNumberrow>
           <CustomizedRadioButton
            label="Recipt for Losses Due to Damage Produced:"
            status={have_receipt}
            buttonpressed={havingreceipt}
          ></CustomizedRadioButton>
          <LabelTextColumnView
            label="Eligible Breakage/Lumpsum Charge:"
            hint="Eligible Breakage/Lumpsum Charge"
            value={eligiblebreakupcharges}
          ></LabelTextColumnView>
          <LabelTextColumnView
            label="Eligible Amount:"
            hint="Eligible Amount:"
            value={totaleligibleamount}
          ></LabelTextColumnView>
            <InputNumberrow
            label="Claim Amount* :"
            hint="Claim Amount"
            editable={editable}
            value={claimamount}
            onChangeEvent={(updated) => {
              setclaimamount(updated);
            }}
          ></InputNumberrow>

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
            label="Vendor GST Number :"
            hint="Vendor GST Number"
            editable={editable}
            value={vendor_gstno}
            onChangeEvent={(updated) => {
              setvendor_gstno(updated);
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
