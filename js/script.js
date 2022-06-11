/* eslint-disable no-undef */

function generateName(
    consonantsConsecFlag,
    vowelConsecFlag,
    consecMaxStr,
    customLengthFlag,
    lenMaxStr,
    lenMinStr,
    wCountFlag,
    wCountStr,
    numbersFlag,
    numbersMaxStr
) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz1234567890".split("");

    let numMax = 0;
    let lenMin = 0;
    let lenMax = 0;

    if (customLengthFlag) {
        lenMin = parseInt(lenMinStr);
        lenMax = parseInt(lenMaxStr);
    }
    if (numbersFlag) numMax = parseInt(numbersMaxStr);

    let wCount = wCountFlag ? parseInt(wCountStr) : 1;
    let consecMax = parseInt(consecMaxStr);

    if (isNaN(lenMin) || lenMin === 0) lenMin = 3;
    if (isNaN(lenMax) || lenMax === 0) lenMax = 10;
    if (isNaN(numMax) || numMax === 0) numMax = 1;
    if (isNaN(consecMax) || consecMax === 0) consecMax = 1;
    if (isNaN(wCount) || wCount === 0) wCount = 1;

    if (consonantsConsecFlag === undefined) consonantsConsecFlag = false;
    if (vowelConsecFlag === undefined) vowelConsecFlag = false;

    const fullname = [];

    for (let index = 0; index < wCount; index++) {
        const prgnNameLength = randNum(lenMin, lenMax);
        let conCounter = 0;
        let vowCounter = 0;
        let numCounter = 0;
        const name = [];

        while (name.length < prgnNameLength) {
            const newLetter = alphabet[randNum(0, 35)];
            if (isVowel(newLetter)) {
                if (vowCounter >= consecMax || (vowCounter > 0 && !vowelConsecFlag))
                    continue;
                conCounter = 0;
                numCounter = 0;
                vowCounter++;
            } else if (isConsonant(newLetter)) {
                if (
                    conCounter >= consecMax ||
                    (conCounter > 0 && !consonantsConsecFlag)
                )
                    continue;
                vowCounter = 0;
                numCounter = 0;
                conCounter++;
            } else if (isNumber(newLetter)) {
                if (numCounter >= numMax || !numbersFlag) continue;
                conCounter = 0;
                vowCounter = 0;
                numCounter++;
            }
            name.push(newLetter);
        }
        fullname.push(name.join(""));
    }

    const result = fullname.join(" ");
    return result;
}

function isVowel(elem) {
    const vowels = "aeiouy".split("");
    return vowels.includes(elem);
}

function isConsonant(elem) {
    const consonants = "bcdfghjklmnpqrstvwxz".split("");
    return consonants.includes(elem);
}

function isNumber(elem) {
    const numbers = "1234567890".split("");
    return numbers.includes(elem);
}

// min & max values should be positive
function randNum(min, max) {
    if (max === 1) return Math.round(Math.random());
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Changes checked status of parent option if any children is checked or all are unchecked
function followChildrenOptions(mainOptionButtons) {
    mainOptionButtons.each(function () {
        const ctgrName = $(this).prop("id").split("-");
        const mainOptT = $(this);
        const allSuboptionsOfCategorySelector = $(
            "[id*=".concat("", ctgrName[0].concat("", "-option-toggle-button]"))
        );
        $(allSuboptionsOfCategorySelector).on("click", function () {
            if ($(this).prop("checked")) {
                $(mainOptT).prop("checked", true);
            } else {
                let isAllUnchecked = true;
                $(allSuboptionsOfCategorySelector).each(function () {
                    if ($(this).prop("checked")) isAllUnchecked = false;
                });
                $(mainOptT).prop("checked", !isAllUnchecked);
            }
        });
    });
}
// Search for existing option buttons and execute linking
function ConfigureOptionLinks() {
    const mOpts = $("[id*='mainoption-toggle-button']");
    followMainOption(mOpts);
    followChildrenOptions(mOpts);
}

// Force suboptions buttons to follow main option button
function followMainOption(mainOptionButtons) {
    mainOptionButtons.each(function () {
        const ctgrName = $(this).prop("id").split("-");
        const allSuboptionsOfCategorySelector = "[id*=".concat(
            "",
            ctgrName[0].concat("", "-option-toggle-button]")
        );
        $(this).on("click", function () {
            $(this).prop("checked")
                ? $(allSuboptionsOfCategorySelector).prop("checked", true)
                : $(allSuboptionsOfCategorySelector).prop("checked", false);
        });
    });
}

function ConfigureTogglerDropdown() {
    const dTBs = $("[id*='options-dropdown-toggle-button']");
    linkTogglerToDropdown(dTBs);
}

// Link toggler with dropdown
function linkTogglerToDropdown(toggleButtons) {
    toggleButtons.each(function () {
        const ctgrName = $(this).prop("id").split("-");
        const dropdownElementStrId = "#".concat(
            "",
            ctgrName[0]
                .concat("", "-")
                .concat("", ctgrName[1])
                .concat("", "-dropdown")
        );
        $(this).on("click", () => {
            $(dropdownElementStrId).css("display") === "none"
                ? $(dropdownElementStrId).css("display", "grid")
                : $(dropdownElementStrId).css("display", "none");
        });
    });
}

$(document).ready(() => {
    $("#generateName").click(() => {
        const myInterval = setInterval(randomTextAnimation, 10);
        let counter = 0;
        randomTextAnimation();

        // Random symbols animation
        function randomTextAnimation() {
            const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
            const animTextLength = randNum(4, 10);
            const animText = [];

            while (animText.length < animTextLength) {
                animText.push(alphabet[randNum(0, 26)]);
            }
            $("#nf").prop("value", animText.join(""));
            counter++;
            if (counter === 20) {
                stopAnimationGenerateName();
            }
        }

        function stopAnimationGenerateName() {
            clearInterval(myInterval);
            $("#nf").prop(
                "value",
                generateName(
                    $("#consec-option-toggle-button-conson").prop("checked"),
                    $("#consec-option-toggle-button-vowels").prop("checked"),
                    $("#consec-maxrow-option-input").val(),
                    $("#length-mainoption-toggle-button").prop("checked"),
                    $("#length-maxlength-option-input").val(),
                    $("#length-minlength-option-input").val(),
                    $("#wordcount-mainoption-toggle-button").prop("checked"),
                    $("#wordcount-option-input").val(),
                    $("#numbers-mainoption-toggle-button").prop("checked"),
                    $("#numbers-maxrow-option-input").val()
                )
            );
        }
    });

    ConfigureTogglerDropdown();

    ConfigureOptionLinks();

    $($("#all-options-dropdown-toggle-button")).click(function() {
        $("[id$='-options-dropdown']").css("display") === "none"
                ? $("[id$='-options-dropdown']").css("display", "grid")
                : $("[id$='-options-dropdown']").css("display", "none");
        });
});
