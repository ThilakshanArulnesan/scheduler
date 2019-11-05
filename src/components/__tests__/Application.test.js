import React from "react";
import axios from "axios";

import {
  render, cleanup, waitForElement,
  fireEvent, getByText,
  getAllByTestId, getByAltText, getByPlaceholderText,
  queryByText, queryByAltText
} from "@testing-library/react";
// import { fireEvent, getByText } from "@testing-library/react";

import Application from "components/Application";



afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));//Waits for element to load before getting/ returns a promise, Jest waits until test completes

    fireEvent.click(getByText("Tuesday"));

    expect(getByText(/Leopold Silvers/i)).toBeInTheDocument();

  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });


  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    // debug();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1.  Render application
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "arche cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //Get the appointment to modify
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    // 3. Click the edit button
    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4. Check if save button is shown
    expect(getByText(appointment, "Save")).toBeInTheDocument();

    // 5.1 Change the text for the name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Thilakshan" }
    });
    // 5.2 Change the interviewer name
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    //5.3 Press save
    fireEvent.click(getByText(appointment, "Save"));

    //6. Check if saving screen is showing
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //7. Wait until new name appears
    await waitForElement(() => getByText(appointment, 'Thilakshan'));

    //8. Get Monday spots
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );


    // 9. Check if spots remaining stays the same
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
})
