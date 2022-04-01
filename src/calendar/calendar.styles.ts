import { css } from 'lit';

export const styles = css`
  :host {
    --primary-color: #293d4e;
    --outline: solid 2px var(--outline-color);
    --outline-color: #71a5d1;
    --outline-offset: 0.125rem;
    --border-color: #596d7f;
    --day-hover-background-color: #e0e7f3;
    --day-disabled-color: #ccc;
    --week-background-color: #f7f7f7;

    position: relative;
    display: inline-block;
    line-height: 1;
    font-family: sans-serif;
    color: var(--primary-color);
    min-width: 16rem;
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
    line-height: 1.2;
    margin: 0;
    -webkit-appearance: none;
    border-radius: 0.25rem;
    border: 0;
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

  .icon {
    width: 1em;
    height: 1em;
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

  .top-controls .year-selector {
    width: 4rem;
  }

  .top-controls .year-selector::-webkit-inner-spin-button {
    opacity: 1;
  }

  /* CALENDAR CONTROL */
  .calendar {
    clear: both;
    margin: 1rem 0;
    width: 100%;
  }

  .calendar th,
  .calendar td {
    text-align: center;
  }

  .calendar .prev {
    transform: translateY(-0.75rem);
  }
  .calendar .next {
    transform: translateY(0.75rem);
  }

  .calendar .show {
    opacity: 1;
    transform: translateY(0rem);
    transition: all 0.2s ease-in-out;
  }

  .week-number {
    background-color: var(--week-background-color);
    font-weight: 600;
    width: 2rem;
  }

  .day {
    background-color: transparent;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 1rem;
    height: 2em;
    line-height: 1;
    margin: 0;
    padding: 0;
    vertical-align: middle;
    width: 2em;
    color: var(--primary-color);
  }

  .day.other-month {
    color: var(--border-color);
    font-style: italic;
  }

  .day:hover,
  .day:focus,
  .day[tabindex='0'] {
    background-color: var(--day-hover-background-color);
    color: black;
    border-radius: 0.25rem;
  }

  .day[aria-current='date'] {
    border: solid 2px var(--border-color);
  }
  .day[aria-selected='true'] {
    background: var(--primary-color);
    color: white;
  }
  .day[aria-selected='true']:hover {
    background: var(--primary-color);
    color: white;
  }

  .day[aria-disabled='true'] {
    cursor: not-allowed;
    color: var(--day-disabled-color);
    background-color: transparent;
  }

  .day[aria-disabled='true']:hover {
    color: var(--day-disabled-color);
    background-color: transparent;
  }

  /* BOTTOM CONTROLS */
  .bottom-controls {
    display: flex;
    justify-content: space-between;
  }
`;
