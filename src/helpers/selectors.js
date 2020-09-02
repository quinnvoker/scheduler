export function getAppointmentsForDay(state, day) {
  const {days, appointments} = state;

  const checkedDay = days.find(currentDay => currentDay.name === day);

  if (!checkedDay || checkedDay.appointments.length < 1) {
    return [];
  }

  return checkedDay.appointments
    .map(appointment => appointments[appointment]);
};

export function getInterview(state, interview) {
  const {interviewers} = state;
  
  return interview ? {...interview, interviewer:interviewers[interview.interviewer] } : null;
};