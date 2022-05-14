import { css } from 'lit';
import sharedStyles from '../shared-styles';

export const styles = css`
  ${sharedStyles}

  :host {
    min-width: 16rem;
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
    align-items: center;
    margin-right: 0.25rem;
  }
  .month-label select {
    min-width: 6.25rem;
  }
  .month-icon {
    pointer-events: none;
    margin-left: -1rem;
  }

  .top-controls .right-controls > button {
    margin-right: 0.125rem;
  }

  .top-controls .arrow {
    display: inline-flex;
    align-items: center;
    font-size: 1.75rem;
    color: var(--ks-primary-color);
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

  .week-number {
    background-color: rgb(var(--ks-color-light-lighter));
    color: rgb(var(--ks-color-light-lighter-text));
    font-weight: 600;
    width: 2rem;
  }

  .day {
    background-color: transparent;
    border: none;
    border-radius: var(--ks-border-radius);
    cursor: pointer;
    font-size: 1rem;
    height: 2em;
    line-height: 1;
    margin: 0;
    padding: 0;
    vertical-align: middle;
    width: 2em;
    color: var(--ks-primary-color);
  }

  .day.alt-month {
    color: rgb(var(--ks-color-dark-lighter));
    font-style: italic;
  }

  .day:hover,
  .day:focus,
  .day[tabindex='0'] {
    background-color: rgb(var(--ks-color-light-light));
    color: rgb(var(--ks-color-light-light-text));
    border-radius: var(--ks-border-radius);
  }

  .day[aria-current='date'] {
    border: solid 2px var(--ks-border-color);
  }
  .day[aria-selected='true'] {
    background-color: var(--ks-primary-color);
    color: white;
  }
  .day[aria-selected='true']:hover {
    background-color: var(--ks-primary-color);
    color: white;
  }

  .day[aria-disabled='true'] {
    cursor: not-allowed;
    color: var(--ks-disabled-color);
    background-color: transparent;
  }

  .day[aria-disabled='true']:hover {
    color: var(--ks-disabled-color);
    background-color: transparent;
  }

  .day-label {
    width: 1.25rem;
    height: 1.25rem;
  }
`;
