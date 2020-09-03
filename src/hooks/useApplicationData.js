import { useReducer, useEffect } from 'react';
import axios from 'axios';
import Error from 'components/Appointment/Error';

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW"

// get days with updated spots remaining counts from given (new) appointments
const getUpdatedDays = (state, newAppointments) => {
  return state.days
    .map((day) => {
      if (day.name === state.day) {
        const openSpots = day.appointments
          .filter(appointmentId => !newAppointments[appointmentId].interview);

        return {
          ...day,
          spots: openSpots.length
        };
      } else {
        return day;
      }
    });
}

function reducer(state, action) {
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

      const days = getUpdatedDays(state, appointments);

      return { ...state, appointments, days }
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: []
  });

  const setDay = day => dispatch({ type: SET_DAY, day }) // setState({...state, day});

  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(response => dispatch({ type: SET_INTERVIEW, id, interview }));
  }

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
      .then(response => dispatch({ type: SET_INTERVIEW, id, interview: null }))
  }

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)
    ws.onopen = (event) => {
      console.log("connected to server websocket!")
    }
  }, [])

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      // setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
      dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
    });
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}