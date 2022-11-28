import { useEffect, useState, useContext, useRef } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import MemberApprovalCCBS from "../../components/cards/MemberApprovalCCBS";
import { CustomColors } from "../../utilities/CustomColors";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

export default function MemberApprovalExpense({ tourid, setinvoiceheadergid }) {
  const [geteachexpense, seteachexpense] = useState([]);
  const authCtx = useContext(AuthContext);
  const [progressBar, setProgressBar] = useState(true);
  const TourId = tourid;

  async function getccbslist() {
    let eachexpensearray = [];
    setProgressBar(true);

    try {
      const response = await fetch(URL.EXPENSE_SUMMARY + TourId, {
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
          let reqdate = json.data[i].requestdate.split(" ");
          let uniqreqdate = reqdate[0];
          const obj = {
            id: json.data[i].id,
            expensename: json.data[i].expensename,
            approvedamount: json.data[i].approvedamount,
            claimedamount: json.data[i].claimedamount,
            requestercomment: json.data[i].requestercomment,
            tab: "MemberApprovalExpense",
            expenseid: json.data[i].expenseid,
            expensetype: json.data[i].expensename,
            TourId: json.data[i].tourid,
            claimstatusid: "MemberApproverExpense",
            reqdate: uniqreqdate,
          };
          if ("maker_data" in json) {
            obj["maker"] = json.maker_data.full_name;
          }

          if (json.data[i].invoiceheadergid != null) {
            setinvoiceheadergid(json.data[i].invoiceheadergid);
          }
          eachexpensearray.push(obj);
        }
        seteachexpense(eachexpensearray);
      }

      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
    } finally {
    }
  }
  useEffect(() => {
    if (TourId) {
      getccbslist();
    }
  }, [TourId]);

  return (
    <View>
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
          {geteachexpense.length > 0 ? (
            <MemberApprovalCCBS data={geteachexpense} />
          ) : (
            <Text style={styles.noDataFoundText}>No data found</Text>
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
