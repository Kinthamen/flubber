export function getRandomNumber() {
    const minimum = 0;
    const maximum = 500;
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}