import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthContextProvider from "../data/Auth-Context";
import { CustomColors } from "../utilities/CustomColors";
import Lodging from "../screens/reimbursement/Lodging";
import TravelingExpenses from "../screens/reimbursement/TravelingExpenses";
import DailyDiem from "../screens/reimbursement/DailyDiem";
import LoginScreen from "../screens/main/LoginScreen";
import TravelCreationScreen from "../screens/travel_creation/TravelCreationScreen";
import AddItineraryScreen from "../screens/travel_creation/AddItineraryScreen";

import SearchList from "../components/ui/SearchList";
import TravelHistoryScreen from "../screens/history/TravelHistoryScreen";
import OnGoingTravelScreen from "../screens/history/OnGoingTravelScreen";
import ExpenseDetailScreen from "../screens/reimbursement/ExpenseDetailScreen";
import ExpenseSubmit from "../screens/reimbursement/ExpenseSubmit";
import CategoriesExpense from "../screens/reimbursement/CategoriesExpense";
import ReimbursementScreen from "../screens/reimbursement/ReimbursementScreen";
import LocalConveyance from "../screens/reimbursement/LocalConveyance";
import AssociatedExpenses from "../screens/reimbursement/AssociatedExpense";
import MemberTravelApprovalScreen from "../screens/travel_approvel/MemberTravelApprovalScreen";
import ApprovalFlowScreen from "../screens/others/ApprovalFlowScreen";
import ExpenseList from "../screens/reimbursement/ExpenseList";
import MemberApprovalTabScreen from "../screens/reimbursement/MemberApprovalTabScreen";
import AddCCBS from "../screens/reimbursement/AddCCBS";
import ExpenseAddCCbs from "../screens/reimbursement/ExpenseAddCCBS";
import OnBehalfOfTabScreen from "../screens/on_behalf_of/OnBehalfOfTabScreen";
import MakerSummaryTabScreen from "../screens/travel_update/MakerSummaryTabScreen";
import AddDocuments from "../screens/reimbursement/AddDocuments";
import DateRelaxationScreen from "../screens/others/DateRelaxationScreen";
import TravelManagmentScreen from "../screens/main/TravelManagmentScreen";
import AdvanceCreationScreen from "../screens/advance_creation/AdvanceCreationScreen";
import IncidentialExpenses from "../screens/reimbursement/IncidentialExpenses";
import MiscExpenses from "../screens/reimbursement/MiscExpenses";
import PackingExpenses from "../screens/reimbursement/PackingExpenses";

const Stack = createNativeStackNavigator();

export default function Navigator() {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LoginScreen"
          screenOptions={{
            headerStyle: { backgroundColor: CustomColors.primary_green },
            headerTintColor: "white",
            navigationBarColor: "black",
            contentStyle: { backgroundColor: CustomColors.primary_white },
          }}
        >
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TravelManagmentScreen"
            component={TravelManagmentScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Travel Creation"
            component={TravelCreationScreen}
          />
          <Stack.Screen
            name="Advance Creation"
            component={AdvanceCreationScreen}
          />
          <Stack.Screen
            name="Date Relaxation"
            component={DateRelaxationScreen}
          />

          <Stack.Screen
            name="AddItineraryScreen"
            component={AddItineraryScreen}
          />

          <Stack.Screen
            name="TravelHistoryScreen"
            component={TravelHistoryScreen}
          />
          <Stack.Screen
            name="OnGoingTravelScreen"
            component={OnGoingTravelScreen}
          />
          <Stack.Screen name="AddCCBS" component={AddCCBS} />
          <Stack.Screen name="ExpenseAddCCBS" component={ExpenseAddCCbs} />
          <Stack.Screen
            name="ExpenseDetailScreen"
            component={ExpenseDetailScreen}
          />

          <Stack.Screen name="Approval Flow" component={ApprovalFlowScreen} />
          <Stack.Screen
            name="SearchList"
            component={SearchList}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="ExpenseSubmit" component={ExpenseSubmit} />
          <Stack.Screen
            name="CategoriesExpense"
            component={CategoriesExpense}
          />
          <Stack.Screen name="LocalConveyance" component={LocalConveyance} />
          <Stack.Screen name="Lodging" component={Lodging} />
          <Stack.Screen
            name="Associated Expenses"
            component={AssociatedExpenses}
          />
          <Stack.Screen
            name="Traveling Expenses"
            component={TravelingExpenses}
          />
          <Stack.Screen name="Add Documents" component={AddDocuments} />
          <Stack.Screen name="ExpenseList" component={ExpenseList} />
          <Stack.Screen name="Daily Diem" component={DailyDiem} />
          <Stack.Screen
            name="Checker Summary"
            component={MemberTravelApprovalScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="ReimbursementScreen"
            component={ReimbursementScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="MemberApprovalTabScreen"
            component={MemberApprovalTabScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="Maker Summary"
            component={MakerSummaryTabScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="On Behalf Of"
            component={OnBehalfOfTabScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="Incidential Expense"
            component={IncidentialExpenses}
          ></Stack.Screen>
          <Stack.Screen
            name="Miscellaneous Expense"
            component={MiscExpenses}
          ></Stack.Screen>
          <Stack.Screen
            name="Packing Expense"
            component={PackingExpenses}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContextProvider>
  );
}
