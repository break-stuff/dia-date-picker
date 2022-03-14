import { css } from 'lit';

export const styles = css`
  :host {
    --primary-color: #293d4e;
    --outline: solid 2px #71a5d1;
    --outline-offset: 0.125rem;
    --border-color: #4f7494;
    --focus-color: #d7e6ff;

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
    border: solid 2px var(--border-color);
    border-radius: 0.25rem;
    padding: 0.5rem;
    display: inline-flex;
    align-items: center;
  }

  .main-input-controls:focus-within {
    outline: var(--outline);
    outline-offset: var(--outline-offset);
  }

  .main-input-controls input {
    text-align: center;
    border: 0;
    padding: 0.125rem 0;
    min-width: 2rem;
  }

  .main-input-controls input:focus {
    outline: 0;
  }

  .main-input-controls .month {
    min-width: 2rem;
  }

  .main-input-controls input::-webkit-inner-spin-button {
    display: none;
  }

  .calendar-toggle {
    padding: 0;
    background: transparent;
    border: 0;
    font-size: 1.5rem;
    color: var(--border-color);
    padding-top: 0.125rem;
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
    color: #9a0000;
    font-size: 0.9rem;
  }

  [aria-invalid='true'] ~ .error-message {
    visibility: visible;
  }

  [aria-invalid='true'] {
    border-color: #9a0000;
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
    border: solid 1px #e6e6e6;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
    transition: all 0.3s ease-in-out;
    z-index: 1;
    transform: translateY(-0.25rem);
  }
  .calendar-dropdown:before {
    border: 10px solid transparent;
    content: '';
    display: block;
    height: 0;
    position: absolute;
    width: 0;
    border-bottom-color: #e6e6e6;
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
`;
