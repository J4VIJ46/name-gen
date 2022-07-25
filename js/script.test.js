const hello = require('./script');

// Probably will need an update to handle other symbol types in the future in more generic implementation

test("Name length range matching", () => {
    const result = hello.generateName(
        new SymbolParameters(true,1,1,3,3),
        new SymbolParameters(true,1,1,3,2),
        new SymbolParameters(false,1,1,1,1),
        false,1,1,1);
    //console.log(`Result length was: ${result.length}`);
    expect(result.length <= 6 && result.length >= 5).toBe(true);
});

// test has chance to return false negative due to generating similiar 
// result lengthes during all for loop iterations.
// higher loop iterations count leads to lower false negative probability.
test("Word length cases range coverage", () => {
    let maxLength = Number.MIN_VALUE;
    let minLength = Number.MAX_VALUE;
    for (let index = 0; index < 1000; index++) {
        const result = hello.generateName(
            new SymbolParameters(true,1,1,3,3),
            new SymbolParameters(true,1,1,3,2),
            new SymbolParameters(false,1,1,1,1),
            false,1,1,1);
        if(result.length > maxLength) maxLength = result.length;
        if(result.length < minLength) minLength = result.length;
    }
    //console.log(`Result max length was: ${maxLength}, min length was: ${minLength}`);
    expect(minLength != maxLength).toBe(true);
});

// Ensures symbol quantities for a given set of parameters
test("Word symbol types count", () => {
    const result = hello.generateName(
        new SymbolParameters(true,1,1,3,3),
        new SymbolParameters(true,1,1,3,2),
        new SymbolParameters(false,1,1,1,1),
        false,1,1,1);
    let symbolCounts = countSymbolsByCategory(result);
    expect(symbolCounts["consonant"]).toBe(3);
    // console.log(`Vowel count was ${symbolCounts["vowel"]}`);
    expect(symbolCounts["vowel"] === 2 || symbolCounts["vowel"] === 3).toBeTruthy();
    expect(symbolCounts["number"]).toBe(0);
});

// Classifies symbol as consonant, vowel or number
// Doesn't handle Y vowel/consonant definition properly.
function getSymbolCategory(symbol) {
    const array = ["bcdfghjklmnpqrstvwxzy", "aeiou", "0123456789"];
    // console.log(`Symbol was "${symbol}"`);
    let category = "";
    for (const key in array) {
        // console.log(`Key was "${key}"`);
        if (array[key].includes(symbol)) {
            category = key == 0 ? "consonant" : key == 1 ? "vowel" : key == 2 ? "number" : "";
        }
    }
    if(category != "") return category;
    // console.log(`Category was "${category}"`);
    throw new Error("Symbol category was undefined");
}

// Counts name symbols by categories (consonants, vowels, numbers)
function countSymbolsByCategory(symbols) {
    let dictionary = {
        "consonant": 0,
        "vowel": 0,
        "number": 0
    }
    for (const key in symbols) {
        let category = getSymbolCategory(symbols[key]);
        dictionary[category]++;
    }
    return dictionary;
}

class SymbolParameters {
    constructor(enabled, maxRowLength, minRowLength, maxRowCount, minRowCount) {
        this.enabled = enabled;
        this.maxRowLength = maxRowLength;
        this.minRowLength = minRowLength;
        this.maxRowCount = maxRowCount;
        this.minRowCount = minRowCount;
    }
}