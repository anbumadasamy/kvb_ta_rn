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

  console.log(JSON.stringify(route) + " Route Data");

  const [progressBar, setProgressBar] = useState(true);
  const [is_twowheeler, setis_twowheeler] = useState("Yes");
  const [is_twowheeler_dstatus, setis_twowheeler_dstatus] = useState(false);
  const [is_twowheeler_id, setis_twowheeler_id] = useState("1");
  const [is_household, setis_household] = useState("Yes");
  const [is_household_dstatus, setis_household_dstatus] = useState(false);
  const [is_household_id, setis_household_id] = useState("1");

  const [twowheelerby, settwowheelerby] = useState();
  const [twowheelerby_id, settwowheelerby_id] = useState();
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
  const [is_driver, setis_driver] = useState("Yes");
  const [is_driver_id, setis_driver_id] = useState("1");
  const [is_driver_dstatus, setis_driver_dstatus] = useState(false);
  const [traveltime, settraveltime] = useState("");
  const [noofdaysengaged, setnoofdaysengaged] = useState("");
  const [eligibledriverbattas, seteligibledriverbattas] = useState("");
  const [diverbattas, setdriverbattas] = useState("");
  const [octroicharges, setoctroicharges] = useState("");
  const [breakupcharges, setbreakupcharges] = useState("");
  const [have_receipt, sethave_receipt] = useState("No");
  const [have_receipt_id, sethave_receipt_id] = useState("0");
  const [have_receipt_dstatus, sethave_receipt_dstatus] = useState(false);
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
  const [yesornodata, setyesornodata] = useState("");
  const [first, setfirst] = useState(true);
  const [igst, setigst] = useState("0");
  const [cgst, setcgst] = useState("0");
  const [sgst, setsgst] = useState("0");
  const [is_igst, setis_igst] = useState(true);

  
  const [claimamount, setclaimamount] = useState("");

  console.log(is_household_id + " is_household_id");

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

  useEffect(() => {
    if (!first) {
      if (HSN_number != "" && bank_gstno != "" && vendor_gstno.length >= 2) {
        if (
          bank_gstno[0] + bank_gstno[1] + "" ==
          vendor_gstno[0] + vendor_gstno[1] + ""
        ) {
          setcgst(parseFloat(igst / 2) + "");
          setsgst(parseFloat(igst / 2) + "");

          setis_igst(false);
        } else {
          setis_igst(true);
        }
      }
    }
  }, [HSN_number, bank_gstno, vendor_gstno]);
  async function getdata(getparam, id) {
    let array = [];
    try {
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
        array.push(obj);
      }
      switch (id) {
        case 0:
          setyesornodata(array);
          break;
        case 1:
          console.log(JSON.stringify(array) + " Transport of data");
          settwowheelerdata(array);
          break;
      }
      // setactualmodedata(actualmodearray);
    } catch (error) {}
  }

  useEffect(() => {
    if (!first) {
      if (
        totaldistance != "" &&
        traveltime != "" &&
        hillyterraindistance != "" &&
        tonnageofhousehold != ""
      ) {
        EligibleAmountCalculation();
      }
    }
  }, [
    totaldistance,
    is_twowheeler_id,
    tonnageofhousehold,
    have_receipt,
    hillyterraindistance,
    traveltime,
    is_driver_id,
  ]);

  async function EligibleAmountCalculation() {
    let eligible;
    eligible = {
      tourgid: TourId,
      totaldisttrans: parseInt(totaldistance),
      twowheelertrans: is_twowheeler_id,
      expense_id: 7,
      tonnagehhgood: parseInt(tonnageofhousehold),
      receipt_loss: have_receipt_id,
      distinhilly: parseInt(hillyterraindistance),
      traveltime: parseInt(traveltime),
      vehicletransbydriver: is_driver_id,
    };

    try {
      const response = await fetch(URL.PACKAGING_ELIGIBLE, {
        method: "POST",
        body: JSON.stringify(eligible),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();
      console.log(JSON.stringify(json) + " Eligible Amount JSON response");
      if (response.status == 403) {
        AlertCredentialError(json.detail, navigation);
        return;
      }
      seteligibletransportation(json.transportation_amount + "");
      setdriverbattas(json.driverbatta + "");
      seteligiblebreakupcharges(json.breakagecharge + "");
      settotaleligibleamount(json.Eligible_amount + "");
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
      seteligibletonnage(json.maxtonnage + "");

      // seteligiblemodeoftravel(json.travelclass);
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
    getdata("packing_twowheeler", 1);
    getdata("yn", 0);
    tournogradeget();
  }, []);

  async function get() {
    setProgressBar(true);
    console.log(URL.PACKAGING + "/tour/" + TourId + "Packaging get Url");
    try {
      const response = await fetch(URL.PACKAGING + "/tour/" + TourId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();
      console.log(JSON.stringify(json) + "Packing Expense Get");
      if ("detail" in json) {
        if (json.detail == "Invalid credentials/token.") {
          AlertCredentialError(json.detail, navigation);
        }
      } else {
        for (let i = 0; i < json.data.length; i++) {
          if (json.data[i].id == PackingExpenseId) {
            setis_twowheeler(json.data[i].twowheelertrans.name);
            setis_twowheeler_id(json.data[i].twowheelertrans.value);
            setis_household(json.data[i].hhgoodstrans.name);
            setis_household_id(json.data[i].hhgoodstrans.value);
            settwowheelerby(json.data[i].transtwowheelerby.name);
            settwowheelerby_id(json.data[i].transtwowheelerby.value);
            setvendorname(json.data[i].vendorname);
            setvendorcode(json.data[i].vendorcode);
            settotaldistance(json.data[i].totaldisttrans + "");
            sethillyterraindistance(json.data[i].distinhilly + "");
            settonnageofhousehold(json.data[i].tonnagehhgood + "");
            sethouseholdbillamount(json.data[i].billedamthhgoodstrans + "");
            seteligibletransportation(json.data[i].eligtransamt + "");
            settransportationcharge(json.data[i].transchargesvehicle + "");
            setis_driver(json.data[i].vehicletransbydriver.name);
            setis_driver_id(json.data[i].vehicletransbydriver.value);
            settraveltime(json.data[i].traveltime + "");
            setnoofdaysengaged(json.data[i].daysdrivereng + "");
            setdriverbattas(json.data[i].driverbatta + "");
            setoctroicharges(json.data[i].octroivehicle + "");
            setbreakupcharges(json.data[i].breakagecharges + "");
            sethave_receipt(json.data[i].receipt_loss.name);
            sethave_receipt_id(json.data[i].receipt_loss.value);
            seteligiblebreakupcharges(json.data[i].eligbreakagecharge + "");
            settotaleligibleamount(json.data[i].eligibleamount + "");
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
            setrequestercomment(json.requestercomment);
            setclaimamount(json.data[i].claimedamount + "");
            setProgressBar(false);

            break;
          }
        }
      }
    } catch (error) {
      setProgressBar(false);
    }
  }

  

  function validation() {
    if (twowheelerby == "") {
      Alert.alert("Choose Transport by");
      return;
    }
    if (vendorname == "") {
      Alert.alert("Enter Vendor Name");
      return;
    }
    if (vendorcode == "") {
      Alert.alert("Enter Vendor Code");
      return;
    }
    if (totaldistance == "") {
      Alert.alert("Enter Total Distance");
      return;
    }
    if (hillyterraindistance == "") {
      Alert.alert("Enter Distance in Hilly Terrain");
      return;
    }
    if (tonnageofhousehold == "") {
      Alert.alert("Enter Tonnage of Household Goods");
      return;
    }
    if (parseInt(is_household_id) == 1 && householdbillamount == "") {
      Alert.alert("Enter Billed Amount of Household Transport");
      return;
    }
    if (parseInt(is_twowheeler_id) == 1 && transportationcharge == "") {
      Alert.alert("Enter Transportation Charges for vehicle");
      return;
    }
    if (traveltime == "") {
      Alert.alert("Enter Travel Time");
      return;
    }
    if (noofdaysengaged == "") {
      Alert.alert("Enter No of Days Driver Engaged");
      return;
    }
    if (octroicharges == "") {
      Alert.alert("Enter Octroi Charges for transport Vehicle");
      return;
    }
    if (breakupcharges == "") {
      Alert.alert("Enter Breakup Charges");
      return;
    }
    if (claimamount == "") {
      Alert.alert("Enter Claim Amount");
      return;
    }
    if (diverbattas == "") {
      Alert.alert("Enter Driver Batta");
      return;
    }
    if (octroicharges == "") {
      Alert.alert("Enter Octroi Batta");
      return;
    }
    if (parseInt(totaldistance) < parseInt(hillyterraindistance)) {
      Alert.alert("Check Total Distance");
      return;
    }
    if (is_driver_id == 1) {
      if (noofdaysengaged == "" || noofdaysengaged == "0") {
        Alert.alert("Check  Number of days driver Engaged");
        return;
      }
    } else if (is_driver_id == 0 && noofdaysengaged != "") {
      if (noofdaysengaged != "0") {
        Alert.alert("Check Valid Number of days driver Engaged");
        return;
      }
    }
    if (parseInt(is_twowheeler_id) == 1) {
      if (
        transportationcharge == "" ||
        transportationcharge == "1" ||
        transportationcharge == "0"
      ) {
        Alert.alert("Enter Valid Transportation Charge");
        return;
      }
    } else if (parseInt(is_twowheeler_id) == 0 && transportationcharge != "") {
      if (transportationcharge != "0") {
        Alert.alert("Enter Valid Transportation Charge");
        return;
      }
    }
    if (parseInt(is_household_id) == 1) {
      if (householdbillamount == "" || householdbillamount == "0") {
        Alert.alert("Enter Valid household bill amount");
        return;
      }
    } else if (parseInt(is_household_id) == 0 && householdbillamount != "") {
      if (householdbillamount != "0") {
        Alert.alert("Enter Valid household bill amount");
        return;
      }
    }

    PackagingExpensePost();
  }
  async function PackagingExpensePost() {
    setProgressBar(true);
    let jsonobject;
    let obj;
    obj = {
      tourgid: TourId,
      expense_id: 7,
      claimedamount: parseInt(claimamount),
      requestercomment: requestercomment,
      twowheelertrans: parseInt(is_twowheeler_id),
      hhgoodstrans: parseInt(is_household_id),
      transtwowheelerby: parseInt(twowheelerby_id),
      ibaappvendor: vendorname,
      totaldisttrans: parseInt(totaldistance),
      distinhilly: parseInt(hillyterraindistance),
      driverbatta: parseInt(diverbattas),
      tonnagehhgood: parseInt(tonnageofhousehold),
      maxeligton: parseInt(eligibletonnage),
      eligtransamt: parseFloat(eligibletransportation),
      maxeligibletonnage: parseFloat(eligibletonnage) + "",
      vehicletransbydriver: parseInt(is_driver_id),
      traveltime: parseInt(traveltime),
      octroivehicle: parseInt(octroicharges),
      breakagecharges: parseInt(breakupcharges),
      receipt_loss: have_receipt_id,
      eligbreakagecharge: parseFloat(eligiblebreakupcharges),
      eligibleamount: parseFloat(totaleligibleamount),
      vendorname: vendorname,
      vendortype: "",
      vendorcode: vendorcode,
      vendorgstno: vendor_gstno,
      approvedamount: 0,
      hsncode: HSN_number,
    };

    if (householdbillamount == "") {
      obj["billedamthhgoodstrans"] = 0;
    } else {
      obj["billedamthhgoodstrans"] = parseInt(householdbillamount);
    }

    if (transportationcharge == "") {
      obj["transchargesvehicle"] = 0;
    } else {
      obj["transchargesvehicle"] = parseInt(transportationcharge);
    }

    if (noofdaysengaged == "") {
      obj["daysdrivereng"] = 0;
    } else {
      obj["daysdrivereng"] = parseInt(noofdaysengaged);
    }

    if (bank_gstno == "") {
      obj["bankgstno"] = "0";
    } else {
      obj["bankgstno"] = parseInt(bank_gstno);
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
    console.log(JSON.stringify(jsonobject) + "Packaging Expense Post");

    try {
      const response = await fetch(URL.PACKAGING, {
        method: "POST",
        body: JSON.stringify(jsonobject),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();
      console.log(JSON.stringify(json) + "Packaging Expense");

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
          <DropDown
            label="Two Wheeler Transport*"
            hint="Two Wheeler Transport"
            indata={is_twowheeler}
            ontouch={() => {
              if (editable) {
                setis_twowheeler_dstatus(!is_twowheeler_dstatus);
              }
            }}
          ></DropDown>
          {is_twowheeler_dstatus && (
            <DropDownDialog
              dialogstatus={is_twowheeler_dstatus}
              data={yesornodata}
              Tittle="Two Wheeler Transport"
              setdata={setis_twowheeler}
              setdialogstatus={setis_household_dstatus}
              setid={setis_twowheeler_id}
              from="0"
            ></DropDownDialog>
          )}

          <DropDown
            label="Household Goods Transport*"
            hint="Household Goods Transport"
            indata={is_household}
            ontouch={() => {
              if (editable) {
                setis_household_dstatus(!is_household_dstatus);
              }
            }}
          ></DropDown>
          {is_household_dstatus && (
            <DropDownDialog
              dialogstatus={is_household_dstatus}
              data={yesornodata}
              Tittle="Household Goods Transport"
              setdata={setis_household}
              setdialogstatus={setis_household_dstatus}
              setid={setis_household_id}
              from="0"
            ></DropDownDialog>
          )}
          <DropDown
            label="TransportTwo Wheeler by*"
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
              Tittle="Transport by"
              setdata={settwowheelerby}
              setdialogstatus={settwowheelerstatus}
              setid={settwowheelerby_id}
              from="0"
            ></DropDownDialog>
          )}

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
            label="Vendor Code*:"
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
              setfirst(false);
            }}
          ></InputNumberrow>
          <InputNumberrow
            label="Distance in Hilly Terrain* :"
            hint="Distance(KM)"
            editable={editable}
            value={hillyterraindistance}
            onChangeEvent={(updated) => {
              sethillyterraindistance(updated);
              setfirst(false);
            }}
          ></InputNumberrow>
          <InputNumberrow
            label="Tonnage of Household Goods* :"
            hint="Tonnage of Household Goods"
            editable={editable}
            value={tonnageofhousehold}
            onChangeEvent={(updated) => {
              settonnageofhousehold(updated);
              setfirst(false);
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
            value={eligibletransportation}
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
          <DropDown
            label="Vehicle Transport By Driver:*"
            hint="Vehicle Transport By Driver:"
            indata={is_driver}
            ontouch={() => {
              if (editable) {
                setis_driver_dstatus(!is_driver_dstatus);
              }
            }}
          ></DropDown>
          {is_driver_dstatus && (
            <DropDownDialog
              dialogstatus={is_driver_dstatus}
              data={yesornodata}
              Tittle="Transport By Driver"
              setdata={setis_driver}
              setdialogstatus={setis_driver_dstatus}
              setid={setis_driver_id}
              from="0"
            ></DropDownDialog>
          )}

          <InputNumberrow
            label="Travel Time in Hours(HH)* :"
            hint="Travel Time in Hours(HH)"
            editable={editable}
            value={traveltime}
            onChangeEvent={(updated) => {
              settraveltime(updated);
              setfirst(false);
            }}
          ></InputNumberrow>
          <InputNumberrow
            label="No of Days Driver Engaged* :"
            hint="No of Days Driver Engaged"
            editable={editable}
            value={noofdaysengaged}
            onChangeEvent={(updated) => {
              setnoofdaysengaged(updated);
            }}
          ></InputNumberrow>

          <LabelTextColumnView
            label="Driver Battas:"
            hint="Driver Battas"
            value={diverbattas}
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
          <DropDown
            label="Recipt for Losses Due to Damage Produced:*"
            hint="Recipt for Losses Due to Damage Produced:"
            indata={have_receipt}
            ontouch={() => {
              if (editable) {
                sethave_receipt_dstatus(!have_receipt_dstatus);
              }
            }}
          ></DropDown>
          {have_receipt_dstatus && (
            <DropDownDialog
              dialogstatus={have_receipt_dstatus}
              data={yesornodata}
              Tittle="Have Receipt"
              setdata={sethave_receipt}
              setdialogstatus={sethave_receipt_dstatus}
              setid={sethave_receipt_id}
              from="0"
            ></DropDownDialog>
          )}

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
