const hello = require('./script');
test("Returns word with length of 6", () => {
    const result = hello.generateName(true,1,1,3,3,true,1,1,3,3,false,1,1,1,1,false,1,1,1);
    console.log(`Result length was: ${result.length}`);
    expect(result.length === 6 || result.length === 7).toBe(true);
});