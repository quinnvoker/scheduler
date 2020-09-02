import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: []
  });

  const setDay = day => setState({...state, day});

  const bookInterview = (id, interview) => {
    // set up appointment with interview data
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    }
    // set up appointments object, updating the one at given id with newly created appointment
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(response => setState({ ...state, appointments }));
  }

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.delete(`/api/appointments/${id}`)
      .then(response => setState({ ...state, appointments }))
  }

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}