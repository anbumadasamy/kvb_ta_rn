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
import DropDown from "../../components/ui/DropDown";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";
import DropDownDialog from "../../components/dialog/DropDownDialog";
import Inputtextrow from "../../components/ui/inputtextrow";

export default function MiscExpenses({ route }) {
  const TourId = route.params.TourId;
  const ReqDate = route.params.ReqDate;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  let MiscId = route.params.MiscId;

  // let list = route.params.Data;
  let jsonobject;
  let obj;

  const [description, setdescription] = useState("");
  const [expensereason, setexpensereason] = useState("");
  const [expensereasondata, setexpensereasondata] = useState("");
  const [amount, setamount] = useState("");
  const [expensereasonvalue, setexpensereasonvalue] = useState("");
  const [dialogstatus, setdialogstatus] = useState(false);
  const [requestercomment, setrequestercomment] = useState("");
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [progressBar, setProgressBar] = useState(true);
  const [editable, seteditable] = useState(true);


 

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

 
  async function getdata() {
    try {
      let subcategoryarray = [];
      const response = await fetch(URL.COMMON_DROPDOWN + "misc_res", {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      console.log(JSON.stringify(json) + " Expense Response");

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
        setexpensereasondata(subcategoryarray);
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (MiscId != "") {
      get();
    } else {
      setrequestercomment(route.params.Comments);
      setProgressBar(false);
    }
  }, [MiscId]);

  function validation() {
    if (description == "") {
      Alert.alert("Enter Description");
      return;
    }
    if (expensereason == "") {
      Alert.alert("Choose Expense Reason");
      return;
    }
    if (amount == "") {
      Alert.alert("Enter Total Billed Amount");
      return;
    }

    MiscExpensePost();
  }

  function MiscExpensePost() {
    obj = {
      tourgid: TourId,
      expense_id: 6,
      requestercomment: requestercomment,
      description: description,
      expreason: expensereasonvalue,
      approvedamount: parseInt(amount),
      claimedamount: parseInt(amount),
      mobile: 1,
    };

    console.log(JSON.stringify(obj) + " object");

    if (MiscId != "") {
      obj["id"] = MiscId;
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
    console.log(URL.MISC + " miscelleneous Url");
    try {
      const response = await fetch(URL.MISC, {
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
      const response = await fetch(URL.MISC + "/tour/" + TourId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();
      console.log(JSON.stringify(json) + " Misc Expense Data");

      if (response.status == 403) {
        AlertCredentialError(json.detail, navigation);
        return;
      }

      for (let i = 0; i < json.data.length; i++) {
        if (json.data[i].id == MiscId) {
          setdescription(json.data[i].description);
          setexpensereason(json.data[i].expreason.name);
          setexpensereasonvalue(json.data[i].expreason.value);
          setamount(json.data[i].claimedamount + "");
          setrequestercomment(json.requestercomment)
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
          <Inputtextrow
            label="Description* :"
            hint="Description"
            editable={editable}
            value={description}
            onChangeEvent={(updated) => {
              if (editable) {
                setdescription(updated);
              }
            }}
          ></Inputtextrow>

          <DropDown
            label="Expense Reason*"
            hint="Expense Reason"
            indata={expensereason}
            ontouch={() => {
              if (editable) {
                setdialogstatus(!dialogstatus);
               
              }
            }}
          ></DropDown>

          {dialogstatus && (
            <DropDownDialog
              dialogstatus={dialogstatus}
              data={expensereasondata}
              Tittle="Expense Reason"
              setdata={setexpensereason}
              setid={setexpensereasonvalue}
              setdialogstatus={setdialogstatus}
              from="Misc"
              
            />
          )}

          <InputNumberrow
            label="Total Billed Amount* :"
            hint="Total Billed Amount"
            value={amount}
            editable={editable}
            onChangeEvent={(updated) => {
              if (editable) {
                setamount(updated);
              }
            }}
          ></InputNumberrow>
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
