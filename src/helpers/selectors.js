export function getAppointmentsForDay(state, day) {
  const {days, appointments} = state;

  const checkedDay = days.find(currentDay => currentDay.name === day);

  if (!checkedDay || checkedDay.appointments.length < 1) {
    return [];
  }

  return checkedDay.appointments
    .map(appointment => appointments[appointment]);
};

export function getInterviewersForDay(state, day) {
  const {days, interviewers} = state;

  const checkedDay = days.find(currentDay => currentDay.name === day);

  if (!checkedDay || checkedDay.interviewers.length < 1) {
    return [];
  }

  return checkedDay.interviewers
    .map(interviewer => interviewers[interviewer]);
};

export function getInterview(state, interview) {
  const {interviewers} = state;
  
  return interview ? {...interview, interviewer:interviewers[interview.interviewer] } : null;
};