export const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

export const removeWhiteSpaces = (strVal) => strVal.replace(/\s/g,'');

export const strEqual = (val_a, val_b) => removeWhiteSpaces(val_a.toLowerCase()) === removeWhiteSpaces(val_b.toLowerCase());