import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
    line-height: 1;
    color: var(--ks-primary-color);
  }
  
  *:focus-visible {
    outline: var(--ks-outline);
    outline-offset: var(--ks-outline-offset);
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
    border-radius: var(--ks-border-radius);
    border: 0;
    background-color: transparent;
    color: rgb(var(--ks-primary-color));
  }

  button:focus-visible,
  input:focus-visible,
  select:focus-visible {
    outline: var(--ks-outline);
    outline-offset: var(--ks-outline-offset);
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
