import * as FileSystem from 'expo-file-system';
import { usePapaParse } from 'react-papaparse';
import addItem from './dataHandler';

export const parsInputFile = async (importFile, callback) => {
  const { readString } = usePapaParse();
  let dayId = 0;
  await FileSystem.readAsStringAsync(importFile.uri).then((response) => {
    readString(response, {
      header: ['Type', 'Date', 'Arrival', 'Departure', 'Title', 'Info', 'Duration'],
      complete: function (results) {
        addItem(
          'trip',
          {
            name: importFile.name,
            startDate: results.data[0].Date,
            endDate: results.data[results.data.length - 2].Date,
            imported: true,
          },
          undefined,
          async (data) => {
            await iterativelyAddEvent(data, results, dayId).then(() => {
              callback();
            });
          }
        );
      },
    });
  });
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const iterativelyAddEvent = async (data, results, dayId) => {
  const tripId = parseInt(data.length);
  await asyncForEach(results.data, async (element, i) => {
    if (i > 0 && i < results.data.length - 1) {
      if (element.Date != results.data[i - 1].Date) {
        dayId += 1;
      }
    }
    try {
      let event = {
        title: element.Title,
        description: element.Info,
        time: element.Departure,
        startTime: element.Arrival,
        type: element.Type.toLowerCase(),
        duration: element.Duration,
      };

      if (element.Arrival == '') {
        if (element.Title == '') {
          event.startTime = results.data[i - 1].Arrival.split(' ')[0] + '.1';
        } else {
          event.startTime = results.data[i - 1].Arrival.split(' ')[0];
        }
      }
      await addItem('event', event, { tripID: tripId, dayID: dayId + 1 }, () => {});
    } catch (e) {}
  });
};
