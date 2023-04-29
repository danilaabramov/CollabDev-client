export function declOfNum(number, arr) {
    return (number + arr[number % 100 > 4 && number % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]]);
}

export function declOfDate(data) {
    const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    const now = new Date();
    const time = new Date(Date.parse(data));
    const r = now - time;
    if (parseInt(r / 1000 / 60 / 60 / 24) > 6) return time.getDate() + " " + monthNames[time.getMonth()] + " " + time.getFullYear()
    if (parseInt(r / 1000 / 60 / 60 / 24)) return declOfNum(parseInt(r / 1000 / 60 / 60 / 24), [" день", " дня", " дней",]) + " назад"
    if (parseInt(r / 1000 / 60 / 60)) return declOfNum(parseInt(r / 1000 / 60 / 60), [" час", " часа", " часов"]) + " назад"
    if (parseInt(r / 1000 / 60)) return declOfNum(parseInt(r / 1000 / 60), [" минуту", " минуты", " минут"]) + " назад"
    if (parseInt(r / 1000)) return declOfNum(parseInt(r / 1000), [" секунду", " секунды", " секунд"]) + " назад"
    return "Только что"
}
