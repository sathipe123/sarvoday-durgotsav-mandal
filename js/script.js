const menuBtn = document.getElementById('menuBtn'); const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

/* =========================================
   SDM GALLERY
========================================= */


/* =========================================
   OPEN GALLERY
========================================= */

function openGallery(image) {

    const lightbox =
        document.getElementById("galleryLightbox");

    const preview =
        document.getElementById("galleryPreview");


    if (!lightbox || !preview || !image) {
        return;
    }


    preview.src = image.src;

    preview.alt =
        image.alt || "Gallery Preview";


    lightbox.classList.add("show");


    document.body.style.overflow = "hidden";
}


/* =========================================
   CLOSE GALLERY
========================================= */

function closeGallery() {

    const lightbox =
        document.getElementById("galleryLightbox");


    if (!lightbox) {
        return;
    }


    lightbox.classList.remove("show");


    document.body.style.overflow = "";
}


/* =========================================
   VIEW ALL GALLERY
========================================= */

function showAllGallery() {

    const extraImages =
        document.querySelectorAll(".gallery-extra");


    /*
     * If future images have been added,
     * reveal them.
     */

    if (extraImages.length > 0) {

        extraImages.forEach(function (item) {

            item.style.display = "block";

        });


        const mobileButton =
            document.querySelector(".gallery-mobile-action");

        if (mobileButton) {
            mobileButton.style.display = "none";
        }


        /*
         * Scroll slightly to the newly revealed
         * gallery content.
         */

        const lastImage =
            extraImages[0];

        if (lastImage) {

            setTimeout(function () {

                lastImage.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }, 100);

        }

        return;
    }


    /*
     * Currently there are no extra images.
     * This message is only temporary until
     * more gallery images are added.
     */

    alert("लवकरच आणखी क्षणचित्रे येथे जोडली जातील. 🙏");
}


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeGallery();

        }

    }
);


/* =========================================
   PREVENT LIGHTBOX IMAGE CLICK
   FROM CLOSING LIGHTBOX
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const preview =
            document.getElementById("galleryPreview");


        if (preview) {

            preview.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                }
            );

        }

    }
);



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

/* =========================================
   SDM MEMBERS
========================================= */

async function loadMembers() {

    const membersList = document.getElementById("membersList");

    if (!membersList) {
        console.log("membersList not found");
        return;
    }

    try {

        const membersResponse = await fetch("./members.txt");

        if (!membersResponse.ok) {
            throw new Error("members.txt not found");
        }

        const membersText = await membersResponse.text();

        const names = membersText
            .split(/\r?\n/)
            .map(name => name.trim())
            .filter(Boolean);


        /* Load Marathi mapping */

        let memberMap = {};

        try {

            const mapResponse = await fetch("./members-map.json");

            if (mapResponse.ok) {
                memberMap = await mapResponse.json();
            }

        } catch (error) {

            console.warn(
                "members-map.json not available",
                error
            );

        }


        /* Clear old members */

        membersList.innerHTML = "";


        /* Generate members */

        names.forEach((name, index) => {

            const key = name.toLowerCase().trim();

            const marathiName =
                memberMap[key] ||
                memberMap[name] ||
                name;


            const card = document.createElement("div");

            card.className = "member-name";

            card.innerHTML = `
                <span class="member-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <strong>
                    ${marathiName}
                </strong>
            `;

            membersList.appendChild(card);

        });


        console.log("Members loaded:", names);
        console.log("Member mapping:", memberMap);

    } catch (error) {

        console.error(
            "Members loading failed:",
            error
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    loadMembers
);

/* =========================================
   GOATCOUNTER TOTAL VISITOR COUNT
========================================= */

function loadVisitorCount() {

    const visitorCount =
        document.getElementById("visitorCount");

    if (!visitorCount) return;

    const counterUrl =
        "https://sdmlakhamapur.goatcounter.com/counter/TOTAL.json";

    fetch(counterUrl)

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Visitor count request failed: " +
                    response.status
                );
            }

            return response.json();

        })

        .then(data => {

            visitorCount.textContent =
                data.count || "0";

        })

        .catch(error => {

            console.error(
                "Visitor count error:",
                error
            );

            visitorCount.textContent = "—";

        });
}


document.addEventListener(
    "DOMContentLoaded",
    loadVisitorCount
);