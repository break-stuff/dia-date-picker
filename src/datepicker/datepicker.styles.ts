import { css } from "lit";

export const styles = css`
  :host {
    --primary-color: #293d4e;
    --outline: solid 2px #71a5d1;
    --outline-offset: 0.125rem;
    --border-color: #4f7494;

    position: relative;
    display: inline-block;
    line-height: 1;
    font-family: sans-serif;
    color: var(--primary-color);
  }

  *:focus {
    outline: var(--outline);
    outline-offset: var(--outline-offset);
  }

  /* RESETS */
  button,
  input,
  select {
    font-size: 1rem;
    padding: 0.25rem;
    line-height: 1;
    margin: 0;
    -webkit-appearance: none;
    border-radius: 0.25rem;
    border: solid 1px var(--border-color);
    background-color: white;
    color: var(--primary-color);
  }

  label:hover,
  button:hover {
    cursor: pointer;
  }

  button {
    border: 0;
    padding: 0;
    color: var(--border-color);
  }

  button[disabled] {
    cursor: not-allowed;
    color: #ccc;
  }

  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

  /* MAIN INPUT */
  .main-input-label {
    display: block;
    margin-bottom: 0.25rem;
  }

  .controls {
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
  }

  .main-input {
    background-color: white;
    border: solid 2px var(--border-color);
    border-radius: 0.25rem;
    padding: 0.5rem;
  }

  .calendar-toggle {
    padding: 0;
    background: transparent;
    border: 0;
    font-size: 1.5rem;
    color: var(--border-color);
    position: absolute;
    right: 0.25rem;
    margin: 0.125rem;
    padding-top: 0.125rem;
    outline-offset: 0;
    display: inline-flex;
    align-items: center;
  }

  .calendar-toggle .icon {
    margin-top: -0.25rem;
  }

  .calendar-toggle:focus {
  }

  .icon {
    width: 1em;
    height: 1em;
  }

  /* CALENDAR DROPDOWN */

  .calendar-dropdown {
    background-color: white;
    border-radius: 5px;
    padding: 1rem;
    position: absolute;
    margin-top: 10px;
    visibility: hidden;
    opacity: 0;
    border: solid 1px #e6e6e6;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
    transition: all 0.3s ease-in-out;
    z-index: 1;
    transform: translateY(-0.25rem);
  }
  .calendar-dropdown:before {
    border: 10px solid transparent;
    content: "";
    display: block;
    height: 0;
    position: absolute;
    width: 0;
    border-bottom-color: #c5d1da;
    bottom: 100%;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  .calendar-dropdown:after {
    border: 9px solid transparent;
    content: "";
    display: block;
    height: 0;
    position: absolute;
    width: 0;
    border-bottom-color: #fff;
    bottom: 100%;
    left: 50%;
    margin-bottom: calc(var(--ks-spacing-size-xxxs) * -1);
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    transition: all 0.3s ease-in-out;
  }
  .calendar-dropdown.open {
    visibility: visible;
    opacity: 1;
    transform: translateY(0rem);
    transition: all 0.3s ease-in-out;
  }

  /* TOP CONTROLS */
  .top-controls {
    display: flex;
    justify-content: space-between;
    align-content: stretch;
  }

  .top-controls .left-controls {
    display: flex;
  }
  .month-label {
    display: inline-flex;
    align-items: stretch;
    margin-right: 0.25rem;
    position: relative;
  }
  .month-label select {
    min-width: 6.25rem;
  }
  .month-icon {
    pointer-events: none;
    right: 0.25rem;
    top: 0.5rem;
    position: absolute;
  }

  .top-controls .right-controls > button {
    margin-right: 0.125rem;
  }

  .top-controls .arrow {
    display: inline-flex;
    align-items: center;
    font-size: 1.75rem;
    color: var(--border-color);
  }
  .top-controls .arrow:hover {
    // color: steelblue;
    font-weight: 400;
  }

  .top-controls .year-selector {
    width: 3.5rem;
  }

  .top-controls .year-selector::-webkit-inner-spin-button {
    opacity: 1;
  }

  /* CALENDAR CONTROL */
  .calendar {
    clear: both;
    margin: 0.5rem 0;
  }
  .calendar .week-days td {
    color: #9a9a9a;
  }
  .calendar td {
    width: 2em;
    height: 2em;
    vertical-align: middle;
    text-align: center;
    font-size: 1rem;
  }
  .day {
    cursor: pointer;
    border-radius: 100%;
  }
  [aria-current="date"] {
    border: solid 2px #899ebb;
  }
  [aria-selected="true"] {
    background: #8db3d3;
  }
  [aria-selected="true"]:hover {
    background: #8db3d3;
  }
  .day button:hover,
  .day button:focus,
  .day button[tabindex="0"] {
    background-color: #d4deec;
    border-radius: 100%;
  }

  tbody td button {
    padding: 0;
    margin: 0;
    line-height: 1;
    border: none;
    background-color: transparent;
    width: 2em;
    height: 2em;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
    border-radius: 100%;
    font-size: 1rem;
  }

  tbody td button[disabled]:hover {
    background-color: transparent;
  }

  .other-month {
    color: gray;
  }

  /* BOTTOM CONTROLS */
  .bottom-controls {
    display: flex;
    justify-content: space-between;
  }
`;
