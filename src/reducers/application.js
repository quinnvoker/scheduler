export const SET_DAY = 'SET_DAY';
export const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
export const SET_INTERVIEW = 'SET_INTERVIEW'

export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, 
        day: action.day 
      }
    case SET_APPLICATION_DATA:
      return { ...state, 
        days: action.days, 
        appointments: action.appointments, 
        interviewers: action.interviewers 
      }
    case SET_INTERVIEW: {
      // set up appointments object, updating the appointment at given id with given interview
      const appointments = {
        ...state.appointments,
        [action.id]: {
          ...state.appointments[action.id], 
          interview: action.interview
        }
      }

      const targetDay = state.days
        .find(day => day.appointments.includes(action.id));

      const days = state.days
        .map((day) => {
          if (day === targetDay) {
            const openSpots = day.appointments
              .filter(appointmentId => !appointments[appointmentId].interview);
    
            return {...day, spots: openSpots.length };
          } else {
            return day;
          }
        });

      return { ...state, appointments, days }
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}