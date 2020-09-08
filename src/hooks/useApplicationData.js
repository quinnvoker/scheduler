import { useReducer, useEffect } from 'react';
import axios from 'axios';
import reducer, { SET_APPLICATION_DATA, SET_DAY, SET_INTERVIEW } from '../reducers/application';

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
      .then(() => dispatch({id, interview, type: SET_INTERVIEW}))
  }

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => dispatch({id, interview: null, type: SET_INTERVIEW}))
  }

  useEffect(() => {
    let ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === SET_INTERVIEW) {
        dispatch(data);
      }
    }

    return () => ws.close();
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