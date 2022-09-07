import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export default function addItem(itemType, value, trace, callback) {
  getData().then((response) => {
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
        addEvent(value, trace, response, callback);
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
/**
 *
 * @param {{title: string, description: string, time: string,}} value
 * @param {String} trace
 */
function addEvent(value, trace, data, callback) {
  const tripID = parseInt(trace.tripID) - 1;
  const dayID = parseInt(trace.dayID) - 1;
  let eventId = parseInt(value.startTime.replace(':', ''));

  let eventArray = data[tripID].days[dayID].events;

  eventArray.push({
    id: eventId,
    name: value.title,
    data: value.description,
    duration: value.time,
    startTime: value.startTime,
  });
  storeData(data, callback);
  console.log('================= STORING DATA ======================');
  console.log(data);
  console.log('=====================================================');
}

function addDay(trace, data, callback) {
  const tripID = parseInt(trace.tripID) - 1;
  const dayID = parseInt(data[tripID].days.length + 1);

  let dayArray = data[tripID].days;

  dayArray.push({
    id: dayID,
    events: [],
  });

  console.log('================= STORING DATA ======================');
  console.log(data);
  console.log('=====================================================');
  storeData(data, callback);
}

function addTrip(value, data, callback) {
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

  console.log('================= STORING DATA ======================');
  console.log(data);
  console.log('=====================================================');
  storeData(data, callback);
}

function removeEvent(trace, data, item, callback) {
  const tripID = parseInt(trace.tripID) - 1;
  const dayID = parseInt(trace.dayID) - 1;

  let eventArray = data[tripID].days[dayID].events;
  console.log(item);
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

  console.log('================= STORING DATA ======================');
  console.log(data);
  console.log('=====================================================');
  storeData(data, callback);
}

function removeDay(trace, data, item, callback) {
  const tripID = parseInt(trace.tripID) - 1;

  let dayArray = data[tripID].days;

  dayArray.splice(trace.dayID - 1, 1);

  console.log('================= STORING DATA ======================');
  console.log(data);
  console.log('=====================================================');
  storeData(data, callback);
}

function removeTrip(trace, data, item, callback) {
  data.splice(trace.tripID - 1, 1);

  console.log('================= STORING DATA ======================');
  console.log(data);
  console.log('=====================================================');
  storeData(data, callback);
}

export async function storeData(value, callback) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('dataKey', jsonValue).then(() => {
      callback();
    });
  } catch (e) {
    // saving error
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
