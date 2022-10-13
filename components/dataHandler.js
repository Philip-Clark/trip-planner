import AsyncStorage from '@react-native-async-storage/async-storage';

//? ADD ITEM
export default async function addItem(itemType, value, trace, callback) {
  await getData().then(async (response) => {
    if (response == null) {
      response = [];
    }
    // perform proper functions based on item type
    switch (itemType) {
      case 'trip':
        addTrip(value, response, callback);
        break;

      case 'day':
        addDay(trace, response, callback);
        break;

      case 'event':
        await addEvent(value, trace, response, callback);
        break;

      default:
        console.log(itemType + ' Did not match allowed types. \n allowed types: trip, day, event');
        break;
    }
  });
  async function addEvent(value, trace, data, callback) {
    const tripID = parseInt(trace.tripID) - 1;
    const dayID = parseInt(trace.dayID) - 1;
    const eventArray = data[tripID].days[dayID].events;
    const eventId = Date.now();
    const event = {
      id: eventId,
      name: value.title,
      data: value.description,
      departure: value.time,
      startTime: value.startTime,
      type: value.type,
      duration: value.duration != null ? value.duration : 0,
      trace: `${tripID} -  ${dayID}`,
    };
    eventArray.push(event);
    await storeData(data, callback, event);
  }

  function addDay(trace, data, callback) {
    const tripID = parseInt(trace.tripID) - 1;
    const dayID = parseInt(data[tripID].days.length + 1);
    const dayArray = data[tripID].days;
    dayArray.push({
      id: dayID,
      events: [],
    });
    storeData(data, callback);
  }
  function addTrip(value, data, callback) {
    const tripID = parseInt(data.length + 1);
    let startDate = value.startDate.split('/');
    let endDate = value.endDate.split('/');
    if (value.imported == true) {
      value.startDate = `${startDate[2]}/${startDate[0]}/${startDate[1]}`;
      value.endDate = `${endDate[2]}/${endDate[0]}/${endDate[1]}`;
      value.name = value.name.split('.')[0];
    }

    data.push({
      id: tripID,
      name: value.name,
      leaveDate: value.startDate,
      returnDate: value.endDate,
      days: [],
    });

    // Get the number of day the trip is scheduled to be
    startDate = value.startDate.split('/');
    endDate = value.endDate.split('/');
    const convertedStartDate = new Date(`${startDate[1]}/${startDate[2]}/${startDate[0]}`);
    const convertedEndDate = new Date(`${endDate[1]}/${endDate[2]}/${endDate[0]}`);
    const differenceInMins = convertedEndDate.getTime() - convertedStartDate.getTime();
    const differenceInDays = differenceInMins / (1000 * 3600 * 24);
    // add a day for each day of the trip
    for (let i = 0; i <= differenceInDays; i++) {
      addDay({ tripID: tripID }, data, () => {});
    }

    storeData(data, callback);
  }
}
//? REMOVE ITEM
export function removeItem(itemType, trace, item, callback) {
  getData().then((response) => {
    // perform proper functions based on item type
    switch (itemType) {
      case 'trip':
        removeTrip(trace, response, item, callback);
        break;

      case 'day':
        removeDay(trace, response, item, callback);
        break;

      case 'event':
        removeEvent(trace, response, item, callback);
        break;

      default:
        console.log(itemType + ' Did not match allowed types. \n allowed types: trip, day, event');
        break;
    }
  });
  function removeEvent(trace, data, item, callback) {
    const tripID = parseInt(trace.tripID) - 1;
    const dayID = parseInt(trace.dayID) - 1;
    const eventArray = data[tripID].days[dayID].events;
    const eventWithId = eventArray.find((event) => {
      return event.id === trace.eventID;
    });
    const eventIndex = eventArray.indexOf(eventWithId);

    eventArray.splice(eventIndex, 1);

    storeData(data, callback);
  }

  function removeDay(trace, data, item, callback) {
    const tripID = parseInt(trace.tripID) - 1;
    const dayArray = data[tripID].days;
    dayArray.splice(trace.dayID - 1, 1);

    storeData(data, callback);
  }

  function removeTrip(trace, data, item, callback) {
    data.splice(trace.tripID - 1, 1);

    storeData(data, callback);
  }
}
//? EDIT ITEM
export async function editItem(itemType, trace, newData, callback) {
  getData().then(async (response) => {
    // perform proper functions based on item type
    switch (itemType) {
      case 'trip':
        editTrip(trace, response, newData, callback);
        break;

      case 'day':
        editDay(trace, response, newData, callback);
        break;

      case 'event':
        await editEvent(trace, response, newData, callback);
        break;

      default:
        console.log(itemType + ' Did not match allowed types. \n allowed types: trip, day, event');
        break;
    }
  });
  async function editEvent(trace, response, newData, callback) {
    const tripID = parseInt(trace.tripID) - 1;
    const dayID = parseInt(trace.dayID) - 1;
    const eventArray = response[tripID].days[dayID].events;
    const eventWithId = eventArray.find((obj) => {
      return obj.id == trace.eventID;
    });
    const indexOfEvent = eventArray.indexOf(eventWithId);
    const item = eventArray[indexOfEvent];

    item.name = newData.name;
    item.data = newData.data;
    item.departure = newData.departure;
    item.startTime = newData.startTime;
    // data: value.description,
    // departure: value.time,
    // startTime: value.startTime,
    // type: value.type,
    // duration: value.duration != null ? value.duration : 0,

    await storeData(response, callback);
  }
  // ! Currently Unused
  function editTrip(value, data, callback) {
    const tripID = parseInt(data.length + 1);

    data.push({
      id: tripID,
      name: value.name,
      leaveDate: value.startDate,
      returnDate: value.endDate,
      days: [],
    });

    // Get the number of day the trip is scheduled to be
    const startDate = value.startDate.split('/');
    const endDate = value.endDate.split('/');
    const convertedStartDate = new Date(`${startDate[1]}/${startDate[2]}/${startDate[0]}`);
    const convertedEndDate = new Date(`${endDate[1]}/${endDate[2]}/${endDate[0]}`);
    const differenceInMins = convertedEndDate.getTime() - convertedStartDate.getTime();
    const differenceInDays = differenceInMins / (1000 * 3600 * 24);
    // add a day for each day of the trip
    for (let i = 0; i <= differenceInDays; i++) {
      addDay({ tripID: tripID }, data, () => {});
    }

    storeData(data, callback);
  }
}

export async function storeData(value, callback, event) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('dataKey', jsonValue).then(() => {
      callback(value, event);
    });
  } catch (e) {
    console.log(e);
  }
}

export async function getData() {
  try {
    const jsonValue = await AsyncStorage.getItem('dataKey');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.log(e);
    console.log('=================  ERROR   ===========================');
  }
}
