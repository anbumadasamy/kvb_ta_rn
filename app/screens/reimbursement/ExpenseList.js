import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Image,
} from "react-native";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import moment from "moment";
import ExpenseListCard from "../../components/cards/ExpenseListCard";
import ExpenseDeleteDialog from "../../components/dialog/ExpenseDeleteDialog";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

export default function ExpenseList({ route }) {
  const TourId = route.params.TourId;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  const ReqDate = route.params.ReqDate;
  let Tittle = route.params.Tittle;
  let Position = route.params.Position;
  const [progressBar, setProgressBar] = useState(true);
  const [deletedialogstatus, setdeletedialogstatus] = useState(false);
  const [getselectedid, setselectedid] = useState();
  const [getlist, setlist] = useState([]);
  let tourdates = [];
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);


  function DailydeimCustomflatlist() {
    let tempFromDate = new Date(FromDate);
    let tempToDate = new Date(ToDate);
    let fDate = tempFromDate.getTime();
    let tdate = tempToDate.getTime();

    for (let i = fDate; i <= tdate; i += 86400000) {
      const obj = {
        id: i,
        CustomData: true,
        tour_id: TourId,
        expensegid: 2,
        citytype: "Domestic",
        visitcity: "",
        fromdatewithtime: `${moment(i).format("YYYY-MM-DD")} 00:00:00`,
        todatewithtime: `${moment(i).format("YYYY-MM-DD")} 00:00:00`,
        noofhours: 0,
        billno: "",
        boardingbyorganiser: "NO",
        foodallowance: 0,
        claimedamount: 0,
        medicalexpense: 0,
        remarks: "",
        requestercomment: "",
        fromdate: FromDate,
        todate: ToDate,
        eligibleamount: 0,
        Req: ReqDate,
        Date: moment(i).format("DD-MM-YYYY"),
        remarks: "",
      };
      if ("Comments" in route.params) {
        obj["Comments"] = route.params.Comments;
      }
      tourdates.push(obj);
    }
    setlist(tourdates);
    setProgressBar(false);
    
  }

  useEffect(() => {
    navigation.setOptions({
      title: Tittle,
    });
    getdata();
  }, []);

  async function deletemethod() {
    setdeletedialogstatus(!deletedialogstatus);

    try {
      let deleteurl;
      switch (Position) {
        case 1:
          deleteurl = URL.DAILY_DIEM;
          break;
        case 2:
          deleteurl = URL.LOCAL_CONVEYANCE;
          break;
        case 3:
          deleteurl = URL.LODGING;
          break;
        case 4:
          deleteurl = URL.TRAVELING_EXPENSES;
          break;
        case 5:
          deleteurl = URL.ASSOCIATED_EXPENSES;
          break;
      }

      console.log(deleteurl+ "/tour/" + getselectedid+"Delete Url")

      const response = await fetch(deleteurl + "/tour/" + getselectedid, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      console.log(JSON.stringify(json)+"Delete Api Response")

     
      if (json) {
        if ("detail" in json) {
          if(json.detail == "Invalid credentials/token."){
          AlertCredentialError(json.detail, navigation);
          }
        }
        if (json.status) {
          ToastMessage(json.status)  
          // Alert.alert(json.status);
          navigation.goBack();
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      // setProgressBar(false);
      
    }
  }

  async function getdata() {
    setProgressBar(true);
    try {
      let url;
      switch (Position) {
        case 1:
          url = URL.DAILY_DIEM;
          break;  
        case 2:
          url = URL.LOCAL_CONVEYANCE;
          break;
        case 3:
          url = URL.LODGING;
          break;
        case 4:
          url = URL.TRAVELING_EXPENSES;
          break;
        case 5:
          url = URL.ASSOCIATED_EXPENSES;
          break;
      }
      const response = await fetch(url + "/tour/" + TourId, {
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
      else if (json.data.length != 0) {
        for (let i = 0; i < json.data.length; i++) {
          let datewithtime = json.data[i].fromdate.split(" ");
          let uniqdate = datewithtime[0];
          let uniqtime = datewithtime[1];

          const obj = {
            id: json.data[i].id,
            tour_id: json.data[i].tour_id,
            claimedamount: json.data[i].claimedamount,
            Date: uniqdate,
            fromdate: FromDate,
            todate: ToDate,
            CustomData: false,
            remarks: json.data[i].remarks,
            Req: ReqDate,
          };
          if ("from" in route.params) {
            obj["from"] = route.params.from;
          }

          tourdates.push(obj);
        }
        setlist(tourdates);
        setProgressBar(false);
      } else if (json.data.length == 0 && Position == 1) {
        DailydeimCustomflatlist();
      }
    } catch (error) {
      setProgressBar(false);
     
    }
  }

 

  return (
    <View style={styles.screenContainer}>
      {progressBar ? (
        <View
          style={{
            flex: 1,
            backgroundColor: CustomColors.screen_background_gray,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View>
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../../assets/icons/Progressbar2.gif")}
            />
          </View>
        </View>
      ) : (
        <View style={styles.maincontainer}>
          {getlist.length > 0 ? (
            <ExpenseListCard
              data={getlist}
              WhichExpense={Position}
              setid={setselectedid}
              deletedialogcall={() => {
                setdeletedialogstatus(!deletedialogstatus);
              }}
            />
          ) : (
            <Text style={styles.noDataFoundText}>No data found</Text>
          )}
        </View>
      )}
      {deletedialogstatus && (
        <ExpenseDeleteDialog
          dialogstatus={deletedialogstatus}
          Tittle=""
          setdialogstatus={setdeletedialogstatus}
          deletemethod={deletemethod}
        ></ExpenseDeleteDialog>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  noDataFoundText: {
    marginTop: 50,
    fontSize: 14,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  maincontainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: CustomColors.screen_background_gray,
  },
});
