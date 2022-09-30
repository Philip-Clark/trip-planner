import Papa from 'react-papaparse';

export function importCSV(fileInput) {
  Papa.parse(fileInput, {
    complete: function (results) {
      console.log(results);
    },
  });
}
