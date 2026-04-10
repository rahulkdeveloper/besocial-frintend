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

export const getTime = (date) => {
    let givenMoment = moment(date);
    return givenMoment.format("HH:mm")
}

export const getCompleteTime = (date) => {
    if (!date) return;
    let givenMoment = moment(date);
    return givenMoment.format("HH:mm, D MMMM YYYY");
};

export const textShorter = (text) => {
    if (text.length > 25) {
        text = `${text.slice(0, 25)}...`
    }
    return text
}

export const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
};

export const filterChatrooms = (chatrooms, keyword) => {

    if (!keyword || !keyword.trim()) {

        return chatrooms;
    } // 👈 handle empty
    const search = keyword.toLowerCase().trim();

    return chatrooms.filter(room => {
        if (room.chatType === "single") {
            const { fullname, bio, username } = room.friend || {};

            return (
                fullname?.toLowerCase().includes(search) ||
                bio?.toLowerCase().includes(search) ||
                username?.toLowerCase().includes(search)
            );
        }

        if (room.chatType === "group") {
            return room.name?.toLowerCase().includes(search);
        }

        return false;
    });
}