import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import SubmitButton from "../../components/ui/SubmitButton";
import InputNumberrow from "../../components/ui/InputNumberrow";
import DropDown from "../../components/ui/DropDown";
import DropDownDialog from "../../components/dialog/DropDownDialog";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import SearchDialog from "../../components/dialog/SearchDialog";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

export default function ExpenseAddCCbs({ route }) {
  const claimamount = route.params.claimamount;
  const TourId = route.params.TourId;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  const ReqDate = route.params.ReqDate;
  const empid = route.params.empid;
  const onbehalf = route.params.onbehalf;
  const filemandatory = route.params.filemandatory;
  const [getbs, setbs] = useState("");
  const [getbsdialogstatus, setbsdialogstatus] = useState(false);
  const [getccdialogstatus, setccdialogstatus] = useState(false);
  const [getcc, setcc] = useState("");
  const [getamount, setamount] = useState("");
  const [getpercentage, setpercentage] = useState("");
  const [getbsid, setbsid] = useState("");
  const [getccid, setccid] = useState("");
  const [getlist, setlist] = useState([]);
  const [getccdata, setccdata] = useState([]);
  const [first, setfirst] = useState(true);
  const [second, setsecond] = useState(true);

  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "CCBS",
    });
  }, []);

  useEffect(() => {
    if ("data" in route.params) {
      for (let i = 0; i < route.params.data.length; i++) {
        if (route.params.id == route.params.data[i].id) {
          setbs(route.params.data[i].bs);
          setcc(route.params.data[i].cc);
          setpercentage(route.params.data[i].percentage+"");
          setamount(route.params.data[i].getamount + "");
          setbsid(route.params.data[i].bsid);
          setccid(route.params.data[i].ccid);
        }
      }
    }
  }, [route]);

  useEffect(() => {
    setsecond(true);
    if (!first) {
      if (getamount != "") {
        setpercentage(
          ((parseFloat(getamount) / parseFloat(claimamount)) * 100).toFixed(2) +
            ""
        );
        if (parseFloat(getamount) > parseFloat(claimamount)) {
          Alert.alert("Check Expense Amount");
        }
      } else {
        setpercentage("");
      }
    }
  }, [getamount, first]);

  useEffect(() => {
    console.log("Anbu");
    setfirst(true);
    if (!second) {
      if (getpercentage != "") {
        console.log(getpercentage);
        setamount(
          ((parseFloat(getpercentage) / 100) * parseFloat(claimamount)).toFixed(
            2
          ) + ""
        );
        if (parseInt(getpercentage) > 100) {
          Alert.alert("Check Expense Amount");
        }
      } else {
        setamount("");
      }
    }
  }, [getpercentage, second]);

  useEffect(() => {
    if (getlist.length != 0) {
      navigation.navigate("AddCCBS", {
        list: getlist,
        TourId: TourId,
        FromDate: FromDate,
        ToDate: ToDate,
        ReqDate: ReqDate,
        claimamount: claimamount,
        empid: empid,
        onbehalf: onbehalf,
        filemandatory : filemandatory
      });
    }
  }, [getlist]);
  useEffect(() => {
    if (getbsid != "") {
      getdata();
    }
  }, [getbsid]);

  async function getdata() {
    try {
      let ccarray = [];
      let obj;
      const response = await fetch(URL.CC_GET + getbsid, {
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
        for (let i = 0; i < json.data.length; i++) {
          obj = {
            name: json.data[i].name,
            id: json.data[i].id,
            code: json.data[i].code,
            no: json.data[i].no,
          };
          ccarray.push(obj);
        }
        setccdata(ccarray);
      }
    } catch (error) {}
  }
  function validation() {
    if (getbs != "") {
      if (getcc != "") {
        if (getamount != "") {
          if (parseInt(getamount) <= parseInt(claimamount)) {
            listcreation();
          } else {
            Alert.alert("Enter Valid Amount");
          }
        } else {
          Alert.alert("Enter a Amount");
        }
      } else {
        Alert.alert("Choose CC");
      }
    } else {
      Alert.alert("Choose BS");
    }
  }

  function listcreation() {
    let obj;
    if ("id" in route.params) {
      for (obj of route.params.data) {
        if (obj.id == route.params.id) {
          obj.bs = getbs;
          obj.cc = getcc;
          obj.getamount = getamount;
          obj.claimamount = claimamount;
          obj.percentage = getpercentage;
          obj.bsid = getbsid;
          obj.ccid = getccid;
        }
      }
    } else {
      obj = {
        bs: getbs,
        cc: getcc,
        getamount: getamount,
        claimamount: claimamount,
        percentage: getpercentage,
        id:
          Math.floor(Math.random() * 100) +
          1 +
          "" +
          Math.floor(Math.random() * 100) +
          1,
        bsid: getbsid,
        ccid: getccid,
        TourId: TourId,
        FromDate: FromDate,
        ToDate: ToDate,
        ReqDate: ReqDate,
      };
    }

    setlist([obj]);
  }

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset="35"
      style={styles.safeAreaView}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      >
        <View style={styles.row}>
          <Text style={styles.text}>Requested Amount : Rs.{claimamount}</Text>
        </View>
        <DropDown
          label="BS*"
          hint="bs"
          indata={getbs}
          ontouch={() => {
            setbsdialogstatus(!getbsdialogstatus);
          }}
        ></DropDown>

        {getbsdialogstatus && (
          <SearchDialog
            dialogstatus={getbsdialogstatus}
            setValue={setbs}
            setId={setbsid}
            setdialogstatus={setbsdialogstatus}
            from="BS"
          />
        )}
        <DropDown
          label="CC*"
          hint="cc"
          indata={getcc}
          ontouch={() => {
            if (getbs != "") {
              setccdialogstatus(!getccdialogstatus);
            } else {
              Alert.alert("Choose BS");
            }
          }}
        ></DropDown>
        {getccdialogstatus && (
          <DropDownDialog
            dialogstatus={getccdialogstatus}
            data={getccdata}
            Tittle="CC"
            setdata={setcc}
            setid={setccid}
            from="CC"
            setdialogstatus={setccdialogstatus}
          ></DropDownDialog>
        )}
        <InputNumberrow
          label="Amount* :"
          hint="Amount"
          value={getamount}
          editable={true}
          onChangeEvent={(updated) => {
            setamount(updated);
            setfirst(false);
          }}
        ></InputNumberrow>
        <InputNumberrow
          label="Percentage* :"
          hint="Percentage"
          editable={true}
          value={getpercentage}
          onChangeEvent={(updated) => {
            setpercentage(updated);
            setsecond(false);
          }}
        ></InputNumberrow>
      </ScrollView>
      <View>
        <SubmitButton onPressEvent={validation}>Confirm</SubmitButton>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    marginTop: "4%",
    marginLeft: "4%",
    marginRight: "4%",
  },
  rowcontainer: {
    flexDirection: "row",
    padding: 2,
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  text: {
    fontWeight: "bold",
    color: "black",
    fontSize: 15,
  },
});
