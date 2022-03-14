import { expect } from '@esm-bundle/chai';
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
  it('should be in range', () => {
    // Arrange
    const checkDate = new Date('2022-2-10');
    const minDate = new Date('2022-2-2');
    const maxDate = new Date('2022-2-22');

    // Act
    const result = isOutOfRange(checkDate, minDate, maxDate);

    //Assert
    expect(result).to.equal(false);
  });

  it('should be out of range', () => {
    // Arrange
    const checkDate = new Date('2/25/2022');
    const minDate = new Date('2/2/2022');
    const maxDate = new Date('2/22/2022');

    // Act
    const result = isOutOfRange(checkDate, minDate, maxDate);

    //Assert
    expect(result).to.equal(true);
  });
});

describe('getMonths function', () => {
  it('should return an array of English months', () => {
    // Arrange

    // Act
    const result = getMonths('en-US');

    //Assert
    expect(result[0]).to.equal('January');
    expect(result[11]).to.equal('December');
  });

  it('should return an array of Polish months', () => {
    // Arrange

    // Act
    const result = getMonths('pl-PL');

    //Assert
    expect(result[0]).to.equal('styczeń');
    expect(result[11]).to.equal('grudzień');
  });
});

describe('getDaysOfTheWeek function', () => {
  it('should return an array of English days', () => {
    // Arrange

    // Act
    const result = getDaysOfTheWeek('en-US');

    //Assert
    expect(result[0].abbr).to.equal('S');
    expect(result[3].abbr).to.equal('W');
  });

  it('should return an array of Chinese days', () => {
    // Arrange

    // Act
    const result = getDaysOfTheWeek('zh-CN');

    //Assert
    expect(result[0].abbr).to.equal('日');
    expect(result[4].abbr).to.equal('四');
  });
});

describe('addDaysToDate function', () => {
  it('should add 3 days to date', () => {
    // Arrange
    const startDate = new Date('2/22/2022');

    // Act
    const result = addDaysToDate(startDate, 3);

    //Assert
    expect(result.toLocaleDateString('en-US')).to.equal('2/25/2022');
  });

  it('should subtract 5 days from date', () => {
    // Arrange
    const startDate = new Date('2/22/2022');

    // Act
    const result = addDaysToDate(startDate, -5);

    //Assert
    expect(result.toLocaleDateString('en-US')).to.equal('2/17/2022');
  });
});

describe('getWeeks function', () => {
  it('should get weeks for February 2022', () => {
    // Arrange

    // Act
    const result = getWeeks(1, 2022);

    //Assert
    expect(result[0][0].toLocaleDateString('en-US')).to.equal('1/30/2022');
    expect(result[4][6].toLocaleDateString('en-US')).to.equal('3/5/2022');
  });

  it('should get weeks for March 2023', () => {
    // Arrange

    // Act
    const result = getWeeks(2, 2023);

    //Assert
    expect(result[0][0].toLocaleDateString('en-US')).to.equal('2/26/2023');
    expect(result[4][6].toLocaleDateString('en-US')).to.equal('4/1/2023');
  });
});

describe('getDaysInMonth function', () => {
  it('should get 31 for January 2022', () => {
    // Arrange

    // Act
    const result = getDaysInMonth(0, 2022);

    //Assert
    expect(result).to.equal(31);
  });

  it('should get 29 day in February for a leap year', () => {
    // Arrange

    // Act
    const result = getDaysInMonth(1, 2020);

    //Assert
    expect(result).to.equal(29);
  });
});

describe('isValidDate function', () => {
  it("should return 'false' when passed 'foo'", () => {
    // Arrange
    const date = new Date('foo');

    // Act
    const result = isValidDate(date);

    //Assert
    expect(result).to.equal(false);
  });

  it("should return 'true' when passed '2/22/2022'", () => {
    // Arrange
    const date = new Date('2/22/2022');

    // Act
    const result = isValidDate(date);

    //Assert
    expect(result).to.equal(true);
  });
});
