import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
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
import { CustomColors } from "../../utilities/CustomColors";
import moment from "moment";
import LabelTextColumnView from "../../components/ui/LabelTextColumnView";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";
import DropDownDialog from "../../components/dialog/DropDownDialog";

export default function IncidentialExpenses({ route }) {
  const TourId = route.params.TourId;
  const ReqDate = route.params.ReqDate;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  let IncidentialExpenseId = route.params.IncidentialExpenseId;

  // let list = route.params.Data;
  let jsonobject;
  let obj;
  let eligible;
  const [sdreturn, setsdreturn] = useState(false);
  const [motravel, setmotravel] = useState("");
  const [traveltime, settraveltime] = useState("");
  const [single_fare, setsingle_fare] = useState("");
  const [incidentialexpense, setincidentialexpense] = useState("");
  const [dialogstatus, setdialogstatus] = useState(false);
  const [modeoftraveldata, setmodeoftraveldata] = useState("");
  const [requestercomment, setrequestercomment] = useState("");
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [progressBar, setProgressBar] = useState(true);
  const [editable, seteditable] = useState(true);
  const [first, setfirst] = useState(true);

  const onPressdreturn = (radioButtonsArray) => {
    setsdreturn(radioButtonsArray[0].selected);
  };

  

  useEffect(() => {
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


    if (!first) {

      if (single_fare != "" && traveltime != "" && motravel != "") {
        EligibleAmountCalculation();
      }
    } 

  }, [single_fare, traveltime, motravel, sdreturn, first]);
 

  async function EligibleAmountCalculation() {
    eligible = {
      expenseid: 3,
      travel_mode: motravel,
      travel_hours: traveltime,
      single_fare: single_fare,
    };

    if (sdreturn) {
      eligible["same_day_return"] = 1;
    } else {
      eligible["same_day_return"] = 0;
    }

    try {
      const response = await fetch(URL.INCIDENTIAL_ElIGIBLE, {
        method: "POST",
        body: JSON.stringify(eligible),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      console.log(JSON.stringify(json) + " Eligible Amount Data");

      if ("detail" in json) {
        if (json.detail == "Invalid credentials/token.") {
          AlertCredentialError(json.detail, navigation);
          return;
        }
      }

      setincidentialexpense(json.elgibleamount + "");
    } catch (error) {}
  }

  async function getdata() {
    try {
      let subcategoryarray = [];
      const response = await fetch(
        URL.COMMON_DROPDOWN + "incidental_travelmode",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.auth_token,
          },
        }
      );
      let json = await response.json();

      console.log(JSON.stringify(json) + " Travel Mode Json Response");

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
        setmodeoftraveldata(subcategoryarray);
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (IncidentialExpenseId != "") {
      get();
    } else {
      setrequestercomment(route.params.Comments);
      setProgressBar(false);
    }
  }, [IncidentialExpenseId]);

  function validation() {
    if (motravel == "") {
      Alert.alert("Choose Mode of Travel");
      return;
    }
    if (traveltime == "") {
      Alert.alert("Enter Travel Time");
      return;
    }
    if (single_fare == "") {
      Alert.alert("Enter Single Fare");
      return;
    }
    if(sdreturn && traveltime > 24){
      Alert.alert("Enter Valid Travel time");
      return;
    }
    if(!sdreturn && traveltime < 24){
      Alert.alert("Enter Valid Travel time");
      return;
    }
    if (incidentialexpense == "") {
      Alert.alert("Incidential Expense Can't be empty");
      return;
    }

    IncidentialExpensePost();
  }

  function IncidentialExpensePost() {
    obj = {
      tourid: TourId,
      expenseid: 3,
      requestercomment: requestercomment,
      travel_mode: motravel,
      single_fare: parseInt(single_fare),
      travel_hours: parseInt(traveltime),
      amount: parseInt(incidentialexpense),
      mobile: 1,
    };

    if (sdreturn) {
      obj["same_day_return"] = 1;
    } else {
      obj["same_day_return"] = 0;
    }

    if (IncidentialExpenseId != "") {
      obj["id"] = IncidentialExpenseId;
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
      const response = await fetch(URL.INCIDENTIAL, {
        method: "POST",
        body: jsonobject,
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      console.log(JSON.stringify(jsonobject) + " Inciedential Expense Object");

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
      const response = await fetch(URL.INCIDENTIAL + "/tour/" + TourId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();
      console.log(JSON.stringify(json) + " Incidential Expense Data");

      if (response.status == 403) {
        AlertCredentialError(json.detail, navigation);
        return;
      }
     

      for (let i = 0; i < json.data.length; i++) {
        if (json.data[i].id == IncidentialExpenseId) {
          setmotravel(json.data[i].travel_mode.name);
          settraveltime(json.data[i].travel_hours + "");
          setsingle_fare(json.data[i].single_fare + "");
          setincidentialexpense(json.data[i].eligibleamount + "");
          setrequestercomment(json.requestercomment);


          if (json.data[i].same_day_return.value == 1) {
            setsdreturn(true);
          } else {
            setsdreturn(false);
          }

          setProgressBar(false);

          break;
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
            label="Onward and Return journey on same Day :"
            status={sdreturn}
            buttonpressed={onPressdreturn}
          ></CustomizedRadioButton>
          <DropDown
            label="Mode of Travel*"
            hint="Mode of Travel"
            indata={motravel}
            ontouch={() => {
              if (editable) {
                setdialogstatus(!dialogstatus);
                setfirst(false);
              }
            }}
          ></DropDown>

          {dialogstatus && (
            <DropDownDialog
              dialogstatus={dialogstatus}
              data={modeoftraveldata}
              Tittle="Mode Of Travel"
              setdata={setmotravel}
              setdialogstatus={setdialogstatus}
              clicked={() => setfirst(false)}
            />
          )}

          <InputNumberrow
            label="Travel Time in Hours* :"
            hint="Travel Time in Hours"
            value={traveltime}
            editable={editable}
            onChangeEvent={(updated) => {
              settraveltime(updated);
              setfirst(false);
            }}
          ></InputNumberrow>
          <InputNumberrow
            label="Single Fare* :"
            hint="Single Fare"
            value={single_fare}
            editable={editable}
            onChangeEvent={(updated) => {
              setsingle_fare(updated);
              setfirst(false);
            }}
          ></InputNumberrow>

          <LabelTextColumnView
            label="Incidential Expense* :"
            hint="Incidential Expense"
            value={incidentialexpense}
          ></LabelTextColumnView>
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
