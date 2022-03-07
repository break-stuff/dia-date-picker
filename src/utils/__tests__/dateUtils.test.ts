import {
  isValidDate,
  isOutOfRange,
  getMonths,
  getDaysOfTheWeek,
  addDaysToDate,
  getWeeks,
  getDaysInMonth,
} from '../dateUtils';

describe('isOutOfRange function', () => {
  test('should be in range', () => {
    // Arrange
    const checkDate = new Date('2022-2-10');
    const minDate = new Date('2022-2-2');
    const maxDate = new Date('2022-2-22');

    // Act
    const result = isOutOfRange(checkDate, minDate, maxDate);

    //Assert
    expect(result).toBe(false);
  });

  test('should be out of range', () => {
    // Arrange
    const checkDate = new Date('2022-2-25');
    const minDate = new Date('2022-2-2');
    const maxDate = new Date('2022-2-22');

    // Act
    const result = isOutOfRange(checkDate, minDate, maxDate);

    //Assert
    expect(result).toBe(true);
  });
});

describe('getMonths function', () => {
  test('should return an array of English months', () => {
    // Arrange

    // Act
    const result = getMonths('en-US');

    //Assert
    expect(result[0]).toBe('January');
    expect(result[11]).toBe('December');
  });

  test('should return an array of Polish months', () => {
    // Arrange

    // Act
    const result = getMonths('pl-PL');

    //Assert
    expect(result[0]).toBe('styczeń');
    expect(result[11]).toBe('grudzień');
  });
});

describe('getDaysOfTheWeek function', () => {
  test('should return an array of English days', () => {
    // Arrange

    // Act
    const result = getDaysOfTheWeek('en-US');

    //Assert
    expect(result[0].abbr).toBe('S');
    expect(result[3].abbr).toBe('W');
  });

  test('should return an array of Chinese days', () => {
    // Arrange

    // Act
    const result = getDaysOfTheWeek('zh-CN');

    //Assert
    expect(result[0].abbr).toBe('日');
    expect(result[4].abbr).toBe('四');
  });
});

describe('addDaysToDate function', () => {
  test('should add 3 days to date', () => {
    // Arrange
    const startDate = new Date('2022-2-22');

    // Act
    const result = addDaysToDate(startDate, 3);

    //Assert
    expect(result.toLocaleDateString('en-US')).toBe('2/25/2022');
  });

  test('should subtract 5 days from date', () => {
    // Arrange
    const startDate = new Date('2022-2-22');

    // Act
    const result = addDaysToDate(startDate, -5);

    //Assert
    expect(result.toLocaleDateString('en-US')).toBe('2/17/2022');
  });
});

describe('getWeeks function', () => {
  test('should get weeks for February 2022', () => {
    // Arrange

    // Act
    const result = getWeeks(1, 2022);

    //Assert
    expect(result[0][0].toLocaleDateString('en-US')).toBe('1/30/2022');
    expect(result[4][6].toLocaleDateString('en-US')).toBe('3/5/2022');
  });

  test('should get weeks for March 2023', () => {
    // Arrange

    // Act
    const result = getWeeks(2, 2023);

    //Assert
    expect(result[0][0].toLocaleDateString('en-US')).toBe('2/26/2023');
    expect(result[4][6].toLocaleDateString('en-US')).toBe('4/1/2023');
  });
});

describe('getDaysInMonth function', () => {
  test('should get 31 for January 2022', () => {
    // Arrange

    // Act
    const result = getDaysInMonth(1, 2022);

    //Assert
    expect(result).toBe(31);
  });

  test('should get 29 day in February for a leap year', () => {
    // Arrange

    // Act
    const result = getDaysInMonth(2, 2020);

    //Assert
    expect(result).toBe(29);
  });
});

describe('isValidDate function', () => {
  test("should return 'false' when passed 'foo'", () => {
    // Arrange
    const date = new Date('foo');

    // Act
    const result = isValidDate(date);

    //Assert
    expect(result).toBe(false);
  });

  test("should return 'true' when passed '2/22/2022'", () => {
    // Arrange
    const date = new Date('2/22/2022');

    // Act
    const result = isValidDate(date);

    //Assert
    expect(result).toBe(true);
  });
});
