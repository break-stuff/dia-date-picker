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
    border: solid 0.125rem var(--dia-border-color);
    border-radius: var(--dia-border-radius);
    padding-left: 0.5rem;
    display: inline-flex;
    align-items: center;
  }

  .main-input-controls[aria-disabled='true'],
  .main-input-controls[aria-disabled='true'] input,
  .main-input-controls[aria-disabled='true'] button {
    background-color: var(--dia-border-color);
    cursor: not-allowed;
    opacity: 0.75;
  }

  .main-input-controls:focus-within {
    outline: var(--dia-outline);
    outline-offset: var(--dia-outline-offset);
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
    color: var(--dia-primary-color);
    padding-top: 0.25rem;
    padding: 0.5rem;
    display: inline-flex;
    align-items: center;
    margin-left: 0.125rem;
    background-color: #f4f4f4;
    border-radius: 0;
    border-left: 0.0625rem solid var(--dia-border-color);
  }

  .calendar-toggle:focus-visible {
    outline-offset: 0;
  }

  .icon {
    width: 1em;
    height: 1em;
  }

  .error-message {
    visibility: hidden;
    margin-top: 0.25rem;
    color: var(--dia-error-color);
    font-size: 0.9rem;
  }

  [aria-invalid='true'] ~ .error-message {
    visibility: visible;
  }

  [aria-invalid='true'] {
    border-color: var(--dia-error-color);
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
    border: solid 1px var(--dia-border-color);
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
    --dia-border-color: inherit;
    --dia-border-radius: inherit;
    --dia-disabled-color: inherit;
    --dia-error-color: inherit;
    --dia-outline: inherit;
    --dia-outline-offset: inherit;
    --dia-primary-color: inherit;
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
