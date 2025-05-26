import moment from "moment";

export const getDateAndTime = (date) => {

    let todayMoment = moment(); // keep this as Moment object
    let givenMoment = moment(date); // already parses the date correctly

    let todayD = todayMoment.date(); // now works
    let givenD = givenMoment.date();

    if (todayMoment.isSame(givenMoment, 'day')) {
        return givenMoment.format("HH:mm");
    }

    let yesterdayMoment = moment().subtract(1, 'days');

    if (yesterdayMoment.isSame(givenMoment, 'day')) {
        return "Yesterday";
    }

    return givenMoment.format("DD-MM-YYYY");
};

export const getTime = (date)=>{
    let givenMoment = moment(date);
    return givenMoment.format("HH:mm")
}