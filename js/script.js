function generateName(
    consonantsEnabled,
    consonantsMaxRowLength,
    consonantsMinRowLength,
    consonantsMaxRowCount,
    consonantsMinRowCount,
    vowelsEnabled,
    vowelsMaxRowLength,
    vowelsMinRowLength,
    vowelsMaxRowCount,
    vowelsMinRowCount,
    numbersEnabled,
    numbersMaxRowLength,
    numbersMinRowLength,
    numbersMaxRowCount,
    numbersMinRowCount,
    wordParamsEnabled,
    wordParamsWordCount,
    wordParamsWordMaxlength,
    wordParamsWordMinlength,
    ) {
    const fullname = [];

    wordParamsWordCount = wordParamsEnabled ? wordParamsWordCount : 1;

    const minCountThresholds = [consonantsEnabled ? consonantsMinRowCount : 0,vowelsEnabled ? vowelsMinRowCount : 0,numbersEnabled ? numbersMinRowCount : 0];
    const maxCountThresholds = [consonantsEnabled ? consonantsMaxRowCount : 0,vowelsEnabled ? vowelsMaxRowCount : 0,numbersEnabled ? numbersMaxRowCount : 0];

    let biggestMinThresholdIndex = getBiggestNumbersIndexes(minCountThresholds);
    let biggestMaxThresholdIndex = getBiggestNumbersIndexes(maxCountThresholds);
    let differenceForMin = DifferenceMarginOverflow(biggestMinThresholdIndex[0], 1, minCountThresholds);
    let differenceForMax = DifferenceMarginOverflow(biggestMaxThresholdIndex[0], 1, maxCountThresholds);
    if(differenceForMin < 0)
    {
        if(biggestMinThresholdIndex[0] === 0) consonantsMinRowCount+=differenceForMin
        if(biggestMinThresholdIndex[0] === 1) vowelsMinRowCount+=differenceForMin;
        if(biggestMinThresholdIndex[0] === 2) numbersMinRowCount+=differenceForMin;
    }
    if(differenceForMax < 0)
    {
        if(biggestMaxThresholdIndex[0] === 0) consonantsMaxRowCount+=differenceForMax;
        if(biggestMaxThresholdIndex[0] === 1) vowelsMaxRowCount+=differenceForMax;
        if(biggestMaxThresholdIndex[0] === 2) numbersMaxRowCount+=differenceForMax;
    }


    for (let index = 0; index < wordParamsWordCount; index++) {

        let conRowCount = 0;
        let vowRowCount = 0;
        let numRowCount = 0;
        
        const desiredConRowCount = consonantsEnabled ? randNum(consonantsMinRowCount, consonantsMaxRowCount) : 0;
        const desiredVowRowCount = vowelsEnabled ? randNum(vowelsMinRowCount, vowelsMaxRowCount) : 0;
        const desiredNumRowCount = numbersEnabled ? randNum(numbersMinRowCount, numbersMaxRowCount) : 0;

        let lastRowType = NaN;

        let name = [];
        let counts = [desiredConRowCount, desiredVowRowCount, desiredNumRowCount];
        let biggestNumberIndexes = getBiggestNumbersIndexes(counts);
        while (true) {
            const charTypeIndex = biggestNumberIndexes[randNum(0,biggestNumberIndexes.length-1)];
            if(charTypeIndex === 0 && consonantsEnabled && conRowCount < desiredConRowCount && lastRowType != charTypeIndex) {
                name.push(generateRow(charTypeIndex, consonantsMinRowLength, consonantsMaxRowLength));
                conRowCount++;
                counts[0]--;
                lastRowType = charTypeIndex;
                biggestNumberIndexes = getBiggestNumbersIndexes([NaN, counts[1], counts[2]]);
            } else if(charTypeIndex === 1 && vowelsEnabled && vowRowCount < desiredVowRowCount && lastRowType != charTypeIndex) {
                name.push(generateRow(charTypeIndex, vowelsMinRowLength, vowelsMaxRowLength));
                vowRowCount++;
                counts[1]--;
                lastRowType = charTypeIndex;
                biggestNumberIndexes = getBiggestNumbersIndexes([counts[0], NaN, counts[2]]);
            } else if(charTypeIndex === 2 && numbersEnabled && numRowCount < desiredNumRowCount && lastRowType != charTypeIndex) {
                name.push(generateRow(charTypeIndex, numbersMinRowLength, numbersMaxRowLength));
                numRowCount++;
                counts[2]--;
                lastRowType = charTypeIndex;
                biggestNumberIndexes = getBiggestNumbersIndexes([counts[0], counts[1], NaN]);
            }
            
            if(wordParamsEnabled && name.length === wordParamsWordMaxlength || (!consonantsEnabled && !vowelsEnabled && !numbersEnabled)) break;
            if(conRowCount === desiredConRowCount && vowRowCount === desiredVowRowCount && numRowCount === desiredNumRowCount) break;
        }
        let nameJoined = name.join("");
        if(wordParamsEnabled && nameJoined.length > wordParamsWordMaxlength) {
            nameJoined=nameJoined.slice(0,wordParamsWordMaxlength-1);
        }
        fullname.push(nameJoined);
    }
    return fullname.join(" ");
}

function DifferenceMarginOverflow(index, maxdifference, values) {
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
        if(i === index) continue;
        sum+=values[i];
    }
    return (sum + maxdifference)-values[index];
}

// generate and return sequence of specified character type
function generateRow(charType, rowMinLength, rowMaxLength) {
    let arr = [];
    let rowLength = randNum(rowMinLength, rowMaxLength);
    if(charType === 0) {
        arr = "bcdfghjklmnpqrstvwxzy";
    } else if(charType === 1) {
        arr = "aeiou"; //y
    } else if (charType === 2){
        arr = "1234567890";
    }
    let result = "";
    for(let i = result.length; i < rowLength; i++) {
        result+=arr[randNum(0, arr.length-1)];
    }
    return result;
}

// return biggest numerical value of an array
function getArrayMax(array) {
    let max = Number.MIN_VALUE;
    for (let index = 0; index < array.length; index++) {
        if(array[index]>max) max = array[index];
    }
    return max;
}

// return biggest number indexes of an array
function getBiggestNumbersIndexes(numbersArray) {
    let max = getArrayMax(numbersArray);
    let result = [];
    for (let index = 0; index < numbersArray.length; index++) {
        if(numbersArray[index]===max)
            result.push(index);
    }
    return result;
} 

// min & max values should be positive
function randNum(min, max) {
    // if (max === 1) return Math.round(Math.random());
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
function configureOptionLinks() {
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

// Search and initiate link between existing dropdowns and togglers
function configureTogglerDropdown() {
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

// Break activation of all suboptions rule for capitals option
function tweakCapitalsMainOptionLinks() {
    $("#capital-mainoption-toggle-button").click(function () {
        if($(this).prop("checked")) {
            $("#capital-option-toggle-button-random").prop("checked", true)
        }
        else {
            $("#capital-option-toggle-button-random").prop("checked", false);
        }
        $("#capital-option-toggle-button-frstcap").prop("checked", false);
    });
}

// Search and initiate link between existing sliders and labels
function configureSlider() {
    const sliders = $("[id$='-option-input']");
    linkSliderWithLabel(sliders);
    linkMaxToMinSliders(sliders);
    linkMinToMaxSliders(sliders)
}

// Bind sliders with value labels
function linkSliderWithLabel(sliders) {
    sliders.each(function () {
        const sliderLabel = "#".concat("",$(this).prop("id").concat("","-value-label"));
        $(sliderLabel).text($(this).val());
        let mainToggler = "#".concat("", $(this).prop("id").split("-")[0]).concat("-mainoption-toggle-button");
        $(this).on("input", function(){
            $(sliderLabel).text($(this).val())
            $(mainToggler).prop("checked", true);
        })
    });
}

// Bind Max to Min sliders
function linkMaxToMinSliders(sliders) {
    sliders.each(function () {
        if($(this).prop("id").includes("min")) {
            const sliderPairID = "#".concat("", $(this).prop("id")).replace("min", "max");
            $(this).on("input", function(){
                if(parseInt($(sliderPairID).val()) <= parseInt($(this).val())) {
                    $(sliderPairID).val($(this).val());
                    const sliderLabel = "#".concat("",$(sliderPairID).prop("id").concat("","-value-label"));
                    $(sliderLabel).text($(sliderPairID).val())
                }
            })
        }
    });
}
// Bind Min to Max sliders
function linkMinToMaxSliders(sliders) {
    sliders.each(function () {
        if($(this).prop("id").includes("max")) {
            const sliderPairID = "#".concat("", $(this).prop("id")).replace("max", "min");
            $(this).on("input", function(){
                if(parseInt($(sliderPairID).val()) > parseInt($(this).val())) {
                    $(sliderPairID).val($(this).val());
                    const sliderLabel = "#".concat("",$(sliderPairID).prop("id").concat("","-value-label"));
                    $(sliderLabel).text($(sliderPairID).val())
                }
            })
        }
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
                    $("#conson-mainoption-toggle-button").prop("checked"),
                    parseInt($("#conson-maxrowlength-option-input").val()),
                    parseInt($("#conson-minrowlength-option-input").val()),
                    parseInt($("#conson-maxrowcount-option-input").val()),
                    parseInt($("#conson-minrowcount-option-input").val()),
                    $("#vowels-mainoption-toggle-button").prop("checked"),
                    parseInt($("#vowels-maxrowlength-option-input").val()),
                    parseInt($("#vowels-minrowlength-option-input").val()),
                    parseInt($("#vowels-minrowcount-option-input").val()),
                    parseInt($("#vowels-minrowcount-option-input").val()),
                    $("#numbers-mainoption-toggle-button").prop("checked"),
                    parseInt($("#numbers-maxrowlength-option-input").val()),
                    parseInt($("#numbers-minrowlength-option-input").val()),
                    parseInt($("#numbers-minrowcount-option-input").val()),
                    parseInt($("#numbers-minrowcount-option-input").val()),
                    $("#wordparams-mainoption-toggle-button").prop("checked"),
                    parseInt($("#wordparams-wordcount-option-input").val()),
                    parseInt($("#wordparams-maxlength-option-input").val()),
                    parseInt($("#wordparams-minlength-option-input").val()),
                )
            );
        }
    });

    configureTogglerDropdown();

    configureOptionLinks();

    tweakCapitalsMainOptionLinks();

    configureSlider();

    $($("#all-options-dropdown-toggle-button")).click(function() {
        $("[id$='-options-dropdown']").css("display") === "none"
                ? $("[id$='-options-dropdown']").css("display", "grid")
                : $("[id$='-options-dropdown']").css("display", "none");
    });
    
});

