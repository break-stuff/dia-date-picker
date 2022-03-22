import { fixture, assert } from '@open-wc/testing';
import { getShortIsoDate } from '../utils/dateUtils';
import { KsCalendar } from './index';

const tag = new KsCalendar().tagName;

async function element(selectedDay?: string) {
  const value = getShortIsoDate(
    selectedDay ? new Date(selectedDay) : new Date()
  );

  const $el = await fixture<KsCalendar>(
    `<${tag} value="${selectedDay}"></${tag}>`
  );

  return {
    $el,
    $selectedElement: $el.shadowRoot?.querySelector(
      `[id="${value}"]`
    ) as HTMLElement,
    $monthSelect: $el.shadowRoot?.querySelector(
      '.month-selector'
    ) as HTMLSelectElement,
    $yearInput: $el.shadowRoot?.querySelector(
      '.year-selector'
    ) as HTMLInputElement,
    $nextMonth: $el.shadowRoot?.querySelector('.next') as HTMLButtonElement,
    $prevMonth: $el.shadowRoot?.querySelector('.prev') as HTMLButtonElement,
    $clear: $el.shadowRoot?.querySelector('.clear') as HTMLButtonElement,
    $today: $el.shadowRoot?.querySelector('.today') as HTMLButtonElement,
  };
}

describe('calendar default date', () => {
  it('test default element accessibility', async () => {
    // Arrange
    const today = new Date().toLocaleDateString('en-US');
    const { $el } = await element(today);

    // Act

    // Assert
    await assert.isAccessible($el);
  });

  it('check that current date is selected in calendar', async () => {
    // Arrange
    const { $selectedElement } = await element('');
    const currentDate = new Date();
    const isoDate = getShortIsoDate(currentDate);
    // Act

    // Assert
    await assert.equal($selectedElement?.getAttribute('id'), isoDate);
    await assert.equal($selectedElement?.getAttribute('tabindex'), '0');
    await assert.equal($selectedElement?.getAttribute('aria-current'), 'date');
    await assert.equal($selectedElement?.getAttribute('aria-selected'), 'true');
  });

  it('check that current day and year have correct values', async () => {
    // Arrange
    const { $monthSelect, $yearInput } = await element('');
    const currentDate = new Date();
    // Act

    // Assert
    await assert.equal($monthSelect.value, currentDate.getMonth().toString());
    await assert.equal($yearInput.value, currentDate.getFullYear().toString());
  });

  it('check that prev and next controls have correct labels', async () => {
    // Arrange
    const { $nextMonth, $prevMonth } = await element('9/11/2025');
    // Act

    // Assert
    await assert.equal($prevMonth?.getAttribute('aria-label'), 'August 2025');
    await assert.equal($nextMonth?.getAttribute('aria-label'), 'October 2025');
  });
});

// describe('calendar keyboard funtionality tests', () => {
//   it('test up arrow', async () => {
//     // Arrange
//     const { $el } = await element();

//     // Act

//     // Assert
//     await assert.isAccessible($el);
//   });

//   it('check that current date is selected', async () => {
//     // Arrange
//     const { $selectedElement } = await element();

//     // Act

//     // Assert
//     await assert.equal($selectedElement?.getAttribute('tabindex'), '0');
//     await assert.equal($selectedElement?.getAttribute('aria-current'), 'date');
//     await assert.equal($selectedElement?.parentElement?.getAttribute('aria-selected'), 'true');
//   });
// });
