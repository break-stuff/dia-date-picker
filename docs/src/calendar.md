# Calendar

The Dia calendar component is an open source calendar UI element.

## Usage

<dia-calendar></dia-calendar>

```html
<dia-calendar></dia-calendar>
```

## Focus Date

If you don't want to set the value, but you want the calendar to be focused on a specific date initially, you can use the `focus-date` attribute.

<dia-calendar focus-date="2-22-2022"></dia-calendar>

```html
<dia-calendar focus-date="2-22-2022"></dia-calendar>
```

## Min/Max Dates

You can provide a range of available date using the `min-date` and `max-date` attributes.

<dia-calendar min-date="3/5/2022" max-date="3/20/2022"></dia-calendar>

```html
<dia-calendar min-date="3/5/2022" max-date="3/20/2022"></dia-calendar>
```

## Disabled Dates

In order to disabled multiple dates, you can pass a comma separated list of dates to the `disabled-dates` attribute.

<dia-calendar disabled-dates="5/5/2022,5/8/2022, 5/19/2022, 5/25/2022"></dia-calendar>

```html
<dia-calendar
  disabled-dates="5/5/2022,5/8/2022, 5/19/2022, 5/25/2022"
></dia-calendar>
```

## Week Numbers

When the `show-week-numbers` attribute is added to the component, week numbers will appear at the beginning of each week's row indicating the week number in the year.

<dia-calendar show-week-numbers></dia-calendar>

```html
<dia-calendar show-week-numbers></dia-calendar>
```

## Disabled Days of the Week

There may be occasion where only weekends need to be available or specific days of the week may not be. This can be achieved by adding a comma separated list of week days (1-7) to the `disabled-week-days` attribute.

<dia-calendar disabled-week-days="1,7"></dia-calendar>

```html
<dia-calendar disabled-week-days="1,7"></dia-calendar>
```

## First Day of the Week

Depending on your application or your location, you may want to start the day of the week with a day other than Sunday. You can pass the number of days to off-set the week by (0-6) to the `first-day-of-week` attribute to shift the week to your preference.

<dia-calendar first-day-of-week="1"></dia-calendar>

```html
<dia-calendar first-day-of-week="1"></dia-calendar>
```

## Accessibility

These components have been built form the ground up with accessibility in mind. A lot fo effort has gone into ensuring that this component works well with keyboards and assistive technologies like screen readers.

### Keyboard Navigation

#### Date Picker Dialog

You can navigate the days in the calendar using the <kbd>ARROW</kbd> keys and the rest of the controls using the <kbd>TAB</kbd> key.

### Screen Readers

This component has been decorated with the appropriate `roles`, `aria` attributes, and labels to ensure users utilizing screen readers can accurately input or select an appropriate date.

## Attributes / Properties

<attribute-docs tag="dia-calendar" />

## CSS Properties

<css-prop-docs tag="dia-calendar" />

## CSS Parts

<css-parts-docs tag="dia-calendar" />

## Events

<events-docs tag="dia-calendar" />
