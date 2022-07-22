function generateName(
    consonants,
    vowels,
    numbers,
    wordParamsEnabled,
    wordParamsWordCount,
    wordParamsWordMaxlength,
    wordParamsWordMinlength,
    ) {
    const fullname = [];

    wordParamsWordCount = wordParamsEnabled ? wordParamsWordCount : 1;

    const minCountThresholds = [consonants.enabled ? consonants.minRowCount : 0,vowels.enabled ? vowels.minRowCount : 0,numbers.enabled ? numbers.minRowCount : 0];
    const maxCountThresholds = [consonants.enabled ? consonants.maxRowCount : 0,vowels.enabled ? vowels.maxRowCount : 0,numbers.enabled ? numbers.maxRowCount : 0];
    let biggestMinThresholdIndex = getBiggestNumbersIndexes(minCountThresholds);
    let biggestMaxThresholdIndex = getBiggestNumbersIndexes(maxCountThresholds);
    let differenceForMin = DifferenceMarginOverflow(biggestMinThresholdIndex[0], 1, minCountThresholds);
    let differenceForMax = DifferenceMarginOverflow(biggestMaxThresholdIndex[0], 1, maxCountThresholds);

    if(differenceForMin < 0)
    {
        if(biggestMinThresholdIndex[0] === 0) consonants.minRowCount+=differenceForMin
        if(biggestMinThresholdIndex[0] === 1) vowels.minRowCount+=differenceForMin;
        if(biggestMinThresholdIndex[0] === 2) numbers.minRowCount+=differenceForMin;
    }
    if(differenceForMax < 0)
    {
        if(biggestMaxThresholdIndex[0] === 0) consonants.maxRowCount+=differenceForMax;
        if(biggestMaxThresholdIndex[0] === 1) vowels.maxRowCount+=differenceForMax;
        if(biggestMaxThresholdIndex[0] === 2) numbers.maxRowCount+=differenceForMax;
    }

    for (let index = 0; index < wordParamsWordCount; index++) {

        let conRowCount = 0;
        let vowRowCount = 0;
        let numRowCount = 0;
        
        const desiredConRowCount = consonants.enabled ? randNum(consonants.minRowCount, consonants.maxRowCount) : 0;
        const desiredVowRowCount = vowels.enabled ? randNum(vowels.minRowCount, vowels.maxRowCount) : 0;
        const desiredNumRowCount = numbers.enabled ? randNum(numbers.minRowCount, numbers.maxRowCount) : 0;

        let lastRowType = NaN;

        let name = [];
        let counts = [desiredConRowCount, desiredVowRowCount, desiredNumRowCount];
        let biggestNumberIndexes = getBiggestNumbersIndexes(counts);
        while (true) {
            const charTypeIndex = biggestNumberIndexes[randNum(0,biggestNumberIndexes.length-1)];
            if(charTypeIndex === 0 && consonants.enabled && conRowCount < desiredConRowCount && lastRowType != charTypeIndex) {
                name.push(generateRow(charTypeIndex, consonants.minRowLength, consonants.maxRowLength));
                conRowCount++;
                counts[0]--;
                lastRowType = charTypeIndex;
                biggestNumberIndexes = getBiggestNumbersIndexes([NaN, counts[1], counts[2]]);
            } else if(charTypeIndex === 1 && vowels.enabled && vowRowCount < desiredVowRowCount && lastRowType != charTypeIndex) {
                name.push(generateRow(charTypeIndex, vowels.minRowLength, vowels.maxRowLength));
                vowRowCount++;
                counts[1]--;
                lastRowType = charTypeIndex;
                biggestNumberIndexes = getBiggestNumbersIndexes([counts[0], NaN, counts[2]]);
            } else if(charTypeIndex === 2 && numbers.enabled && numRowCount < desiredNumRowCount && lastRowType != charTypeIndex) {
                name.push(generateRow(charTypeIndex, numbers.minRowLength, numbers.maxRowLength));
                numRowCount++;
                counts[2]--;
                lastRowType = charTypeIndex;
                biggestNumberIndexes = getBiggestNumbersIndexes([counts[0], counts[1], NaN]);
            }
            
            if(wordParamsEnabled && name.length === wordParamsWordMaxlength || (!consonants.enabled && !vowels.enabled && !numbers.enabled)) break;
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

// return difference between passed argument and array sum + margin
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

exports.generateName = generateName;