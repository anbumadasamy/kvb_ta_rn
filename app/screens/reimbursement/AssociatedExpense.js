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
  KeyboardAvoidingView
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
import moment from "moment";
import { CustomColors } from "../../utilities/CustomColors";
import ReimbursementCommentBox from "../../components/ui/ReimbursementCommentBox";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

export default function AssociatedExpenses({ route }) {
  const TourId = route.params.TourId;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  const ReqDate = route.params.ReqDate;
  const [progressBar, setProgressBar] = useState(true);
  let jsonobject;
  let AssociatedExpensesId = route.params.AssociatedExpensesId;
  const [pickerstatus, setpickerstatus] = useState(false);
  const [selectedDate, setselecteddate] = useState("Start Date");
  const [dialogstatus, setdialogstatus] = useState(false);
  const [subcategory, setsubcategory] = useState("");
  const [claimamount, setclaimamount] = useState("");
  const [billno, setbillno] = useState("");
  const [remarks, setremarks] = useState("");
  const [jsondate, setjsondate] = useState("");
  const [requestercomment, setrequestercomment] = useState("");
  const [editable, seteditable] = useState(true);
  const [subcategorydata, setsubcategorydata] = useState();
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  let tempFromDate = new Date(FromDate);
  let tempToDate = new Date(ToDate);
  let fDate = tempFromDate.getTime();
  let tdate = tempToDate.getTime();
  let Difference_In_Days;
  if (tdate > fDate) {
    Difference_In_Days = (tdate - fDate) / (1000 * 3600 * 24) + 1;
  } else {
    Difference_In_Days = 0;
  }

  useEffect(() => {
    if (AssociatedExpensesId != "") {
      get();
    } else {
      setProgressBar(false);
      setrequestercomment(route.params.Comments);
    }
  }, [AssociatedExpensesId]);

  useEffect(() => {
    if (route.params.from == "Approver") {
      seteditable(false);
    } else {
      seteditable(true);
    }
  }, [route]);

  async function get() {
    setProgressBar(true);
    try {
      const response = await fetch(
        URL.ASSOCIATED_EXPENSES + "/tour/" + TourId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.auth_token,
          },
        }
      );
      let json = await response.json();

      console.log(JSON.stringify(json)+"Assosiated Expense")
      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }
      else{
     

      for (let i = 0; i < json.data.length; i++) {
        if (json.data[i].id == AssociatedExpensesId) {
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

          setsubcategory(json.data[i].expense);
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

  function validation() {
    if (jsondate != "") {
      if (subcategory != "") {
        if (billno != "") {
          if (claimamount != "") {
            AssosiateExpensePost();
          } else {
            Alert.alert("Enter claimamount ");
          }
        } else {
          Alert.alert("Enter Bill Number");
        }
      } else {
        Alert.alert("Choose Sub Category");
      }
    } else {
      Alert.alert("Choose Date");
    }
  }

  async function AssosiateExpensePost() {
    setProgressBar(true)
    let obj;
    obj = {
      tour_id: TourId,
      expensegid: 9,
      expense: subcategory,
      remarks: remarks,
      fromdate: jsondate,
      mobile: 1,
      billno: billno,
      claimedamount: parseInt(claimamount),
      requestercomment: requestercomment,
      approvedamount: parseInt(claimamount),
    };

    if (AssociatedExpensesId != "") {
      obj["id"] = AssociatedExpensesId;
      jsonobject = JSON.stringify({
        data: [obj],
      });
    } else {
      jsonobject = JSON.stringify({
        data: [obj],
      });
    }
    console.log(JSON.stringify(obj)+" Object")
 
    try {
      const response = await fetch(URL.ASSOCIATED_EXPENSES, {
        method: "POST",
        body: jsonobject,
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
     

      let json = await response.json();

      console.log(JSON.stringify(json)+"Api Response")

      

      if (json) {
        setProgressBar(false)
        if ("detail" in json) {
          if(json.detail == "Invalid credentials/token."){
          AlertCredentialError(json.detail, navigation);
          }
        }
        if (json.message) {
          ToastMessage(json.message)  
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

  async function getdata() {
    try {
      let subcategoryarray = [];
      const response = await fetch(URL.COMMON_DROPDOWN + "ascte_exp", {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      for (let i = 0; i < json.length; i++) {
        let obj;

        if (Difference_In_Days < 5) {
          if (json[i].value != "Lauary charges") {
            obj = {
              id: json[i].value,
              name: json[i].name,
            };
          }
        } else {
          obj = {
            id: json[i].value,
            name: json[i].name,
          };
        }

        if (obj != null) {
          subcategoryarray.push(obj);
        }
      }
      setsubcategorydata(subcategoryarray);
    } catch (error) {
     
    }
  }

  useEffect(() => {
    navigation.setOptions({
      title: "Associated Expenses",
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
    keyboardVerticalOffset="35" style={styles.safeAreaView}>
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
            label="Sub category*"
            hint="Sub category"
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
              Tittle="Sub Category"
              setdata={setsubcategory}
              setdialogstatus={setdialogstatus}
            ></DropDownDialog>
          )}

          <Inputtextrow
            label="Bill Number* :"
            hint="Bill No"
            editable={editable}
            value={billno}
            onChangeEvent={(updated) => {
              setbillno(updated);
            }}
          ></Inputtextrow>
          <InputNumberrow
            label="Claim Amount*"
            hint="Claim Amount"
            editable={editable}
            value={claimamount}
            onChangeEvent={(updated) => {
              setclaimamount(updated);
            }}
          ></InputNumberrow>
          <ReimbursementCommentBox
            label="Remarks :"
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
