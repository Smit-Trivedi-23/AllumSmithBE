const SUB_20 = [
    "Zero", "One", "Two", "Three", "Four",
    "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
    "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
];

const SUB_100 = [
    "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

const POW_10 = [
    "Hundred", "Thousand", "Million", "Billion" //, ...
];

function getSub1000(buf: string[], num: number): void {
    if (num >= 100) {
        const mod = num % 100;
        buf.push(SUB_20[(num - mod)/100], POW_10[0]);
        num = mod;
    }

    if (num >= 20) {
        const mod = num % 10;
        buf.push(SUB_100[(num - mod)/10]);
        num = mod;
    }

    if (num > 0) {
        buf.push(SUB_20[num]);
    }
}

export function numberToWords(num: number): string {
    if (num === 0) {
        return SUB_20[0];
    }
    const buf: string[] = [];
    for (let i = POW_10.length - 1; num >= 1000; --i) {
        const p = 1000**i;
        if (num >= p) {
            const mod = num % p;
            getSub1000(buf, (num - mod) / p);
            buf.push(POW_10[i]);
            num = mod;
        }
    }

    getSub1000(buf, num);
    return buf.join(" ");
};



// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler
// const num = 11225225;
// export const wordify = (num) => {
//    const single = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
//    const double = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
//    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
//    const formatTenth = (digit, prev) => {
//       return 0 == digit ? "" : " " + (1 == digit ? double[prev] : tens[digit])
//    };
//    const formatOther = (digit, next, denom) => {
//       return (0 != digit && 1 != next ? " " + single[digit] : "") + (0 != next || digit > 0 ? " " + denom : "")
//    };
//    let res = "";
//    let index = 0;
//    let digit = 0;
//    let next = 0;
//    let words = [];
//    if (num += "", isNaN(parseInt(num))){
//       res = "";
//    }
//    else if (parseInt(num) > 0 && num.length <= 10) {
//       for (index = num.length - 1; index >= 0; index--) switch (digit = num[index] - 0, next = index > 0 ? num[index - 1] - 0 : 0, num.length - index - 1) {
//          case 0:
//             words.push(formatOther(digit, next, ""));
//          break;
//          case 1:
//             words.push(formatTenth(digit, num[index + 1]));
//             break;
//          case 2:
//             words.push(0 != digit ? " " + single[digit] + " Hundred" + (0 != num[index + 1] && 0 != num[index + 2] ? " and" : "") : "");
//             break;
//          case 3:
//             words.push(formatOther(digit, next, "Thousand"));
//             break;
//          case 4:
//             words.push(formatTenth(digit, num[index + 1]));
//             break;
//          case 5:
//             words.push(formatOther(digit, next, "Lakh"));
//             break;
//          case 6:
//             words.push(formatTenth(digit, num[index + 1]));
//             break;
//          case 7:
//             words.push(formatOther(digit, next, "Crore"));
//             break;
//          case 8:
//             words.push(formatTenth(digit, num[index + 1]));
//             break;
//          case 9:
//             words.push(0 != digit ? " " + single[digit] + " Hundred" + (0 != num[index + 1] || 0 != num[index + 2] ? " and" : " Crore") : "")
//       };
//       res = words.reverse().join("")
//    } else res = "";
//    return res
// };
// console.log(wordify(num));