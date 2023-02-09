//KVB
const USER_SERVER = "http://143.110.244.51:8184/usrserv/";
const TA_SERVER = "http://143.110.244.51:8184/taserv/";
const MASTER_SERVER = "http://143.110.244.51:8184/mstserv/";
const ECF_SERVER = "http://143.110.244.51:8185/ecfserv/";

/* const USER_SERVER = " http://192.168.1.40:8000/usrserv/";
const TA_SERVER = " http://192.168.1.40:8000/taserv/";
const MASTER_SERVER = " http://192.168.1.40:8000/mstserv/";
const ECF_SERVER = " http://192.168.1.40:8000/ecfserv/"; */

export const URL = {
  LOGIN_URL: USER_SERVER + "auth_token",
  LOGOUT_URL: USER_SERVER + "logout",
  ENTITY_LIST: USER_SERVER + "entity",
  CLAIM_MAKER_SUMMARY: TA_SERVER + "expense_summary",
  APPROVAL_SUMMARY: TA_SERVER + "tourapprove/claim",
  APPROVAL_SUMMARY_API: TA_SERVER + "tourapprove/",
  MAKER_TRAVEL_CANCEL_SUMMARY: TA_SERVER + "cancelled_data?type=",
  ADVANCE_APPROVAL_SUMMARY: TA_SERVER + "tourapprove/advance?",
  COMMON_DROPDOWN: TA_SERVER + "common_dropdown_get/",
  ONGOING_TOUR_SUMMARY: TA_SERVER + "ongoing_tour",
  TRAVEL_MAKER_SUMMARY: TA_SERVER + "tourdata",
  TRAVEL_ADVANCE_SUMMARY: TA_SERVER + "touradvance",
  EXPENSE_SUMMARY: TA_SERVER + "claimreq/tour/",
  TRAVEL_DETAILS_GET: TA_SERVER + "tourdata/",
  CITY_LIST: TA_SERVER + "insert_ta_city",
  DOCUMENT_GET: TA_SERVER + "document_get?tour_id=",
  // DOCUMENT_DOWNLOAD: TA_SERVER + "document_view?doc_option=download&id=",
  ITINERARY_DELETE: TA_SERVER + "tour_detail_delete/",
  REQUIREMENT_DELETE: TA_SERVER + "delete_travel_requirements?id=",
  TRAVEL_CANCEL_REQUEST: TA_SERVER + "tourcancel",
  CEO_TEAMCHECK: USER_SERVER + "ceo_team_get_ta_check",
  CEO_TEAM_MEMBERS: USER_SERVER + "ceo_team_get_ta",
  DOCUMENT_UPLOAD: TA_SERVER + "document_insert",
  DOCUMENT_DELETE: TA_SERVER + "particular_doc_get/",
  HOLIDAY_CHECK: TA_SERVER + "holiday_check?",
  // ON_BEHALF_OF_EMPLOYEE_GET: TA_SERVER + "nac_onbehalf_emp_get?query=",
  ON_BEHALF_OF_EMPLOYEE_GET: TA_SERVER + "onbehalf_emp_get",

  ON_BEHALF_OF_EMPLOYEE_DETAIL: TA_SERVER + "emp_details_get?onbehalf=",
  SKIP_APPROVER: TA_SERVER + "rm_skip/",
  ECF_GET: ECF_SERVER + "ecf_covernote/",

  DATE_RELAXATION_SUMMARY: TA_SERVER + "date_relaxation?page=",
  SWITCH_DATE_RELAXATION: TA_SERVER + "date_relaxation",

  TRAVEL_APPROVEL_SUMMARY: TA_SERVER + "tourapprove/tour?",
  CCBS_GET: TA_SERVER + "ccbs_get?",

  EMPLOYEE_BASE_LOCATION: TA_SERVER + "employee_base_get",
  TRAVEL_CREATION: TA_SERVER + "tour",
  TRAVEL_REASON: TA_SERVER + "tourreason",
  FREQUENT_CITY: TA_SERVER + "frequent_city?",
  FREQUENT_CLIENT: TA_SERVER + "frequent_client?",

  TRAVEl_APPROVE: TA_SERVER + "tourapprove",
  TRAVEl_RETURN: TA_SERVER + "tourreturn",
  TRAVEl_REJECT: TA_SERVER + "tourreject",

  DAILY_DIEM: TA_SERVER + "dailydeim",
  LOCAL_CONVEYANCE: TA_SERVER + "localconv",
  LODGING: TA_SERVER + "lodging",
  INCIDENTIAL: TA_SERVER + "incidental",
  MISC: TA_SERVER + "misc",

  TRAVELING_EXPENSES: TA_SERVER + "travel",
  ASSOCIATED_EXPENSES: TA_SERVER + "associate",
  EXPENSE_DELETE: TA_SERVER + "expense_delete/",

  BS_GET: USER_SERVER + "searchbusinesssegment",
  CC_GET: USER_SERVER + "searchbs_cc?bs_id=",
  EXPENSE_SUBMIT: TA_SERVER + "expense/submit",

  LOCAL_CONVEYANCE_ELIGIBLE_AMOUNT: TA_SERVER + "localconv/logic",
  DAILY_DIEM_ElIGIBLE: TA_SERVER + "dailydeim/logic",
  LODGING_ElIGIBLE: TA_SERVER + "lodging/logic",
  INCIDENTIAL_ElIGIBLE: TA_SERVER + "incidental/logic",

  TRAVEL_APPROVEL_SUMMARY: TA_SERVER + "tourapprove/tour?",
  APPROVAL_FLOW_SUMMARY: TA_SERVER + "approval_flow_get?type=all&tourid=",

  // on behalf of api
  ON_BEHALF_OF_SUMMARY: TA_SERVER + "tourdata?onbehalf=",

  // chat api
  SEND_CHAT: TA_SERVER + "chat_box",
  CHAT_SUMMARY_LIST: TA_SERVER + "chat_summary?",

  // admin screen api
  ADMIN_SUMMARY: TA_SERVER + "admin_summary?",
  AIR_BOOKING_ADMIN: TA_SERVER + "air_booking_admin",
  CAB_BOOKING_ADMIN: TA_SERVER + "cab_booking_admin",
  ACCOMMODATION_BOOKING_ADMIN: TA_SERVER + "accommodation_booking_admin",
  BUS_BOOKING_ADMIN: TA_SERVER + "bus_booking_admin",
  TRAIN_BOOKING_ADMIN: TA_SERVER + "train_booking_admin",
  REQUIREMENTS_REJECT: TA_SERVER + "requirement_reject",
  ADMIN_RESERVED: TA_SERVER + "admin_reserv",
  RRQUIREMENTS_ADMIN_GET: TA_SERVER + "get_requirements_admin?",
  REQUIREMENT_ADMIN_CANCEL: TA_SERVER + "req_cancel_approve",

  REQUIREMENT_DOCUMENT_GET: TA_SERVER + "document_get?requirement=",
  DOCUMENT_DOWNLOAD: TA_SERVER + "document_view?",
  CHECK_ADMIN: USER_SERVER + "user_modules",
  REQUIREMENT_USER_CANCEL: TA_SERVER + "cancel_booking_request?booking_type=",

  TOUR_GRADE: TA_SERVER + "tourno_grade_get/",
  DAILY_DIEM_CITY: TA_SERVER + "allowance?city=",
  HSN: MASTER_SERVER + "search_hsn?query=",
  GST: USER_SERVER + "bank_gst_get?gst=",

  //New

  // kvb travel creation
  PERMITTED_BY_EMP_LIST: USER_SERVER + "branchwise_employee_get/0?maker=",
  APPROVER_BRANCH_LIST: USER_SERVER + "search_employeebranch",
  APPROVER_EMP_LIST: TA_SERVER + "branch_approver_get/tour/branch/",
  PACKAGING: TA_SERVER + "packingmvg",
PACKAGING_ELIGIBLE: TA_SERVER + "packingmvg/logic",
};
