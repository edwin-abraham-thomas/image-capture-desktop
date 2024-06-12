//#region Methods

async function getDevices(type) {
  const mediaDevices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = mediaDevices.filter((vd) => vd.kind == type);
  return videoDevices;
}

function updateCameraList(cameras) {
  deviceListElement.innerHTML = "";
  const options = cameras.map((camera) => {
    const cameraOption = document.createElement("option");
    cameraOption.label = camera.label;
    cameraOption.value = camera.deviceId;
    return cameraOption;
  });
  const defaultOption = document.createElement("option");
  defaultOption.label = "--Please choose an option--";
  defaultOption.value = "";
  deviceListElement.append(defaultOption);
  options.forEach((cameraOption) => {
    deviceListElement.appendChild(cameraOption);
  });
  devices = cameras;
}

async function selectCameraToStream() {
  if (currentlyActiveStream !== null && !enableCamera) {
    closeStream();
  }

  if (selectedDeviceId === "" || !enableCamera) return;

  currentlyActiveStream = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: selectedDeviceId },
  });
}

function closeStream() {
  currentlyActiveStream?.getVideoTracks().forEach(function (track) {
    track.stop();
  });
}

function blobToDataURL(blob) {
  return new Promise(function (resolve, reject) {
    var a = new FileReader();
    a.onload = function (e) {
      resolve(e.target.result);
    };
    a.readAsDataURL(blob);
  });
}

async function takePicture() {
  if (!currentlyActiveStream || !currentlyActiveStream.active) {
    await selectCameraToStream();
  }

  const track = currentlyActiveStream.getVideoTracks()[0];
  imageCapture = new ImageCapture(track);
  const pictureBlob = await imageCapture.takePhoto();

  var dataURL = await blobToDataURL(pictureBlob); 
  closeStream();
  return dataURL;
}

//#endregion

//#region Properties

const deviceListElement = document.querySelector("select#availableCameras");
let selectedDeviceId = "";

const videoElement = document.getElementById("camera");

let devices = [];
let selectedDevice = {};
let currentlyActiveStream = null;

const enableCameraCheckoxElement = document.querySelector("input#cameraEnable");
let enableCamera = false;

const canvas = document.getElementById("canvas");

const takePictureButton = document.querySelector("input#takePicture");

//#endregion

getDevices("videoinput").then((cameras) => {
  updateCameraList(cameras);
});

navigator.mediaDevices.addEventListener("devicechange", () => {
  getDevices("videoinput").then((devices) => updateCameraList(devices));
});

deviceListElement.addEventListener("change", (event) => {
  selectedDeviceId = event.target.value;
});

enableCameraCheckoxElement.addEventListener("change", (event) => {
  enableCamera = event.target.checked;
});

takePictureButton.addEventListener("click", async (event) => {
  await takePicture();
});

window.api.onGetPicture(async () => {
  console.log("onGetPicture invoked");
  const pictureDataURL = await takePicture();
  await window.api.processPictureBlob(pictureDataURL);
});
