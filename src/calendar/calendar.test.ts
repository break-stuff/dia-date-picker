import {
  fixture,
  assert,
  expect,
} from '@open-wc/testing';
import { getShortIsoDate } from '../utils/dateUtils';
import { DiaCalendar } from './index';

const tag = new DiaCalendar().tagName;

async function element(selectedDay?: string) {
  const value = getShortIsoDate(
    selectedDay ? new Date(selectedDay) : new Date()
  );

  const $el = await fixture<DiaCalendar>(
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
    const $el = await fixture<DiaCalendar>(`<${tag}></${tag}>`);
    const today = getShortIsoDate(new Date());
    console.log('TODAY', today);
    
    const $selectedDate = $el.shadowRoot?.querySelector(
      `[id="${today}"]`
    ) as HTMLElement;

    // Act
    console.log($selectedDate);
    

    // Assert
    await assert.equal($selectedDate?.getAttribute('tabindex'), '0');
    await assert.equal($selectedDate?.getAttribute('aria-current'), 'date');
    await assert.equal($selectedDate?.getAttribute('aria-selected'), 'true');
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

describe('calendar disabled dates', () => {
  it('should have 8 inactive days when the focus date is set to "2/1/2026" and the 2nd and 5th days of the week are disabled', async () => {
    // Arrange
    const $el = await fixture<DiaCalendar>(
      `<${tag} focus-date="2/1/2026" disabled-week-days="2, 5"></${tag}>`
    );

    // Act
    const disabledDays = [
      ...$el.shadowRoot.querySelectorAll('[aria-disabled="true"]'),
    ];

    // Assert
    await expect(disabledDays.length).to.equal(8);
  });
});

describe('calendar disabled dates', () => {
  it('should have 8 inactive days when the focus date is set to "2/1/2026" and the 2nd and 5th days of the week are disabled', async () => {
    // Arrange
    const $el = await fixture<DiaCalendar>(
      `<${tag} focus-date="2/1/2026" disabled-week-days="2, 5"></${tag}>`
    );

    // Act
    const disabledDays = [
      ...$el.shadowRoot.querySelectorAll('[aria-disabled="true"]'),
    ];

    // Assert
    await expect(disabledDays.length).to.equal(8);
  });
});
