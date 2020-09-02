import React from 'react';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import useVisualMode from 'hooks/useVisualMode'
import './styles.scss'
import Confirm from './Confirm';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM_DELETE = 'CONFIRM_DELETE';
const EDIT = 'EDIT';

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY)

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(response => transition(SHOW, true));
  }

  const deleteInterview = () => {
    transition(DELETING, true)
    props.cancelInterview(props.id)
      .then(response => transition(EMPTY, true));
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show 
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM_DELETE)}
        />
      )}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers} 
          onSave={save} 
          onCancel={back} 
        />
      )}
      {mode === SAVING && <Status message="Saving..." />}
      {mode === DELETING && <Status message="Deleting..." />}
      {mode === CONFIRM_DELETE && (
        <Confirm 
          message="Are you sure you would like to delete this?"
          onCancel={back}
          onConfirm={deleteInterview}
        />
      )}
      {mode === EDIT && (
        <Form 
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers} 
          onSave={save} 
          onCancel={back} 
        />
      )}
    </article>
  );
};