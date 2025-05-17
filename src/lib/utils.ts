export function formatCurrency(code: number) {
    const currencies: Record<number, string> = {
        980: "₴",
        840: '$',
        978: '€',
        392: '¥',
        826: '£',
    }

    return currencies[code] || code;
}

export function addDot(num: number, currency:string) {
    const str = num.toString();
    if (str.length > 3) {
        const integerPart = str.slice(0, -2);  // усе окрім двох останніх цифр
        const decimalPart = str.slice(-2);     // останні дві цифри
        return `${integerPart}.${decimalPart} ${currency}`;
    } else {
        return str + currency
    }
}