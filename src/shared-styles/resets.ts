import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
    line-height: 1;
    color: var(--primary-color);
  }
  
  *:focus-visible {
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
    border-radius: calc(var(--border-radius) - 2px);
    border: 0;
    background-color: transparent;
    color: var(--primary-color);
  }

  button:focus-visible,
  input:focus-visible,
  select:focus-visible {
    outline: var(--outline);
    outline-offset: var(--outline-offset);
  }
  
  label:hover,
  button:hover {
    cursor: pointer;
  }

  button {
    border: 0;
    padding: 0;
    background-color: var(--button-background-color);
    color: var(--button-color);
  }

  .icon {
    width: 1em;
    height: 1em;
  }
`;
