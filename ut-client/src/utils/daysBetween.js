export default function daysBetweenDates(date) {
    const today = new Date();
    const firstActiveDate = new Date(date);
    const diffTime = Math.abs(today - firstActiveDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}