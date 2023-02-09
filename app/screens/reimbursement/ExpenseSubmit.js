import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, ScrollView, Alert, Image } from "react-native";
import SearchDialog from "../../components/dialog/SearchDialog";
import DropDown from "../../components/ui/DropDown";
import { MaterialIcons } from "@expo/vector-icons";
import TourExpenseType from "../../components/ui/TourExpenseType";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import ExpenseSummaryCard from "../../components/cards/ExpenseSummaryCard";
import { CustomColors } from "../../utilities/CustomColors";
import ExpenseDeleteDialog from "../../components/dialog/ExpenseDeleteDialog";
import SubmitButton from "../../components/ui/SubmitButton";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

export default function ExpenseSubmit({ route }) {
  const navigation = useNavigation();
  const TourId = route.params.TourId;
  const FromDate = route.params.FromDate;
  const ToDate = route.params.ToDate;
  const ReqDate = route.params.ReqDate;
  const max_applevel = route.params.max_applevel;
  let reason_id = route.params.reason_id;
  const claim_status_id = route.params.claim_status_id;
  const empid = route.params.empid;
  const authCtx = useContext(AuthContext);
  const [expenseSummary, setExpenseSummary] = useState([]);
  const [deletedialogstatus, setdeletedialogstatus] = useState(false);
  const [getselectedid, setselectedid] = useState();
  const [getclaimamount, setclaimamount] = useState(0);
  const [visblesubmitbutton, setvisiblesubmitbutton] = useState(true);
  const [visiblestatus, setvisiblestatus] = useState(false);
  const [getstatus, setstatus] = useState("");
  const [istourended, setistourended] = useState(false);
  const [onbehalf, setonbehalfof] = useState(route.params.onbehalf);
  const [makercomment, setmakercomment] = useState("");
  const [progressBar, setProgressBar] = useState(true);
  const [tourexpensebutton, settourexpensebutton] = useState(true);
  const [filemandatory, setfilemandatory] = useState(false);
  const [branch_id, setbranch_id] = useState("");
  const [branch_name, setbranch_name] = useState("");
  const [approverfull_name, setapproverfull_name] = useState("");
  const [approverid, setapproverid] = useState("");
  let previous;


  useEffect(() => {
    if ("previous" in route.params) {
      if (route.params.previous == true) {
        previous = false;
      } else {
        previous = true;
      }
    }
    /*  if (
      route.params.from == "On Behalf Of" ||
      route.params.from == "backfromOnbehalf"
    ) {
      setonbehalfof(true);
    } else {
      setonbehalfof(false);
    } */
  }, [route]);

  useEffect(() => {
    navigation.setOptions({
      title: "Expenses",
      headerLeft: () => {
        return (
          <View style={{ paddingRight: 30 }}>
            <MaterialIcons
              name={"arrow-back"}
              size={24}
              color="white"
              onPress={() => {
                if (
                  route.params.from == "Reimbursementtab" ||
                  route.params.from == "ReimbursementScreen" ||
                  route.params.from == "Expense Submit"
                ) {
                  navigation.navigate("ReimbursementScreen", {
                    from: "Expense Submit",
                    previous: previous,
                  });
                } else if (
                  route.params.from == "On Behalf Of" ||
                  route.params.from == "backfromOnbehalf"
                ) {
                  navigation.navigate("On Behalf Of", {
                    from: "backfromOnbehalf",
                    previous: previous,
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
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getExpenseSummary();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (expenseSummary.length > 0) {
      switch (claim_status_id) {
        case -1:
          setvisiblesubmitbutton(false);
          setvisiblestatus(false);
          settourexpensebutton(true);
          break;
        case 1:
          setvisiblestatus(false);
          settourexpensebutton(true);
          if (istourended) {
            setvisiblesubmitbutton(true);
          } else {
            setvisiblesubmitbutton(false);
          }
          break;
        case 2:
          setvisiblesubmitbutton(false);
          setvisiblestatus(true);
          settourexpensebutton(false);
          switch (max_applevel) {
            case 1:
              setstatus("RM Level Pending");
              break;
            case 2:
              setstatus("FH Level Pending");
              break;
            case 3:
              setstatus("Admin Level Pending");
              break;
          }
          break;
        case 3:
          setstatus("Approved");
          setvisiblesubmitbutton(false);
          setvisiblestatus(true);
          settourexpensebutton(false);
          break;
        case 4:
          setstatus("Rejected");
          setvisiblesubmitbutton(false);
          setvisiblestatus(true);
          settourexpensebutton(false);
          break;
        case 5:
          setstatus("Return");
          setvisiblesubmitbutton(true);
          setvisiblestatus(false);
          settourexpensebutton(true);
          break;
      }
    } else {
      setvisiblesubmitbutton(false);
      setvisiblestatus(false);
      settourexpensebutton(true);
    }
  }, [expenseSummary]);

  async function getExpenseSummary() {
    let expenseSummaryArray = [];
    setProgressBar(true);

    try {
      const response = await fetch(URL.EXPENSE_SUMMARY + TourId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      console.log("Expense Summary Data :>> " + JSON.stringify(json));

      if ("detail" in json) {
        if (json.detail == "Invalid credentials/token.") {
          AlertCredentialError(json.detail, navigation);
          return;
        }
      }
      json.data.map(function (item, index, arr) {
        if (
          item.expensename == "Daily Diem" ||
          item.expensename == "Lodging" ||
          item.expensename == "Packaging/Freight"
        ) {
          setfilemandatory(true);
        }
      });
      if ("approver_branch_data" in json) {
        if (json.approver_branch_data.length != 0) {
          setbranch_name(json.approver_branch_data.branch_name);
          setbranch_id(json.approver_branch_data.branch_id);
          setapproverfull_name(json.approver_branch_data.full_name);
          setapproverid(json.approver_branch_data.id);
        }
      }

      setclaimamount(json.claimed_amount);
      setistourended(json.is_tour_ended);

      if (claim_status_id == 5) {
        setmakercomment(json.maker_comment);
      }

      for (let i = 0; i < json.data.length; i++) {
        if (json.data[i].id != null) {
          const obj = {
            id: json.data[i].id,
            expenseType: json.data[i].expensename,
            approvedAmount: json.data[i].approvedamount,
            claimAmount: json.data[i].claimedamount,
            reason: json.data[i].requestercomment,
            expenseid: json.data[i].expenseid,
            claimstatusid: claim_status_id,
            TourId: TourId,
            reqdate: ReqDate,
            FromDate: FromDate,
            ToDate: ToDate,
          };
          expenseSummaryArray.push(obj);
        }
      }
      setExpenseSummary(expenseSummaryArray);

      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
    }
  }
  async function deletemethod() {
    setdeletedialogstatus(!deletedialogstatus);
    console.log(
      URL.EXPENSE_DELETE +
        TourId +
        "/tour/" +
        getselectedid +
        " Delete API Fro Expense"
    );

    try {
      const response = await fetch(
        URL.EXPENSE_DELETE + TourId + "/tour/" + getselectedid,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.auth_token,
          },
        }
      );

      let json = await response.json();
      console.log(JSON.stringify(json) + " Response for delete");

      if (json) {
        if ("detail" in json) {
          if (json.detail == "Invalid credentials/token.") {
            AlertCredentialError(json.detail, navigation);
            return;
          }
        }
        if (json.status) {
          ToastMessage(json.status);
          // Alert.alert(json.status);
          getExpenseSummary();
          // navigation.goBack();
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      // setProgressBar(false);
    }
  }

  function ExpenseType() {
    navigation.navigate("CategoriesExpense", {
      TourId: TourId,
      FromDate: FromDate,
      ToDate: ToDate,
      ReqDate: ReqDate,
      tourreasonid: reason_id,
      claim_status_id: claim_status_id,
      max_applevel: max_applevel,
      previous: previous,
      expenseSummary: expenseSummary,
      onbehalf: onbehalf,
    });
  }
  return (
    <View style={styles.view}>
      <View style={styles.safeAreaView}>
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
          <View style={styles.screen}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              overScrollMode="never"
              bounces={false}
            >
              <View style={styles.maincontainer}>
                <View style={styles.row}>
                  <Text style={styles.text}>Travel No: {TourId}</Text>
                  <Text style={styles.text}>{FromDate}</Text>
                  <Text style={styles.text}>{ToDate}</Text>
                </View>
              </View>
              {tourexpensebutton && (
                <TourExpenseType onPressEvent={ExpenseType}>
                  Add Travel Expense
                </TourExpenseType>
              )}
              <View
                style={{
                  flex: 1,
                  marginTop: 20,
                }}
              >
                <View>
                  {expenseSummary.length > 0 ? (
                    <ExpenseSummaryCard
                      data={expenseSummary}
                      setid={setselectedid}
                      deletedialogcall={() => {
                        setdeletedialogstatus(!deletedialogstatus);
                      }}
                    />
                  ) : (
                    <Text style={styles.noDataFoundText}>No data found</Text>
                  )}
                </View>

                {deletedialogstatus && (
                  <ExpenseDeleteDialog
                    dialogstatus={deletedialogstatus}
                    Tittle=""
                    setdialogstatus={setdeletedialogstatus}
                    deletemethod={deletemethod}
                  ></ExpenseDeleteDialog>
                )}
              </View>
            </ScrollView>

            {visblesubmitbutton && (
              <SubmitButton
                onPressEvent={() => {
                  navigation.navigate("AddCCBS", {
                    TourId: TourId,
                    FromDate: FromDate,
                    ToDate: ToDate,
                    ReqDate: ReqDate,
                    claimamount: getclaimamount,
                    empid: empid,
                    onbehalf: onbehalf,
                    makercomment: makercomment,
                    claim_status_id: claim_status_id,
                    filemandatory: filemandatory,
                    branch_name: branch_name,
                    branch_id: branch_id,
                    approverfull_name: approverfull_name,
                    approverid: approverid,
                  });
                }}
              >
                CCBS
              </SubmitButton>
            )}
          </View>
        )}
        {visiblestatus && (
          <View style={styles.buttonOuterContainer}>
            <Text style={styles.buttonText}>{getstatus}</Text>
          </View>
        )}
      </View>
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
    justifyContent: "space-between",
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
    alignContent: "flex-end",
    bottom: 20,
    top: 5,
  },
  safeAreaView: {
    flex: 1,
  },
  screen: {
    flex: 1,
    marginLeft: "4%",
    marginRight: "4%",
    marginBottom: "3%",
    marginTop: "3%",
  },
  view: {
    flex: 1,
    backgroundColor: CustomColors.screen_background_gray,
  },
  buttonOuterContainer: {
    height: 60,
    width: "100%",
    backgroundColor: CustomColors.primary_green,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: CustomColors.primary_white,
    textAlign: "center",
    fontWeight: "bold",
  },
});
