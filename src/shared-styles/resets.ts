import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
    line-height: 1;
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

  .icon {
    width: 1em;
    height: 1em;
  }
`;
