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
                generateName(new SymbolParameters($("#conson-mainoption-toggle-button").prop("checked"),
                    parseInt($("#conson-maxrowlength-option-input").val()),
                    parseInt($("#conson-minrowlength-option-input").val()),
                    parseInt($("#conson-maxrowcount-option-input").val()),
                    parseInt($("#conson-minrowcount-option-input").val())),
                    new SymbolParameters($("#vowels-mainoption-toggle-button").prop("checked"),
                    parseInt($("#vowels-maxrowlength-option-input").val()),
                    parseInt($("#vowels-minrowlength-option-input").val()),
                    parseInt($("#vowels-maxrowcount-option-input").val()),
                    parseInt($("#vowels-minrowcount-option-input").val())),
                    new SymbolParameters($("#numbers-mainoption-toggle-button").prop("checked"),
                    parseInt($("#numbers-maxrowlength-option-input").val()),
                    parseInt($("#numbers-minrowlength-option-input").val()),
                    parseInt($("#numbers-maxrowcount-option-input").val()),
                    parseInt($("#numbers-minrowcount-option-input").val())),
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

class SymbolParameters {
    constructor(enabled, maxRowLength, minRowLength, maxRowCount, minRowCount) {
        this.enabled = enabled;
        this.maxRowLength = maxRowLength;
        this.minRowLength = minRowLength;
        this.maxRowCount = maxRowCount;
        this.minRowCount = minRowCount;
    }
}