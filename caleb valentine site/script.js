/* YES BUTTON → POPUP */

const yesBtn = document.getElementById("yesBtn");
const popup = document.getElementById("popup");

yesBtn.addEventListener("click", () => {
  popup.classList.add("show");
});


/* START SLIDESHOW AFTER POPUP */

const slides = document.querySelectorAll(".slide");
const slideshow = document.querySelector(".slideshow");
const monkeysBg = document.querySelector(".monkeys-bg");
let index = 0;
let interval;
let heartInterval;
const audio = document.getElementById("bgMusic");

function startSlideshow() {
  popup.classList.remove("show");
  slideshow.classList.add("active");
  monkeysBg.classList.add("hidden");
  noBtn.style.display = "none"; // Hide the No button

  // Reset index and activate first slide
  index = 0;
  slides.forEach(slide => slide.classList.remove("active"));
  slides[index].classList.add("active");

  // Start music from 1:10 (70 seconds)
  audio.currentTime = 70;
  audio.loop = false;
  audio.play();

  // Start floating hearts
  heartInterval = setInterval(createHeart, 500);

  // Cycle through photos every 3 seconds (synced with CSS transition)
  interval = setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 3000);
}

// Stop music at 1:50 (110 seconds)
audio.addEventListener("timeupdate", () => {
  if (audio.currentTime >= 110) {
    audio.pause();
  }
});


/* NO BUTTON ESCAPES CURSOR */

const noBtn = document.getElementById("noBtn");

document.addEventListener("mousemove", (e) => {
  const rect = noBtn.getBoundingClientRect();
  
  // Check if cursor is hovering over the button
  const isHovering = (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  );

  // Only move when cursor is directly over the button
  if (isHovering) {
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    // Calculate direction away from cursor
    const angle = Math.atan2(btnCenterY - e.clientY, btnCenterX - e.clientX);
    const escapeDistance = 100;
    
    // Calculate new center position
    let newCenterX = btnCenterX + Math.cos(angle) * escapeDistance;
    let newCenterY = btnCenterY + Math.sin(angle) * escapeDistance;

    // Convert from center to top-left corner
    let newX = newCenterX - rect.width / 2;
    let newY = newCenterY - rect.height / 2;

    // Keep button within bounds with padding
    const padding = 5;
    newX = Math.max(padding, Math.min(newX, window.innerWidth - rect.width - padding));
    newY = Math.max(padding, Math.min(newY, window.innerHeight - rect.height - padding));

    noBtn.style.left = newX + "px";
    noBtn.style.top = newY + "px";
  }
});

/* FLOATING HEARTS */

function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.innerHTML = "💖";

  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration =
    Math.random() * 3 + 4 + "s"; // 4–7 sec

  document.querySelector(".hearts").appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 7000);
}

/* SONG TIMER */

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

/* Format time */
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/* Get duration */
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

/* Update current time */
audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
});
