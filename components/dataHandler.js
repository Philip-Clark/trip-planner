import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export default async function addItem(itemType, value, trace, callback) {
  await getData().then(async (response) => {
    if (response == null) {
      response = [];
    }
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
}

export function removeItem(itemType, trace, item, callback) {
  getData().then((response) => {
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
}

export async function editItem(itemType, trace, newData, callback) {
  getData().then(async (response) => {
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
}

/**
 *
 * @param {{title: string, description: string, time: string,}} value
 * @param {String} trace
 */
async function addEvent(value, trace, data, callback) {
  const tripID = parseInt(trace.tripID) - 1;
  const dayID = parseInt(trace.dayID) - 1;
  let eventArray = data[tripID].days[dayID].events;
  let eventId = Date.now();

  let event = {
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
// addItem(itemType, value, trace, callback)
// addDay(trace, response, callback);
function addDay(trace, data, callback) {
  const tripID = parseInt(trace.tripID) - 1;
  const dayID = parseInt(data[tripID].days.length + 1);

  let dayArray = data[tripID].days;

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
    console.log(startDate);
  }

  data.push({
    id: tripID,
    name: value.name,
    leaveDate: value.startDate,
    returnDate: value.endDate,
    days: [],
  });

  startDate = value.startDate.split('/');
  endDate = value.endDate.split('/');

  const convertedStartDate = new Date(`${startDate[1]}/${startDate[2]}/${startDate[0]}`);
  const convertedEndDate = new Date(`${endDate[1]}/${endDate[2]}/${endDate[0]}`);

  const differenceInMins = convertedEndDate.getTime() - convertedStartDate.getTime();

  const differenceInDays = differenceInMins / (1000 * 3600 * 24);

  for (let i = 0; i <= differenceInDays; i++) {
    addDay({ tripID: tripID }, data, () => {});
  }

  storeData(data, callback);
}

function removeEvent(trace, data, item, callback) {
  const tripID = parseInt(trace.tripID) - 1;
  const dayID = parseInt(trace.dayID) - 1;

  let eventArray = data[tripID].days[dayID].events;
  console.log(eventArray);
  console.log(
    eventArray.find((obj) => {
      return obj.id == trace.eventID;
    })[0]
  );
  eventArray.splice(
    eventArray.indexOf(
      eventArray.find((obj) => {
        return obj.id === trace.eventID;
      })
    ),
    1
  );

  storeData(data, callback);
}

function removeDay(trace, data, item, callback) {
  const tripID = parseInt(trace.tripID) - 1;

  let dayArray = data[tripID].days;

  dayArray.splice(trace.dayID - 1, 1);

  storeData(data, callback);
}

function removeTrip(trace, data, item, callback) {
  data.splice(trace.tripID - 1, 1);

  storeData(data, callback);
}

export async function storeData(value, callback, event) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('dataKey', jsonValue).then(() => {
      callback(value, event);
    });
  } catch (e) {
    // saving error
    console.log(e);
  }
}
//  editEvent(trace, response, item, callback);
async function editEvent(trace, response, newData, callback) {
  const tripID = parseInt(trace.tripID) - 1;
  const dayID = parseInt(trace.dayID) - 1;

  // console.log(response);
  console.log(newData);

  let eventArray = response[tripID].days[dayID].events;

  let item =
    eventArray[
      eventArray.indexOf(
        eventArray.find((obj) => {
          return obj.id == trace.eventID;
        })
      )
    ];

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

function editDay(trace, data, callback) {
  const tripID = parseInt(trace.tripID) - 1;
  const dayID = parseInt(data[tripID].days.length + 1);

  let dayArray = data[tripID].days;

  dayArray.push({
    id: dayID,
    events: [],
  });

  storeData(data, callback);
}

function editTrip(value, data, callback) {
  const tripID = parseInt(data.length + 1);

  data.push({
    id: tripID,
    name: value.name,
    leaveDate: value.startDate,
    returnDate: value.endDate,
    days: [],
  });

  const startDate = value.startDate.split('/');
  const endDate = value.endDate.split('/');

  const convertedStartDate = new Date(`${startDate[1]}/${startDate[2]}/${startDate[0]}`);
  const convertedEndDate = new Date(`${endDate[1]}/${endDate[2]}/${endDate[0]}`);

  const differenceInMins = convertedEndDate.getTime() - convertedStartDate.getTime();

  const differenceInDays = differenceInMins / (1000 * 3600 * 24);

  for (let i = 0; i <= differenceInDays; i++) {
    addDay({ tripID: tripID }, data, () => {});
  }

  storeData(data, callback);
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
