import Toast from "react-native-root-toast";

export default function ToastMessage(message) {
  let toast = Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
  });
  setTimeout(function () {
    Toast.hide(toast);
  }, 2000);
}
