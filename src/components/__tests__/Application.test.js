import React from 'react';

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByTestId, queryByText } from '@testing-library/react';

import Application from 'components/Application';

import axios from 'axios';

afterEach(cleanup);

describe('Application', () => {
  it('defaults to Monday and changes the schedule when a new day is selected', async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText('Monday'));
  
    fireEvent.click(getByText('Tuesday'));
  
    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });
  
  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByTestId(appointment, 'student-name-input'), {
      target: {value: 'Saitama'}
    });

    fireEvent.click(getByAltText(appointment, 'Tori Malcolm'));

    fireEvent.click(getByText(appointment, 'Save'));

    await waitForElement(() => getByText(appointment, 'Saitama'));

    const day = getAllByTestId(container, 'day')
      .find(day => queryByText(day, 'Monday'));
    
    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
  })

  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text 'Archie Cohen' is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));
  
    // 3. Click the 'delete' button on the appointment with the name 'Archie Cohen'
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments
      .find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation dialogue is shown
    const confirmButton = getByText(appointment, 'Confirm');

    // 5. Click the 'confirm' button on the confirmation dialogue
    fireEvent.click(confirmButton);

    // 6. Check that the element with the text 'Deleting...' is displayed
    expect(getByText(appointment, 'Deleting...')).toBeInTheDocument();

    // 7. Wait until the empty appointment is displayed
    await waitForElement(() => getByAltText(appointment, 'Add'));

    // 8. Check that the DayListItem with the text 'Monday' also has the text '2 slots remaining'
    const day = getAllByTestId(container, 'day')
      .find(day => queryByText(day, 'Monday'));
    
    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
  });
  
  it('loads data, edits an interview and keeps the spots remaining for Monday the same', async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text 'Archie Cohen' is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));
  
    // 3. Click the 'edit' button on the appointment with the name 'Archie Cohen'
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments
      .find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(getByAltText(appointment, 'Edit'));

    // 4. Change the student name and interviewer of the appointment
    fireEvent.change(getByTestId(appointment, 'student-name-input'), {
      target: {value: 'Saitama'}
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // 5. Click the save button
    fireEvent.click(getByText(appointment, 'Save'));

    // 6. Check that the 'Saving...' element is displayed
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();

    // 7. Wait until the edited appointment is displayed
    await waitForElement(() => getByText(appointment, 'Saitama'));

    // 8. Check that the daylistitem for Monday contains '1 spot remaining'
    const day = getAllByTestId(container, 'day')
      .find(day => queryByText(day, 'Monday'));
    
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  })

  it('shows the save error when failing to save an appointment', async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByTestId(appointment, 'student-name-input'), {
      target: {value: 'Saitama'}
    });

    fireEvent.click(getByAltText(appointment, 'Tori Malcolm'));

    fireEvent.click(getByText(appointment, 'Save'));

    await waitForElement(() => getByText(appointment, 'Error'));
    expect(getByText(appointment, 'Could not save appointment.')).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, 'Close'));

    expect(getByText(appointment, 'Interviewer')).toBeInTheDocument();
  });

  it('shows the delete error when failing to save an appointment', async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);
  
    await waitForElement(() => getByText(container, 'Archie Cohen'));
  
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments
      .find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(getByAltText(appointment, 'Delete'));

    const confirmButton = getByText(appointment, 'Confirm');

    fireEvent.click(confirmButton);

    expect(getByText(appointment, 'Deleting...')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Error'));
    expect(getByText(appointment, 'Could not delete appointment.')).toBeInTheDocument();
    
    fireEvent.click(getByAltText(appointment, 'Close'));

    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();
  })
})

