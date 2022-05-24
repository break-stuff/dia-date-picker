import { html, TemplateResult } from 'lit-html';

export default function icon(iconName: keyof typeof icons): TemplateResult {
  return icons[iconName];
}

const icons = {
  calendar: html` <svg
    class="icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="calendar"
  >
    <g stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
      <g fill="none" stroke-linejoin="round">
        <path d="M4 7h16v13H4z" stroke="none"></path>
        <path d="M4.75 7.75h14.5v11.5H4.75z"></path>
      </g>
      <g fill="currentColor" stroke-linejoin="round">
        <path d="M4 8h16v2H4z" stroke="none"></path>
        <path fill="none" d="M4.75 8.75h14.5v.5H4.75z"></path>
      </g>
      <path fill="none" d="M8 13h8m-8 3h6M8 8V5m8 3V5"></path>
    </g>
  </svg>`,
  chevron_down: html` <svg
    class="icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g>
      <path
        d="m6 9 6 6 6-6"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      ></path>
    </g>
  </svg>`,
  arrow_up: html` <svg
    class="icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="1.5"
    >
      <path d="m16 9-4-4-4 4" stroke-linejoin="round"></path>
      <path d="M12 5.277V20"></path>
    </g>
  </svg>`,
  arrow_down: html`
    <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="1.5"
      >
        <path d="m8 15 4 4 4-4" stroke-linejoin="round"></path>
        <path d="M12 18.723V4"></path>
      </g>
    </svg>
  `,
  warning: html`
    <svg
      class="icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g>
        <path
          d="M20 19.232H4l8-14.485 8 14.484zM12 8.5a1.406 1.406 0 0 0-1.457 1.312v4.183a1.431 1.431 0 0 0 .384 1.07 1.558 1.558 0 0 0 1.07.433h0a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5 1.5 1.5 1.5 0 0 0 1.5-1.5 1.5 1.5 0 0 0-1.491-1.5 1.691 1.691 0 0 0 .857-.234 1.394 1.394 0 0 0 .592-1.27V9.811A1.377 1.377 0 0 0 12 8.501z"
          fill="currentColor"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
        ></path>
      </g>
    </svg>
  `,
};
