import { createContext, useState } from "react";

export const AuthContext = createContext({
  auth_token: "",
  user_name: "",
  user_id: "",
  isAuthenticated: false,
  reimbursementType: "",
  memberType: "",
  makerSummaryType: "",
  ceoPermission: "",
  travelReason: "",
  travelMaker: "",
  travelApprover: "",
  travelOnBehalfOf: "",
  admin: "",
  authenticate: () => {},
  logout: () => {},
  currentReimbursementType: () => {},
  SetMemberType: () => {},
  SetMakerSummaryType: () => {},
  SetCeoPermission: () => {},
  SetTravelReason: () => {},
  SetTravelMaker: () => {},
  SetTravelApprover: () => {},
  SetTravelOnBehalfOf: () => {},
  SetAdmin: () => {},
});

export default function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [userName, setUserName] = useState();
  const [userId, setUserId] = useState();
  const [reimbType, setreimbType] = useState();
  const [memberType, setMemberType] = useState();
  const [makerSummaryType, setMakerSummaryType] = useState();
  const [ceoPermission, setCeoPermission] = useState();
  const [travelReason, setTravelReason] = useState();
  const [travelMaker, setTravelMaker] = useState(false);
  const [travelApprover, setTravelApprover] = useState(false);
  const [travelOnBehalfOf, setTravelOnBehalfOf] = useState(false);
  const [admin, setAdmin] = useState(false);

  function SetTravelMaker(travelMaker) {
    setTravelMaker(travelMaker);
  }
  function SetTravelApprover(travelApprover) {
    setTravelApprover(travelApprover);
  }
  function SetTravelOnBehalfOf(travelOnBehalfOf) {
    setTravelOnBehalfOf(travelOnBehalfOf);
  }
  function SetAdmin(admin) {
    setAdmin(admin);
  }

  function SetTravelReason(travelReason) {
    setTravelReason(travelReason);
  }

  function SetCeoPermission(ceoPermission) {
    setCeoPermission(ceoPermission);
  }

  function SetMakerSummaryType(makerSummaryType) {
    setMakerSummaryType(makerSummaryType);
  }

  function SetMemberType(memberType) {
    setMemberType(memberType);
  }

  function authenticate(auth_token, user_name, user_id) {
    setAuthToken(auth_token);
    setUserName(user_name);
    setUserId(user_id);
  }

  function currentReimbursementType(reimbursementType) {
    setreimbType(reimbursementType);
  }

  function logout() {
    setAuthToken(null);
    setUserName(null);
    setUserId(null);
  }

  const value = {
    auth_token: authToken,
    user_name: userName,
    user_id: userId,
    memberType: memberType,
    makerSummaryType: makerSummaryType,
    reimbursementType: reimbType,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
    currentReimbursementType: currentReimbursementType,
    SetMemberType: SetMemberType,
    SetMakerSummaryType: SetMakerSummaryType,
    SetCeoPermission: SetCeoPermission,
    ceoPermission: ceoPermission,
    travelReason: travelReason,
    SetTravelReason: SetTravelReason,
    travelMaker: travelMaker,
    travelApprover: travelApprover,
    travelOnBehalfOf: travelOnBehalfOf,
    SetTravelMaker: SetTravelMaker,
    SetTravelApprover: SetTravelApprover,
    SetTravelOnBehalfOf: SetTravelOnBehalfOf,
    admin: admin,
    SetAdmin: SetAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
