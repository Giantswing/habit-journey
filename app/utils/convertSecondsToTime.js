function convertSecondsToTime(seconds) {
    var result = "";
    //add months
    if (seconds > 2592000) {
        result += Math.floor(seconds / 2592000) + "mo ";
        seconds = seconds % 2592000;
    }

    if (seconds > 86400) {
        result += Math.floor(seconds / 86400) + "d ";
        seconds = seconds % 86400;
    }
    if (seconds > 3600) {
        result += Math.floor(seconds / 3600) + "h ";
        seconds = seconds % 3600;
    }
    if (seconds > 60) {
        result += Math.floor(seconds / 60) + "m ";
        seconds = seconds % 60;
    }
    result += seconds + "s";

    return result;
}

export default convertSecondsToTime;