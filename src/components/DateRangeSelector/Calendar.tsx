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
  ranges
}: CalendarProps) {
  const { days, firstDay } = getDaysInMonth(currentMonth);
  const prevMonthDays = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    0
  ).getDate();

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-button" onClick={onPrevMonth}>
          {"<"}
        </button>
        <div className="current-month">
          {currentMonth.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })}
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
            {prevMonthDays - firstDay + index + 1}
          </button>
        ))}

        {Array.from({ length: days }).map((_, index) => {
          const day = index + 1;
          const isSelected = ranges.some(
            range =>
              isDateStart(day, range.id) ||
              isDateEnd(day, range.id) ||
              isDateInRange(day, range.id)
          );

          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              className={`day ${isSelected ? 'selected' : ''}`}
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