# Date Picker

The Dia date picker component is an open source input element that allows users to enter a date into input fields or by selecting a date using a calendar interface.

## Usage

<dia-date-picker class="demo" label="Default"></dia-date-picker>

```html
<dia-date-picker label="Default"></dia-date-picker>
```

The default date picker component will provide you with an input field and the calendar dialog. The dialog can be activated by clicking calendar icon on the right side of the input.

## Required

Beside setting the date range on the component, you can also indicate if it is required using the <code>required</code> attribute.

<dia-date-picker label="Required Date" required></dia-date-picker>

```html
<dia-date-picker label="Required Date" required></dia-date-picker>
```

## Disabled

Adding the `disabled` attribute will prevent to control from being updated or focused on.

<dia-date-picker label="Disabled Date" value="2/22/2022" disabled></dia-date-picker>

```html
<dia-date-picker
  label="Disabled Date"
  value="2/22/2022"
  disabled
></dia-date-picker>
```

## Readonly

Adding the `readonly` attribute will allow the input to be focused on, but the date cannot be modified and the calendar control cannot be expanded.

<dia-date-picker label="Readonly Date" value="2/22/2022" readonly></dia-date-picker>

```html
<dia-date-picker
  label="Readonly Date"
  value="2/22/2022"
  readonly
></dia-date-picker>
```

## Focus Date

If you don't want to set the value, but you want the calendar to be focused on a specific date initially, you can use the `focus-date` attribute.

<dia-date-picker label="Focus Date" focus-date="2-22-2022"></dia-date-picker>

```html
<dia-date-picker label="Focus Date" focus-date="2-22-2022"></dia-date-picker>
```

## Min/Max Dates

You can provide a range of available date using the `min-date` and `max-date` attributes.

<dia-date-picker label="Date Range" min-date="3/5/2022" max-date="3/20/2022"></dia-date-picker>

```html
<dia-date-picker
  label="Date Range"
  min-date="3/5/2022"
  max-date="3/20/2022"
></dia-date-picker>
```

## Disabled Dates

In order to disabled multiple dates, you can pass a comma separated list of dates to the `disabled-dates` attribute.

<dia-date-picker label="Disabled Dates" disabled-dates="5/5/2022,5/8/2022, 5/19/2022, 5/25/2022"></dia-date-picker>

```html
<dia-date-picker
  label="Disabled Dates"
  disabled-dates="5/5/2022,5/8/2022, 5/19/2022, 5/25/2022"
></dia-date-picker>
```

## Week Numbers

When the `show-week-numbers` attribute is added to the component, week numbers will appear at the beginning of each week's row indicating the week number in the year.

<dia-date-picker label="Show Week Numbers" show-week-numbers></dia-date-picker>

```html
<dia-date-picker label="Show Week Numbers" show-week-numbers></dia-date-picker>
```

## Disabled Days of the Week

There may be occasion where only weekends need to be available or specific days of the week may not be. This can be achieved by adding a comma separated list of week days (1-7) to the `disabled-week-days` attribute.

<dia-date-picker label="Disabled Weekends" disabled-week-days="1,7"></dia-date-picker>

```html
<dia-date-picker
  label="Disabled Weekends"
  disabled-week-days="1,7"
></dia-date-picker>
```

## First Day of the Week

Depending on your application or your location, you may want to start the day of the week with a day other than Sunday. You can pass the number of days to off-set the week by (0-6) to the `first-day-of-week` attribute to shift the week to your preference.

<dia-date-picker label="Week Starts on Monday" first-day-of-week="1"></dia-date-picker>

```html
<dia-date-picker
  label="Week Starts on Monday"
  first-day-of-week="1"
></dia-date-picker>
```

## Translations

This component is almost entirely translated by the native browser API. The component will automatically detect the current language, but you can also manually specify a language using the `lang` attribute.

Not only will the months and days be translated, but the format of the input will be updated to match the date format of that locale.

In the demo below, select a locale below and see how it is translated.

<lang-switcher />

::: tip Translatable Fields
As you can see not everything gets translated. You will need to provide translations for the labels for day, month, and year inputs, button labels and error messages.
:::

## Accessibility

These components have been built form the ground up with accessibility in mind. A lot fo effort has gone into ensuring that this component works well with keyboards and assistive technologies like screen readers.

### Keyboard Navigation

#### Date Picker Input

When focused on the main input, users can use <kbd>LEFT</kbd> and <kbd>RIGHT</kbd> arrow keys to move between day, month, and year input fields. Basic <kbd>TAB</kbd> functionality will also enable users to switch back and forth.

When entering values in the input fields, users will automatically be moved to the next input field once appropriate values have been added to it to not additional tabbing or arrow key presses are necessary.

When focused on the main input, users can press the <kbd>SPACE</kbd> key to trigger the calendar dialog. This is similar to existing behavior for the `date` input type.

#### Date Picker Dialog

Once the calendar dialog is open you can navigate the days in the calendar using the <kbd>ARROW</kbd> keys and the rest of the controls in the dialog using the <kbd>TAB</kbd> key.

If the value or focus date has been set and the user has focused on another date, pressing the <kbd>ESC</kbd> key will reset the date back to the originally focused date. Pressing the <kbd>ESC</kbd> key again will close the dialog. Otherwise, pressing the <kbd>ESC</kbd> key will close the dialog and set the focus back on the main input.

### Screen Readers

This component has been decorated with the appropriate `roles`, `aria` attributes, and labels to ensure users utilizing screen readers can accurately input or select an appropriate date.

## Attributes / Properties

<attribute-docs tag="dia-date-picker" />

## CSS Properties

<css-prop-docs tag="dia-date-picker" />

## CSS Parts

<css-parts-docs tag="dia-date-picker" />

## Events

<events-docs tag="dia-date-picker" />
