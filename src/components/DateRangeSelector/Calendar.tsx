import React from 'react';
import './styles.css';

interface CalendarProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: number) => void;
  getDaysInMonth: (date: Date) => { days: number; firstDay: number };
  isDateInRange: (day: number, rangeId: string) => boolean;
  isDateStart: (day: number, rangeId: string) => boolean;
  isDateEnd: (day: number, rangeId: string) => boolean;
  ranges: Array<{ id: string; color: string }>;
  onYearChange: (year: number) => void;
}

export function Calendar({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  getDaysInMonth,
  isDateInRange,
  isDateStart,
  isDateEnd,
  ranges,
  onYearChange
}: CalendarProps) {
  const { days, firstDay } = getDaysInMonth(currentMonth);
  const prevMonthDays = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    0
  ).getDate();

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-button" onClick={onPrevMonth}>
          {"<"}
        </button>
        <div className="current-month">
          <span>{currentMonth.toLocaleDateString('en-US', { month: 'long' })}</span>
          <select
            value={currentMonth.getFullYear()}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className="year-select"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <button className="nav-button" onClick={onNextMonth}>
          {">"}
        </button>
      </div>

      <div className="weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="days">
        {Array.from({ length: firstDay }).map((_, index) => (
          <button key={`prev-${index}`} className="day disabled">
            <span className="day-number">{prevMonthDays - firstDay + index + 1}</span>
          </button>
        ))}

        {Array.from({ length: days }).map((_, index) => {
          const day = index + 1;
          const classes = ['day'];

          ranges.forEach(range => {
            if (isDateStart(day, range.id)) classes.push('range-start');
            if (isDateEnd(day, range.id)) classes.push('range-end');
          });

          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              className={classes.join(' ')}
            >
              {ranges.map(range => {
                if (
                  isDateStart(day, range.id) ||
                  isDateEnd(day, range.id) ||
                  isDateInRange(day, range.id)
                ) {
                  return (
                    <div
                      key={range.id}
                      className="day-highlight"
                      style={{ backgroundColor: range.color }}
                    />
                  );
                }
                return null;
              })}
              <span className="day-number">{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}