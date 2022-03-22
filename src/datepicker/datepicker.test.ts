import { fixture, assert } from '@open-wc/testing';
import { KsDatepicker } from './index';

const tag = new KsDatepicker().tagName;

describe('datepicker accessibility', () => {
  it('test basic element accessibility', async () => {
    // Arrange
    const $el = await fixture<KsDatepicker>(
      `<${tag} label="Select Date"></${tag}>`
    );

    // Act

    // Assert
    await assert.isAccessible($el);
  });

  it('check accessibility when menu is open', async () => {
    // Arrange
    const $el = await fixture<KsDatepicker>(
      `<${tag} label="Select Date"></${tag}>`
    );
    const $calendarToggle = $el.shadowRoot?.querySelector(
      '.calendar-toggle'
    ) as HTMLButtonElement;

    // Act
    $calendarToggle.click();

    // Assert
    setTimeout(() => assert.isAccessible($el));
  });

  it('decreases the count on button click', async () => {
    // Arrange
    const $el = await fixture<KsDatepicker>(`<${tag}></${tag}>`);
    const $calendarToggle = $el.shadowRoot?.querySelector(
      '.calendar-toggle'
    ) as HTMLButtonElement;

    // Act
    $calendarToggle.click();

    // Assert
    setTimeout(() =>
      assert.equal($calendarToggle.getAttribute('aria-expanded'), 'true')
    );
  });
});

describe('datepicker format', () => {
  it('should have "mm/dd/yyyy" format when "lang" is "en-US"', async () => {
    // Arrange
    const $el = await fixture<KsDatepicker>(
      `<${tag} label="Select Date" lang="en-US"></${tag}>`
    );

    // Act
    const $inputs = [...$el.shadowRoot.querySelectorAll('input')];
    const $dividers = $el.shadowRoot.querySelectorAll('span');

    // Assert
    await assert.equal($inputs[0].placeholder, 'mm');
    await assert.equal($inputs[1].placeholder, 'dd');
    await assert.equal($inputs[2].placeholder, 'yyyy');
  });
});

