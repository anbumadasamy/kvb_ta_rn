import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, Image } from "react-native";
import CategoriesExpenseCard from "../../components/cards/CategoriesExpenseCard";
import ReasonDialog from "../../components/dialog/ReasonDialog";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";

export default function CategoriesExpense({ route }) {
  const navigation = useNavigation();
  const TourId = route.params.TourId;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  const ReqDate = route.params.ReqDate;
  const tourreasonid = route.params.tourreasonid;
  const max_applevel = route.params.max_applevel;
  const claim_status_id = route.params.claim_status_id;
  const [dialogstatus, setdialogstatus] = useState(false);
  const [reason, setreason] = useState("");
  const [position, setposition] = useState();
  const [actions, setactions] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState([]);
  const [clicked, setclicked] = useState(false);
  const [called, setcalled] = useState(false);
  const [progressBar, setProgressBar] = useState(true);
  let categoriesprevious = false;
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (route.params.categoriesprevious == true) {
      categoriesprevious = false;
    } else {
      categoriesprevious = true;
    }
  }, [route]);

  useEffect(() => {
    let expenseid;
    switch (position) {
      case 1:
        expenseid = 2;
        break;
      case 2:
        expenseid = 4;
        break;
      case 3:
        expenseid = 5;
        break;
      case 4:
        expenseid = 1;
        break;
      case 5:
        expenseid = 9;
        break;
    }

    if (clicked) {
      const some = expenseSummary.filter((item) => item.expenseid == expenseid);

      if (some.length > 0) {
        switch (position) {
          case 1:
            navigation.navigate("Daily Diem", {
              TourId: TourId,
              FromDate: FromDate,
              ToDate: ToDate,
              ReqDate: ReqDate,
              tourreasonid: tourreasonid,
              max_applevel: max_applevel,
              claim_status_id: claim_status_id,
              // Tittle: "Daily Reimbursement List",
              Comments: some[0].requestercomment,
              Position: 1,
            });
            break;
          case 2:
            navigation.navigate("LocalConveyance", {
              TourId: TourId,
              FromDate: FromDate,
              ToDate: ToDate,
              ReqDate: ReqDate,
              tourreasonid: tourreasonid,
              max_applevel: max_applevel,
              claim_status_id: claim_status_id,
              Comments: some[0].requestercomment,
              LocalConveyanceId: "",
            });
            break;
          case 3:
            navigation.navigate("Lodging", {
              TourId: TourId,
              FromDate: FromDate,
              ToDate: ToDate,
              ReqDate: ReqDate,

              tourreasonid: tourreasonid,
              max_applevel: max_applevel,
              claim_status_id: claim_status_id,
              Comments: some[0].requestercomment,
              LodgingId: "",
            });
            break;
          case 4:
            navigation.navigate("Traveling Expenses", {
              TourId: TourId,
              FromDate: FromDate,
              ToDate: ToDate,
              ReqDate: ReqDate,

              tourreasonid: tourreasonid,
              max_applevel: max_applevel,
              claim_status_id: claim_status_id,
              Comments: some[0].requestercomment,
              TravelingExpenseId: "",
            });
            break;
          case 5:
            navigation.navigate("Associated Expenses", {
              TourId: TourId,
              FromDate: FromDate,
              ToDate: ToDate,
              ReqDate: ReqDate,
              tourreasonid: tourreasonid,
              max_applevel: max_applevel,
              claim_status_id: claim_status_id,
              Comments: some[0].requestercomment,
              AssociatedExpensesId: "",
            });
            break;
        }
      } else {
        setdialogstatus(!dialogstatus);
      }
    }
  }, [position, clicked, called]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getExpenseSummary();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      title: "Travel Expense Type",
      headerLeft: () => {
        return (
          <View style={{ paddingRight: 30 }}>
            <MaterialIcons
              name={"arrow-back"}
              size={24}
              color="white"
              onPress={() => {
                if (!route.params.onbehalf) {
                  navigation.navigate("ExpenseSubmit", {
                    from: "Categories Submit",
                    categoriesprevious: categoriesprevious,
                    TourId: TourId,
                    FromDate: FromDate,
                    ToDate: ToDate,
                    ReqDate: ReqDate,
                    reason_id: tourreasonid,
                    max_applevel: max_applevel,
                    claim_status_id: claim_status_id,
                  });
                } else {
                  navigation.goBack();
                }
              }}
            />
          </View>
        );
      },
    });
  });

  useEffect(() => {
    let actiondata = [];
    setProgressBar(true);
    if (tourreasonid == 11) {
      actiondata = [
        {
          text: "Local Conveyance",
          position: 2,
          icon: "directions-bus",
          colour: "#DE3FFD",
          list: "list",
        },
        /*  {
          text: "Associated Expenses",
          position: 5,
          icon: "emoji-flags",
          colour: "#C10E9A",
          list: "list",
        }, */
      ];
      setactions(actiondata);
      setProgressBar(false);
    } else {
      actiondata = [
        {
          text: "Daily Reimbursement",
          position: 1,
          icon: "hand-holding-usd",
          colour: "#5CBE25",
          list: "list",
        },
        {
          text: "Local Conveyance",
          position: 2,
          icon: "directions-bus",
          colour: "#DE3FFD",
          list: "list",
        },
        {
          text: "Lodging",
          position: 3,
          icon: "hotel",
          colour: "#C7460D",
          list: "list",
        },
        {
          text: "Traveling Expenses",
          position: 4,
          icon: "directions-car",
          colour: "#4009B7",
          list: "list",
        },
        /* {
          text: "Associated Expenses",
          position: 5,
          icon: "emoji-flags",
          colour: "#C10E9A",
          list: "list",
        }, */
        {
          text: "Incidential Expenses",
          position: 6,
          icon: "nature-people",
          colour: "#666699",
          list: "list",
        },
        {
          text: "Packaging/Freight",
          position: 7,
          icon: "wallet-travel",
          colour: "#9933ff",
          list: "list",
        },
        {
          text: "Miscellaneous Charges",
          position: 8,
          icon: "emoji-food-beverage",
          colour: "#ff3399",
          list: "list",
        },
      ];
      setactions(actiondata);
      setProgressBar(false);
    }
  }, [tourreasonid]);

  async function getExpenseSummary() {
    let expenseSummaryArray = [];

    try {
      const response = await fetch(URL.EXPENSE_SUMMARY + TourId, {
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
          if (json.data[i].id != null) {
            const obj = {
              id: json.data[i].id,
              expenseType: json.data[i].expensename,
              requestercomment: json.data[i].requestercomment,
              expenseid: json.data[i].expenseid,
            };
            expenseSummaryArray.push(obj);
          }
        }
        setExpenseSummary(expenseSummaryArray);
      }
    } catch (error) {}
  }

  function expenselistcall() {
    switch (position) {
      case 2:
        navigation.navigate("ExpenseList", {
          TourId: TourId,
          FromDate: FromDate,
          ToDate: ToDate,
          ReqDate: ReqDate,
          tourreasonid: tourreasonid,
          max_applevel: max_applevel,
          claim_status_id: claim_status_id,
          Comments: reason,
          Tittle: "Local Conveyance List",
          Position: 2,
        });
        break;
      case 3:
        navigation.navigate("ExpenseList", {
          TourId: TourId,
          FromDate: FromDate,
          ToDate: ToDate,
          ReqDate: ReqDate,
          Comments: reason,
          tourreasonid: tourreasonid,
          max_applevel: max_applevel,
          claim_status_id: claim_status_id,
          Tittle: "Lodging List",
          Position: 3,
        });
        break;
      case 4:
        navigation.navigate("ExpenseList", {
          TourId: TourId,
          FromDate: FromDate,
          ToDate: ToDate,
          ReqDate: ReqDate,
          Comments: reason,
          tourreasonid: tourreasonid,
          max_applevel: max_applevel,
          claim_status_id: claim_status_id,
          Tittle: "Traveling Expenses List",
          Position: 4,
        });
        break;
      case 5:
        navigation.navigate("ExpenseList", {
          TourId: TourId,
          FromDate: FromDate,
          ToDate: ToDate,
          ReqDate: ReqDate,
          Comments: reason,
          tourreasonid: tourreasonid,
          max_applevel: max_applevel,
          claim_status_id: claim_status_id,
          Tittle: "Associated Expenses List",
          Position: 5,
        });
        break;
    }
  }

  function expensecall() {
    if (reason != "") {
      setdialogstatus(!dialogstatus);
      switch (position) {
        case 1:
          navigation.navigate("Daily Diem", {
            TourId: TourId,
            FromDate: FromDate,
            ToDate: ToDate,
            ReqDate: ReqDate,
            tourreasonid: tourreasonid,
            max_applevel: max_applevel,
            claim_status_id: claim_status_id,
            // Tittle: "Daily Reimbursement List",
            DailyDiemId: "",
            Comments: reason,
            Position: 1,
          });
          break;
        case 2:
          navigation.navigate("LocalConveyance", {
            TourId: TourId,
            FromDate: FromDate,
            ToDate: ToDate,
            ReqDate: ReqDate,
            Comments: reason,
            tourreasonid: tourreasonid,
            max_applevel: max_applevel,
            claim_status_id: claim_status_id,
            LocalConveyanceId: "",
          });
          break;
        case 3:
          navigation.navigate("Lodging", {
            TourId: TourId,
            FromDate: FromDate,
            ToDate: ToDate,
            ReqDate: ReqDate,
            Comments: reason,
            tourreasonid: tourreasonid,
            max_applevel: max_applevel,
            claim_status_id: claim_status_id,
            LodgingId: "",
          });
          break;
        case 4:
          navigation.navigate("Traveling Expenses", {
            TourId: TourId,
            FromDate: FromDate,
            ToDate: ToDate,
            ReqDate: ReqDate,
            Comments: reason,
            tourreasonid: tourreasonid,
            max_applevel: max_applevel,
            claim_status_id: claim_status_id,
            TravelingExpenseId: "",
          });
          break;
        case 5:
          navigation.navigate("Associated Expenses", {
            TourId: TourId,
            FromDate: FromDate,
            ToDate: ToDate,
            ReqDate: ReqDate,
            Comments: reason,
            tourreasonid: tourreasonid,
            max_applevel: max_applevel,
            claim_status_id: claim_status_id,
            AssociatedExpensesId: "",
          });
          break;
        case 6:
          navigation.navigate("Incidential Expense", {
            TourId: TourId,
            FromDate: FromDate,
            ToDate: ToDate,
            ReqDate: ReqDate,
            Comments: reason,
            tourreasonid: tourreasonid,
            max_applevel: max_applevel,
            claim_status_id: claim_status_id,
            IncidentialExpenseId: "",
          });
          break;
      }
    } else {
    }
  }

  return (
    <View style={{ flex: 1 }}>
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
        <View style={styles.maincontainer}>
          <View style={styles.row}>
            <Text style={styles.text}>Travel No: {TourId}</Text>
            <Text style={styles.text}>{FromDate}</Text>
            <Text style={styles.text}>{ToDate}</Text>
          </View>
          <View>
            <CategoriesExpenseCard
              data={actions}
              TourId={TourId}
              FromDate={FromDate}
              ToDate={ToDate}
              ReqDate={ReqDate}
              Pressed={() => {
                setclicked(true);
              }}
              listiconpressed={expenselistcall}
              selectedposition={setposition}
              setcalled={setcalled}
              position={position}
              called={called}
            ></CategoriesExpenseCard>
          </View>
          {dialogstatus && (
            <ReasonDialog
              dialogstatus={dialogstatus}
              Tittle=""
              setdata={setreason}
              data={reason}
              setdialogstatus={setdialogstatus}
              selectedposition={setposition}
              setclicked={setclicked}
              confirmclicked={expensecall}
            ></ReasonDialog>
          )}
        </View>
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
  row: {
    flexDirection: "row",
    padding: 2,
    justifyContent: "space-between",
  },
  text: {
    fontWeight: "normal",
    color: "black",
    fontSize: 12,
  },
  button: {
    alignContent: "center",
  },
});
