/**
 * If the hour is less than 12 and greater than 0, it's AM. If the hour is 0, it's 12 AM. If the hour
 * is greater than 12, it's PM. If the hour is 12, it's 12 PM.
 * @param time - The time in 24 hour format.
 * @returns A string with the hour, minutes, and AM/PM.
 */
export const get12HourTime = (time) => {
  let hour = time.split(':')[0];
  let am = 'AM';
  if (hour < 12 && hour > 0) {
    am = 'AM';
  } else {
    if (hour == 0) {
      hour = 12;
    } else {
      hour = hour - 12;
      if (hour == 0) {
        hour = 12;
      }
      am = 'PM';
    }
  }
  /* Returning a string with the hour, minutes, and AM/PM. */
  return `${hour}:${time.split(':')[1]} ${am}`;
};
