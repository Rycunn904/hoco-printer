const CONFIG = {
  photos: 3,
  countdownSeconds: 3,
  storageKey: "photobooth-bottom-image"
};

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const countdownSelect = document.getElementById("countdown");
const imageUpload = document.getElementById("imageUpload");
const startButton = document.getElementById("startButton");
const retakeButton = document.getElementById("retakeButton");
const printButton = document.getElementById("printButton");
const clearImageButton = document.getElementById("clearImageButton");
const countdownOverlay = document.getElementById("countdownOverlay");
const statusText = document.getElementById("status");
const savedStatus = document.getElementById("savedStatus");

const slots = [
  document.querySelector(".strip-slot:nth-child(1)"),
  document.querySelector(".strip-slot:nth-child(2)"),
  document.querySelector(".strip-slot:nth-child(3)"),
  document.querySelector(".bottom-slot")
];

let stream = null;
let photos = [];

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    statusText.textContent = "Your browser does not support camera access.";
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 960 }
      },
      audio: false
    });

    video.srcObject = stream;
    statusText.textContent = "Camera ready.";
  } catch (error) {
    console.error(error);
    statusText.textContent =
      "Camera access was denied or unavailable. Check your browser permissions.";
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function countdown(seconds) {
  for (let i = seconds; i > 0; i--) {
    countdownOverlay.textContent = i;
    await sleep(1000);
  }

  countdownOverlay.textContent = "📸";
  await sleep(300);
  countdownOverlay.textContent = "";
}

function capturePhoto() {
  const width = video.videoWidth;
  const height = video.videoHeight;

  if (!width || !height) {
    throw new Error("Camera has not produced a video frame yet.");
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  // Mirror the saved photo so it matches the mirrored camera preview.
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.92);
}

function setSlotImage(slot, dataUrl, contain = false) {
  slot.textContent = "";
  const img = document.createElement("img");
  img.src = dataUrl;
  img.alt = "";
  if (contain) img.style.objectFit = "contain";
  slot.appendChild(img);
}

function resetPhotoSlots() {
  photos = [];

  slots.slice(0, 3).forEach((slot, index) => {
    slot.textContent = `Photo ${index + 1}`;
  });

  printButton.hidden = true;
  retakeButton.hidden = true;
}

async function takePhotos() {
  if (!stream) {
    await startCamera();
    if (!stream) return;
  }

  resetPhotoSlots();

  const seconds = Number(countdownSelect.value);
  CONFIG.countdownSeconds = seconds;

  startButton.disabled = true;
  countdownSelect.disabled = true;
  imageUpload.disabled = true;

  try {
    for (let i = 0; i < CONFIG.photos; i++) {
      statusText.textContent = `Get ready for photo ${i + 1} of ${CONFIG.photos}…`;

      await countdown(seconds);

      const photo = capturePhoto();
      photos.push(photo);
      setSlotImage(slots[i], photo);

      statusText.textContent = `Photo ${i + 1} captured.`;

      if (i < CONFIG.photos - 1) {
        await sleep(500);
      }
    }

    statusText.textContent = "All three photos are ready!";
    retakeButton.hidden = false;
    printButton.hidden = false;
  } catch (error) {
    console.error(error);
    statusText.textContent = "Something went wrong while taking the photos.";
  } finally {
    startButton.disabled = false;
    countdownSelect.disabled = false;
    imageUpload.disabled = false;
  }
}

function saveUploadedImage(file) {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please choose an image file.");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    try {
      localStorage.setItem(CONFIG.storageKey, reader.result);
      setBottomImage(reader.result);
      savedStatus.textContent = "Image saved in this browser.";
    } catch (error) {
      console.error(error);
      savedStatus.textContent =
        "That image is too large for browser storage. Try a smaller image.";
    }
  };

  reader.readAsDataURL(file);
}

function setBottomImage(dataUrl) {
  setSlotImage(slots[3], dataUrl, true);
}

function loadSavedImage() {
  const saved = localStorage.getItem(CONFIG.storageKey);

  if (saved) {
    setBottomImage(saved);
    savedStatus.textContent = "Saved image loaded.";
  } else {
    savedStatus.textContent = "No image saved.";
  }
}

function clearSavedImage() {
  localStorage.removeItem(CONFIG.storageKey);
  slots[3].textContent = "Your image";
  savedStatus.textContent = "No image saved.";
}

startButton.addEventListener("click", takePhotos);
retakeButton.addEventListener("click", takePhotos);

printButton.addEventListener("click", () => {
  if (photos.length !== CONFIG.photos) {
    alert("Take all three photos before printing.");
    return;
  }

  window.print();
});

imageUpload.addEventListener("change", event => {
  saveUploadedImage(event.target.files[0]);
  event.target.value = "";
});

clearImageButton.addEventListener("click", () => {
  if (confirm("Clear the saved bottom image?")) {
    clearSavedImage();
  }
});

countdownSelect.addEventListener("change", () => {
  CONFIG.countdownSeconds = Number(countdownSelect.value);
});

window.addEventListener("beforeunload", () => {
  // Stop the camera when leaving the page.
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
});

loadSavedImage();
startCamera();
