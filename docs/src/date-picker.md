# Date Picker

## Usage

```html
<ks-date-picker label="Default"></ks-date-picker>
```

<ks-date-picker label="Default"></ks-date-picker>

The default date picker component will provide you with an input field and the calendar dialog. The dialog can be activated by clicking calendar icon on the right side of the input.

## Keyboard Navigation

You can navigate the day, month, and year input fields using the <kbd>LEFT</kbd> and <kbd>RIGHT</kbd> arrow keys. Focus will automatically shift as you add content to the input fields. Pressing the <kbd>SPACE</kbd> key when focused on either the `month`, `day`, or `year` inputs will open the calendar dialog.

Once the calendar dialog is open you can navigate the days in the calendar using the <kbd>ARROW</kbd> keys and the rest of the controls using the <kbd>TAB</kbd> key. to close the dialog and return to the input, press the <kbd>ESC</kbd> key.

## Date Range

You can provide a range of available date using the `min-date` and `max-date` attributes.

```html
<ks-date-picker label="Date Range" min-date="3/5/2022" max-date="3/20/2022"></ks-date-picker>
```
<ks-date-picker label="Date Range" min-date="3/5/2022" max-date="3/20/2022"></ks-date-picker>

## Validation

Beside setting the date range on the component, you can also indicate if it is required using the <code>required</code> attribute.

```html
<ks-date-picker label="Required Date" required></ks-date-picker>
```

<ks-date-picker label="Required Date" required></ks-date-picker>

## Translations

This component is almost entirely translated by the browser. The component will automatically detect the current language, but you can also manually specify a language. Enter the locale of you favorite language using the `lang` attribute and it will translate the component to the appropriate language.

In the demo below, select a locale below and see how it is translated.

<lang-switcher />

::: tip Translatable Fields
As you can see not everything gets translated. It will need translations for the following attributes:

- `label` - the main input label
- `day-label` - label for day input field (for screen readers)
- `month-label` - label for month input field (for screen readers)
- `year-label` - label for year input field (for screen readers)
- `clear-label` - text for the "Clear" button in the calendar control
- `today-label` - text for the "Today" button in the calendar control
:::

## Week Numbers

<ks-date-picker label="Show Week Numbers" show-week-numbers></ks-date-picker>


## Attributes / Properties

<attribute-docs tag="ks-date-picker" />

## CSS Properties

<css-prop-docs tag="ks-date-picker" />

## CSS Parts

<css-parts-docs tag="ks-date-picker" />

## Events

<events-docs tag="ks-date-picker" />