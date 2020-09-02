export function getAppointmentsForDay(state, day) {
  const {days, appointments} = state;

  const checkedDay = days.find(currentDay => currentDay.name === day);

  if (!checkedDay || checkedDay.appointments.length < 1) {
    return [];
  }

  return checkedDay.appointments
    .map(appointment => appointments[appointment]);
};