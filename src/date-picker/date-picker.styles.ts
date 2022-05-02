import { css } from 'lit';
import sharedStyles from '../shared-styles';

export const styles = css`
  ${sharedStyles}

  :host {
    position: relative;
  }

  /* MAIN INPUT */
  .main-input-label {
    display: block;
    margin-bottom: 0.25rem;
    cursor: pointer;
  }

  .controls {
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
  }

  .main-input {
    border: 0;
    padding: 0;
    margin: 0;
  }

  .main-input-controls {
    background-color: white;
    border: solid 1px var(--ks-border-color);
    border-radius: var(--ks-border-radius);
    padding: 0 0.5rem;
    display: inline-flex;
    align-items: center;
    height: 3rem;
    box-shadow: inset 1px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .main-input-controls[aria-disabled='true'],
  .main-input-controls[aria-disabled='true'] input,
  .main-input-controls[aria-disabled='true'] button {
    background-color: var(--ks-disabled-color);
    cursor: not-allowed;
  }

  .main-input-controls:focus-within {
    outline: var(--ks-outline);
    outline-offset: var(--ks-outline-offset);
  }

  .main-input-controls input {
    text-align: center;
    border: 0;
    padding: 0.125rem 0;
    margin-top: 0.125rem;
    min-width: 2rem;
    max-width: 3rem;
    -moz-appearance: textfield;
  }

  .main-input-controls input::placeholder {
    color: rgb(89, 109, 127);
    font-style: italic;
    opacity: 0.7;
    letter-spacing: 0.125rem;
  }

  .main-input-controls span {
    font-size: 1.25rem;
    padding: 0.125rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .main-input-controls input:focus-visible {
    outline: 0;
  }

  .main-input-controls .month,
  .main-input-controls .day {
    min-width: 1.75rem;
  }

  .main-input-controls .year {
    width: 3rem;
  }

  .main-input-controls input::-webkit-inner-spin-button {
    display: none;
  }

  .calendar-toggle {
    padding: 0;
    background: transparent;
    border: 0;
    font-size: 1.5rem;
    color: var(--ks-primary-color);
    padding-top: 0.125rem;
    padding-left: 0.125rem;
    outline-offset: 0;
    display: inline-flex;
    align-items: center;
    margin-left: 0.125rem;
  }

  .calendar-toggle .icon {
    margin-top: -0.25rem;
  }

  .icon {
    width: 1em;
    height: 1em;
  }

  .error-message {
    visibility: hidden;
    margin-top: 0.25rem;
    color: var(--ks-error-color);
    font-size: 0.9rem;
  }

  [aria-invalid='true'] ~ .error-message {
    visibility: visible;
  }

  [aria-invalid='true'] {
    border-color: var(--ks-error-color);
  }

  /* CALENDAR DROPDOWN */

  .calendar-dropdown {
    background-color: white;
    border-radius: 0.25rem;
    padding: 1rem;
    position: absolute;
    margin-top: -0.75rem;
    visibility: hidden;
    opacity: 0;
    border: solid 1px var(--ks-border-color);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
    transition: all 0.3s ease-in-out;
    z-index: 10;
    transform: translateY(-0.25rem);
  }
  /* .calendar-dropdown:before {
    border: 10px solid transparent;
    content: '';
    display: block;
    height: 0;
    position: absolute;
    width: 0;
    border-bottom-color: var(--ks-border-color);
    bottom: 100%;
    left: 25%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  .calendar-dropdown:after {
    border: 9px solid transparent;
    content: '';
    display: block;
    height: 0;
    position: absolute;
    width: 0;
    border-bottom-color: #fff;
    bottom: 100%;
    left: 25%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    transition: all 0.3s ease-in-out;
  } */
  .calendar-dropdown.open {
    visibility: visible;
    opacity: 1;
    transform: translateY(0rem);
    transition: all 0.3s ease-in-out;
  }

  .calendar-control {
    --ks-border-color: inherit;
    --ks-border-radius: inherit;
    --ks-disabled-color: inherit;
    --ks-error-color: inherit;
    --ks-outline: inherit;
    --ks-outline-offset: inherit;
    --ks-primary-color: inherit;
  }

  .calendar-control:focus {
    outline: none;
  }
`;
