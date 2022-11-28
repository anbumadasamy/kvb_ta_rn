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
import Datepicker from "../../components/ui/datepicker";
import Dateview from "../../components/ui/Dateview";
import SubmitButton from "../../components/ui/SubmitButton";
import InputNumberrow from "../../components/ui/InputNumberrow";
import DropDown from "../../components/ui/DropDown";
import DropDownDialog from "../../components/dialog/DropDownDialog";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import ReimbursementCommentBox from "../../components/ui/ReimbursementCommentBox";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

export default function LocalConveyance({ route }) {
  const TourId = route.params.TourId;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  const ReqDate = route.params.ReqDate;
  let jsonobject;
  let LocalConveyanceId = route.params.LocalConveyanceId;
  const [first, setfirst] = useState(true);
  const [progressBar, setProgressBar] = useState(true);
  const [pickerstatus, setpickerstatus] = useState(false);
  const [dialogstatus, setdialogstatus] = useState(false);
  const [subcategory, setsubcategory] = useState("");
  const [billno, setbillno] = useState("");
  const [selectedDate, setselecteddate] = useState("Start Date");
  const [jsondate, setjsondate] = useState("");
  const [fromplace, setfromplace] = useState("");
  const [toplace, settoplace] = useState("");
  const [distance, setdistance] = useState("");
  const [claimamount, setclaimamount] = useState("");
  const [remarks, setremarks] = useState("");
  const [eligibleamount, seteligibleamount] = useState("");
  const [requestercomment, setrequestercomment] = useState("");
  const [subcategorydata, setsubcategorydata] = useState();
  const authCtx = useContext(AuthContext);
  const [remarkslabel, setremarkslabel] = useState("Remarks :");
  const [editable, seteditable] = useState(true);

  const navigation = useNavigation();
  useEffect(() => {
    if (LocalConveyanceId != "") {
      get();
    } else {
      setrequestercomment(route.params.Comments);
      setProgressBar(false);
    }
  }, [LocalConveyanceId]);

  useEffect(() => {
    if (route.params.from == "Approver") {
      seteditable(false);
    } else {
      seteditable(true);
    }
  }, [route]);

  useEffect(() => {
    eligibleamountvalidation();
  }, [distance, subcategory]);

  useEffect(() => {
    if (
      subcategory == "Personal vehicle Scooter" ||
      subcategory == "Personal vehicle car"
    ) {
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
    } else {
      seteligibleamount("");
    }
  }, [claimamount, eligibleamount]);

  function eligibleamountvalidation() {
    if (
      (subcategory == "Personal vehicle Scooter" ||
        subcategory == "Personal vehicle car") &&
      distance != ""
    ) {
      EligibleAmountCalculation();
    }
  }

  async function get() {
    setProgressBar(true);
    try {
      const response = await fetch(URL.LOCAL_CONVEYANCE + "/tour/" + TourId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      console.log(JSON.stringify(json) + "Local COnveyance");
      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      } else {
        for (let i = 0; i < json.data.length; i++) {
          if (json.data[i].id == LocalConveyanceId) {
            let uniqdate = json.data[i].fromdate.split("-");

            setjsondate(
              moment(
                new Date(uniqdate[1] + " " + uniqdate[0] + ", " + uniqdate[2])
              ).format("YYYY-MM-DD")
            );
            setselecteddate(
              moment(
                new Date(uniqdate[1] + " " + uniqdate[0] + ", " + uniqdate[2])
              ).format("DD-MM-YYYY")
            );

            setfromplace(json.data[i].fromplace);
            settoplace(json.data[i].toplace);
            setsubcategory(json.data[i].modeoftravel);
            setdistance(json.data[i].distance);
            setbillno(json.data[i].billno);
            setclaimamount(json.data[i].claimedamount + "");
            setremarks(json.data[i].remarks);
            seteligibleamount(json.data[i].eligibleamount);
            setrequestercomment(json.requestercomment);
            setProgressBar(false);
            break;
          }
        }
      }
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
    }
  }
  async function getdata() {
    try {
      let subcategoryarray = [];

      const response = await fetch(URL.COMMON_DROPDOWN + "mode_of_travel", {
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
  function validation() {
    if (fromplace != "") {
      if (toplace != "") {
        if (subcategory != "") {
          if (jsondate != "") {
            if (distance != "") {
              if (claimamount != "") {
                if (parseInt(eligibleamount) < parseInt(claimamount)) {
                  if (remarks != "") {
                    LocalConveyancePost();
                  } else {
                    Alert.alert("Enter a Valid Remarks");
                  }
                } else {
                  LocalConveyancePost();
                }
              } else {
                Alert.alert("Enter a Claimamount");
              }
            } else {
              Alert.alert("Enter a Distance");
            }
          } else {
            Alert.alert("Select a Date");
          }
        } else {
          Alert.alert("Choose Mode of Travel");
        }
      } else {
        Alert.alert("Enter To Place");
      }
    } else {
      Alert.alert("Enter From Place");
    }
  }
  async function EligibleAmountCalculation() {
    let eligible = {
      expensegid: 4,
      modeoftravel: subcategory,
      distance: parseInt(distance),
    };
    try {
      const response = await fetch(URL.LOCAL_CONVEYANCE_ELIGIBLE_AMOUNT, {
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
        seteligibleamount(json.Eligible_amount);
      }
    } catch (error) {}
  }

  async function LocalConveyancePost() {
    setProgressBar(true);
    let obj;

    obj = {
      tour_id: TourId,
      expensegid: 4,
      fromplace: fromplace,
      toplace: toplace,
      fromdate: jsondate,
      modeoftravel: subcategory,
      distance: distance,
      billno: billno,
      remarks: remarks,
      mobile: 1,
      requestercomment: requestercomment,
      eligibleamount: eligibleamount,
      claimedamount: parseInt(claimamount),
    };
    if (LocalConveyanceId != "") {
      obj["id"] = LocalConveyanceId;
      jsonobject = {
        data: [obj],
      };
    } else {
      jsonobject = {
        data: [obj],
      };
    }

    console.log(JSON.stringify(obj) + "Local Conveyance Post");

    try {
      const response = await fetch(URL.LOCAL_CONVEYANCE, {
        method: "POST",
        body: JSON.stringify(jsonobject),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      console.log(JSON.stringify(json) + "Local Conveyance JSon Data");

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

  useEffect(() => {
    navigation.setOptions({
      title: "Local Conveyance",
    });
    getdata();
  }, []);

  const onStartDateChange = (selectedDate) => {
    setpickerstatus(false);
    setjsondate(moment(selectedDate).format("YYYY-MM-DD"));
    setselecteddate(moment(selectedDate).format("DD-MM-YYYY"));
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
          <Inputtextrow
            label="From Place* :"
            hint="From Place"
            editable={editable}
            value={fromplace}
            onChangeEvent={(updated) => {
              setfromplace(updated);
            }}
          ></Inputtextrow>
          <Inputtextrow
            label="To Place* :"
            hint="To Place"
            editable={editable}
            value={toplace}
            onChangeEvent={(updated) => {
              settoplace(updated);
            }}
          ></Inputtextrow>
          <Datepicker
            onPressStart={() => {
              if (editable) {
                setpickerstatus(!pickerstatus);
              }
            }}
            startDate={selectedDate}
            initial="Start Date"
          ></Datepicker>
          <DateTimePickerModal
            isVisible={pickerstatus}
            mode="date"
            onConfirm={onStartDateChange}
            onCancel={() => {
              setpickerstatus(false);
            }}
            display={Platform.OS == "ios" ? "inline" : "default"}
            maximumDate={new Date(ToDate)}
            minimumDate={new Date(FromDate)}
          />

          <DropDown
            label="Sub category *"
            hint="Mode of Travel"
            indata={subcategory}
            ontouch={() => {
              if (editable) {
                setdialogstatus(!dialogstatus);
              }
            }}
          ></DropDown>
          {dialogstatus && (
            <DropDownDialog
              dialogstatus={dialogstatus}
              data={subcategorydata}
              Tittle="Mode of Travel"
              setdata={setsubcategory}
              setdialogstatus={setdialogstatus}
              clicked={() => {
                setfirst(false);
              }}
            ></DropDownDialog>
          )}
          <InputNumberrow
            label="Distance in KM* : "
            hint="Distance in KM"
            value={distance}
            editable={editable}
            onChangeEvent={(updated) => {
              setdistance(updated);
              setfirst(false);
            }}
          ></InputNumberrow>
          <Inputtextrow
            label="Bill Number :"
            hint="Bill No"
            value={billno}
            editable={editable}
            onChangeEvent={(updated) => {
              setbillno(updated);
            }}
          ></Inputtextrow>
          <InputNumberrow
            label="Claim Amount* :"
            hint="Claim Amount"
            value={claimamount}
            editable={editable}
            onChangeEvent={(updated) => {
              setclaimamount(updated);
            }}
          ></InputNumberrow>
          <ReimbursementCommentBox
            label={remarkslabel}
            inputComment={remarks}
            editable={editable}
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
