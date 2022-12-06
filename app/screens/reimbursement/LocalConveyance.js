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
import Inputtextrow from "../../components/ui/inputtextrow";
import Dateview from "../../components/ui/Dateview";
import SubmitButton from "../../components/ui/SubmitButton";
import InputNumberrow from "../../components/ui/InputNumberrow";
import DropDown from "../../components/ui/DropDown";
import DropDownDialog from "../../components/dialog/DropDownDialog";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import ReimbursementCommentBox from "../../components/ui/ReimbursementCommentBox";
import moment from "moment";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";
import LabelTextColumnView from "../../components/ui/LabelTextColumnView";

export default function LocalConveyance({ route }) {
  const TourId = route.params.TourId;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  const ReqDate = route.params.ReqDate;
  let jsonobject;
  let LocalConveyanceId = route.params.LocalConveyanceId;

  const [first, setfirst] = useState(true);
  const [progressBar, setProgressBar] = useState(true);
  const [motravel, setmotravel] = useState("");
  const [subcategory, setsubcategory] = useState("");
  const [subcategory_id, setsubcategory_id] = useState("");
  const [center, setcenter] = useState("");
  const [centerid, setcenterid] = useState("");
  const [traveldialogstatus, settraveldialogstatus] = useState(false);
  const [subcategorydialogstatus, setsubcategorydialogstatus] = useState(false);
  const [centerdialogstatus, setcenterdialogstatus] = useState(false);
  const [onwardreturnstatus, setonwardreturndialogstatus] = useState(false);
  const [traveldialogdata, settraveldialogdata] = useState("");
  const [subcategorydata, setsubcategorydata] = useState();
  const [centerdialogdata, setcenterdialogdata] = useState("");
  const [onwardreturndata, setonwardreturndata] = useState("");
  const [fromplace, setfromplace] = useState("");
  const [toplace, settoplace] = useState("");
  const [onwardreturn, setonwardreturn] = useState("");
  const [onwardreturn_id, setonwardreturn_id] = useState("");
  const [eligibleamount, seteligibleamount] = useState("");
  const [requestercomment, setrequestercomment] = useState("");
  const [claimamount, setclaimamount] = useState("");
  const [remarks, setremarks] = useState("");
  const authCtx = useContext(AuthContext);
  const [editable, seteditable] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    getdata("conv_travelmode", 0);
    getdata("conv_center", 1);
    getdata("conv_onward", 2);
  }, []);

  useEffect(() => {
    // return () => {
    console.log(motravel + " Motravel");
    if (!first) {
      if (motravel == "Road") {
        getdata("conv_road", 3);
      } else if (motravel == "Train") {
        getdata("conv_train", 3);
      }
    }
    // };
  }, [motravel]);

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
    if (!first) {
      if (center != "") {
        EligibleAmountCalculation();
      }
    }
  }, [center]);

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
          settraveldialogdata(subcategoryarray);
          break;
        case 1:
          setcenterdialogdata(subcategoryarray);
          break;
        case 2:
          setonwardreturndata(subcategoryarray);
          break;
        case 3:
          setsubcategorydata(subcategoryarray);
          break;
      }
    } catch (error) {}
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

      console.log(JSON.stringify(json) + "Local Convryance Data");

      if (response.status == 403) {
        AlertCredentialError(json.detail, navigation);
        return;
      }
     
        for (let i = 0; i < json.data.length; i++) {
          if (json.data[i].id == LocalConveyanceId) {
            setfromplace(json.data[i].fromplace);
            settoplace(json.data[i].toplace);
            setmotravel(json.data[i].modeoftravel.name);
            setsubcategory(json.data[i].modeoftravel.name);
            setsubcategory_id(json.data[i].subcatogory.value);
            setcenter(json.data[i].center.name);
            setcenterid(json.data[i].center.value);
            setonwardreturn(json.data[i].onwardreturn.name);
            setonwardreturn_id(json.data[i].onwardreturn.value);
            seteligibleamount(json.data[i].eligibleamount+"");
            setclaimamount(json.data[i].claimedamount+"")
            setrequestercomment(json.requestercomment);
            setremarks(json.data[i].remarks); 
            setProgressBar(false);
            break;
          } 
      }
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
    }
  }

  function validation() {
    if (fromplace == "") {
      Alert.alert("Enter From Place");
      return;
    }
    if (toplace == "") {
      Alert.alert("Enter To Place");
      return;
    }
    if (motravel == "") {
      Alert.alert("Choose Mode of Travel");
      return;
    }
    if (subcategory == "") {
      Alert.alert("Choose Subcategory");
      return;
    }
    if (center == "") {
      Alert.alert("Choose Center");
      return;
    }
    if (onwardreturn == "") {
      Alert.alert("Choose Onward/Return");
      return;
    }
    if (claimamount == "") {
      Alert.alert("Enter Claimamount");
      return;
    }
    if (remarks == "") {
      Alert.alert("Enter Remarks");
      return;
    }
    LocalConveyancePost();
  }
  async function EligibleAmountCalculation() {
    let eligible = {
      expense_id: 4,
      center: centerid,
      tourgid: TourId,
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
      console.log(JSON.stringify(response) + " eligible object");

      let json = await response.json();
      console.log(JSON.stringify(json) + " EligibleAmount");
      if (response.status == 403) {
        AlertCredentialError(json.detail, navigation);
        return;
      }

      seteligibleamount(json.Eligible_amount + "");
    } catch (error) {}
  }

  async function LocalConveyancePost() {
    setProgressBar(true);
    let obj;

    obj = {
      tourgid: TourId,
      expense_id: 4,
      fromplace: fromplace,
      toplace: toplace,
      modeoftravel: motravel,
      subcatogory: subcategory_id,
      center: centerid,
      remarks: remarks,
      mobile: 1,
      onwardreturn:onwardreturn_id,
      requestercomment: requestercomment,
      approvedamount: parseInt(eligibleamount),
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

  useEffect(() => {
    navigation.setOptions({
      title: "Local Conveyance",
    });
    getdata();
  }, []);



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

          <DropDown
            label="Mode of Travel*"
            hint="Mode of Travel"
            indata={motravel}
            ontouch={() => {
              if (editable) {
                settraveldialogstatus(!traveldialogstatus);
              }
            }}
          ></DropDown>
          <DropDown
            label="Sub category*"
            hint="Sub category"
            indata={subcategory}
            ontouch={() => {
              if (motravel != "") {
                if (editable) {
                  setsubcategorydialogstatus(!subcategorydialogstatus);
                }
              } else {
                Alert.alert("First Choose Mode of Travel");
              }
            }}
          ></DropDown>
          <DropDown
            label="Center*"
            hint="Center"
            indata={center}
            ontouch={() => {
              if (editable) {
                setcenterdialogstatus(!centerdialogstatus);
              }
            }}
          ></DropDown>
          <DropDown
            label="Onward/Return*"
            hint="Onward/Return"
            indata={onwardreturn}
            ontouch={() => {
              if (editable) {
                setonwardreturndialogstatus(!onwardreturnstatus);
              }
            }}
          ></DropDown>

          {traveldialogstatus && (
            <DropDownDialog
              dialogstatus={traveldialogstatus}
              data={traveldialogdata}
              Tittle="Mode of Travel"
              setdata={setmotravel}
              setdialogstatus={settraveldialogstatus}
              clicked={() => {
                setsubcategory("");
                setfirst(false);
              }}
            ></DropDownDialog>
          )}

          {subcategorydialogstatus && (
            <DropDownDialog
              dialogstatus={subcategorydialogstatus}
              data={subcategorydata}
              Tittle="Subcategory"
              from="Local_Subcategory"
              setid={setsubcategory_id}
              setdata={setsubcategory}
              setdialogstatus={setsubcategorydialogstatus}
            ></DropDownDialog>
          )}

          {centerdialogstatus && (
            <DropDownDialog
              dialogstatus={centerdialogstatus}
              data={centerdialogdata}
              Tittle="Center"
              setdata={setcenter}
              from="Local"
              setid={setcenterid}
              setdialogstatus={setcenterdialogstatus}
              clicked={() => {
                setfirst(false);
              }}
            ></DropDownDialog>
          )}
          {onwardreturnstatus && (
            <DropDownDialog
              dialogstatus={onwardreturnstatus}
              data={onwardreturndata}
              Tittle="Onward/Return"
              from="Local_Onward"
              setid={setonwardreturn_id}
              setdata={setonwardreturn}
              setdialogstatus={setonwardreturndialogstatus}
            ></DropDownDialog>
          )}

          <LabelTextColumnView
            label="Eligible Amount:"
            hint="Eligible Amount"
            value={eligibleamount}
          ></LabelTextColumnView>
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
            label="Remarks* :"
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
