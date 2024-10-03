import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

export async function handleNotifications() {
  const hasPermission = await isPermissionGranted();

  if (!hasPermission) {
    const permission = await requestPermission();

    if (permission === "granted") {
      console.log("Permission granted");
      sendNotification({
        title: "Hello from JS!",
        body: "This is a notification from JS and Rust",
      });
    } else {
      console.log("Permission denied");
    }
  } else {
    console.log("Already has permission.");
    console.log("sending notification.");
    sendNotification({
      title: "Hello from JavaScript!",
      body: "This is a notification from JavaScript and Rust",
    });
  }
}
