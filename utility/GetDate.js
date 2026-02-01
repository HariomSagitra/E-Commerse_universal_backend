export function getDate() {
    const today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
 
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
 
    return `${day}_${month}_${year}`;
}
 
export function getDateTime() {
    const date = new Date();
    const formatData = (input) => (input > 9 ? input : `0${input}`);
 
    const dd = formatData(date.getDate());
    const mm = formatData(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    const HH = formatData(date.getHours());
    const MM = formatData(date.getMinutes());
    const SS = formatData(date.getSeconds());
 
    return `${dd}_${mm}_${yyyy}_${HH}_${MM}_${SS}`; // ✅ No Colon
}
 
 