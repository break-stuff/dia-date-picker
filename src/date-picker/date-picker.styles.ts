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

  .required-indicator {
    color: var(--error-color);
  }

  .help-text {
    color: var(--alt-day-color);
    font-size: 0.875rem;
    font-style: italic;
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
    border: solid 0.125rem var(--border-color);
    border-radius: var(--border-radius);
    padding-left: 0.5rem;
    display: inline-flex;
    align-items: center;
  }

  .main-input-controls[aria-disabled='true'],
  .main-input-controls[aria-disabled='true'] input,
  .main-input-controls[aria-disabled='true'] button {
    background-color: var(--border-color);
    cursor: not-allowed;
    opacity: 0.75;
  }

  .main-input-controls:focus-within {
    outline: var(--outline);
    outline-offset: var(--outline-offset);
  }

  .main-input-controls input {
    text-align: center;
    border: 0;
    padding: 0.125rem;
    margin-top: 0.25rem;
    min-width: 2rem;
    -moz-appearance: textfield;
  }

  .main-input-controls input::placeholder {
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
    color: var(--primary-color);
    padding-top: 0.25rem;
    padding: 0.5rem;
    display: inline-flex;
    align-items: center;
    margin-left: 0.125rem;
    background-color: var(--alt-background-color);
    border-radius: 0;
    border-left: 0.0625rem solid var(--border-color);
  }

  .calendar-toggle:focus-visible {
    outline-offset: 0;
  }

  .icon {
    width: 1em;
    height: 1em;
  }

  .error-message {
    margin-top: 0.25rem;
    color: var(--error-color);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
  }

  .error-message .icon {
    font-size: 1.25rem;
  }

  [aria-invalid='true'] {
    border-color: var(--error-color);
  }

  /* CALENDAR DROPDOWN */

  .calendar-dropdown {
    background-color: white;
    border-radius: 0.25rem;
    padding: 1rem;
    position: absolute;
    margin-top: 0.5rem;
    visibility: hidden;
    opacity: 0;
    border: solid 1px var(--border-color);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
    transition: all 0.3s ease-in-out;
    z-index: 10;
    transform: translateY(-0.25rem);
  }

  .calendar-dropdown.open {
    visibility: visible;
    opacity: 1;
    transform: translateY(0rem);
    transition: all 0.3s ease-in-out;
  }

  .calendar-control {
    --border-color: inherit;
    --border-radius: inherit;
    --disabled-color: inherit;
    --error-color: inherit;
    --outline: inherit;
    --outline-offset: inherit;
    --primary-color: inherit;
  }

  .calendar-control:focus {
    outline: none;
  }

  /* BOTTOM CONTROLS */
  .bottom-controls {
    display: flex;
    justify-content: space-between;
  }
`;
