const fs = require("fs");

const membersFile = "members.txt";
const mapFile = "members-map.json";

const members = fs.readFileSync(membersFile, "utf8")
    .split(/\r?\n/)
    .map(name => name.trim())
    .filter(Boolean);

/*
 * Existing corrections are preserved.
 * If you manually correct a Marathi name in
 * members-map.json, generator won't overwrite it.
 */
let existingMap = {};

if (fs.existsSync(mapFile)) {
    try {
        existingMap = JSON.parse(
            fs.readFileSync(mapFile, "utf8")
        );
    } catch {
        existingMap = {};
    }
}

/*
 * Roman → Marathi basic transliteration
 */

const consonants = {
    "kh": "ख",
    "gh": "घ",
    "ch": "च",
    "jh": "झ",
    "th": "थ",
    "dh": "ध",
    "ph": "फ",
    "bh": "भ",
    "sh": "श",
    "tr": "त्र",
    "dr": "द्र",
    "kr": "क्र",
    "gr": "ग्र",
    "pr": "प्र",
    "br": "ब्र",
    "fr": "फ्र",
    "kl": "क्ल",
    "gl": "ग्ल",
    "pl": "प्ल",
    "bl": "ब्ल",
    "v": "व",
    "w": "व",
    "k": "क",
    "g": "ग",
    "c": "क",
    "j": "ज",
    "t": "त",
    "d": "द",
    "n": "न",
    "p": "प",
    "b": "ब",
    "m": "म",
    "y": "य",
    "r": "र",
    "l": "ल",
    "s": "स",
    "h": "ह"
};

const vowels = {
    "aa": "आ",
    "ee": "ई",
    "ii": "ई",
    "oo": "ऊ",
    "uu": "ऊ",
    "ai": "ऐ",
    "au": "औ",
    "a": "अ",
    "i": "इ",
    "u": "उ",
    "e": "ए",
    "o": "ओ"
};

function transliterateWord(word) {

    let result = "";
    let i = 0;

    word = word.toLowerCase();

    while (i < word.length) {

        let matched = false;

        // consonants
        for (const key of Object.keys(consonants)
            .sort((a, b) => b.length - a.length)) {

            if (word.startsWith(key, i)) {

                result += consonants[key];

                i += key.length;
                matched = true;

                // Check vowel after consonant
                for (const vowel of Object.keys(vowels)
                    .sort((a, b) => b.length - a.length)) {

                    if (word.startsWith(vowel, i)) {

                        if (vowel === "a") {
                            i += vowel.length;
                        } else {
                            result += getMatra(vowel);
                            i += vowel.length;
                        }

                        break;
                    }
                }

                continue;
            }
        }

        if (matched) continue;


        // standalone vowel
        for (const vowel of Object.keys(vowels)
            .sort((a, b) => b.length - a.length)) {

            if (word.startsWith(vowel, i)) {

                result += vowels[vowel];

                i += vowel.length;

                matched = true;

                break;
            }
        }

        if (matched) continue;


        result += word[i];

        i++;
    }

    return result;
}


function getMatra(vowel) {

    const matras = {
        "aa": "ा",
        "ee": "ी",
        "ii": "ी",
        "oo": "ू",
        "uu": "ू",
        "ai": "ै",
        "au": "ौ",
        "i": "ि",
        "u": "ु",
        "e": "े",
        "o": "ो"
    };

    return matras[vowel] || "";
}


function generateMarathi(name) {

    return name
        .split(/\s+/)
        .map(word => transliterateWord(word))
        .join(" ");
}


/*
 * Generate only missing mappings.
 * Existing corrections stay untouched.
 */

const updatedMap = { ...existingMap };

members.forEach(name => {

    const key = name.toLowerCase();

    if (!updatedMap[key]) {

        updatedMap[key] = generateMarathi(name);

        console.log(
            `${name} → ${updatedMap[key]}`
        );
    }

});


fs.writeFileSync(
    mapFile,
    JSON.stringify(updatedMap, null, 4) + "\n",
    "utf8"
);

console.log("\n✅ members-map.json updated successfully.");