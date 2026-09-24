const menuBtn = document.getElementById('menuBtn'); const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
function openGallery(image) {
    const lightbox = document.getElementById("galleryLightbox");
    const preview = document.getElementById("galleryPreview");

    preview.src = image.src;
    lightbox.classList.add("show");

    document.body.style.overflow = "hidden";
}

function closeGallery() {
    const lightbox = document.getElementById("galleryLightbox");

    lightbox.classList.remove("show");

    document.body.style.overflow = "";
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeGallery();
    }
});

/* =========================================
   NAVRATRI COUNTDOWN
========================================= */

function updateNavratriCountdown() {

    // 11 October 2026 - 00:00:00
    const targetDate = new Date("2026-10-11T00:00:00+05:30").getTime();

    const now = new Date().getTime();

    const difference = targetDate - now;

    if (difference <= 0) {

        document.getElementById("countDays").textContent = "00";
        document.getElementById("countHours").textContent = "00";
        document.getElementById("countMinutes").textContent = "00";
        document.getElementById("countSeconds").textContent = "00";

        return;
    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    document.getElementById("countDays").textContent =
        String(days).padStart(2, "0");

    document.getElementById("countHours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("countMinutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("countSeconds").textContent =
        String(seconds).padStart(2, "0");
}

updateNavratriCountdown();

setInterval(updateNavratriCountdown, 1000);