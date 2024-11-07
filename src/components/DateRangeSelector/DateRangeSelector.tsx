import React, { useState } from 'react';
import { Calendar } from './Calendar';
import { DateRange } from './DateRange';
import './styles.css';

interface DateRangeType {
  id: string;
  startDate: Date | null;
  endDate: Date | null;
  color: string;
}

const COLORS = [
  '#ec4899',
  '#a855f7',
  '#3b82f6',
  '#22c55e',
  '#eab308',
  '#f97316'
];

export default function DateRangeSelector() {
  const [ranges, setRanges] = useState<DateRangeType[]>([
    { id: '1', startDate: null, endDate: null, color: COLORS[0] }
  ]);
  const [leftMonth, setLeftMonth] = useState(new Date());
  const [rightMonth, setRightMonth] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)));
  const [selectedRange, setSelectedRange] = useState<string>('1');
  const [isDualView, setIsDualView] = useState(true);

  const addNewRange = () => {
    if (ranges.length >= COLORS.length) return;
    const newRange = {
      id: Date.now().toString(),
      startDate: null,
      endDate: null,
      color: COLORS[ranges.length % COLORS.length]
    };
    setRanges([...ranges, newRange]);
    setSelectedRange(newRange.id);
  };

  const removeRange = (id: string) => {
    setRanges(ranges.filter(range => range.id !== id));
    if (selectedRange === id) {
      setSelectedRange(ranges[0]?.id || '');
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateClick = (day: number, isLeftCalendar: boolean) => {
    const clickedDate = new Date(
      isLeftCalendar ? leftMonth.getFullYear() : rightMonth.getFullYear(),
      isLeftCalendar ? leftMonth.getMonth() : rightMonth.getMonth(),
      day
    );

    setRanges(ranges.map(range => {
      if (range.id !== selectedRange) return range;

      if (!range.startDate || (range.startDate && range.endDate)) {
        return { ...range, startDate: clickedDate, endDate: null };
      }

      if (clickedDate < range.startDate) {
        return { ...range, startDate: clickedDate, endDate: range.startDate };
      }

      return { ...range, endDate: clickedDate };
    }));
  };

  const isDateInRange = (day: number, rangeId: string, isLeftCalendar: boolean) => {
    const date = new Date(
      isLeftCalendar ? leftMonth.getFullYear() : rightMonth.getFullYear(),
      isLeftCalendar ? leftMonth.getMonth() : rightMonth.getMonth(),
      day
    );
    const range = ranges.find(r => r.id === rangeId);
    if (!range?.startDate || !range?.endDate) return false;
    return date >= range.startDate && date <= range.endDate;
  };

  const isDateStart = (day: number, rangeId: string, isLeftCalendar: boolean) => {
    const date = new Date(
      isLeftCalendar ? leftMonth.getFullYear() : rightMonth.getFullYear(),
      isLeftCalendar ? leftMonth.getMonth() : rightMonth.getMonth(),
      day
    ).getTime();
    const range = ranges.find(r => r.id === rangeId);
    return range?.startDate?.getTime() === date;
  };

  const isDateEnd = (day: number, rangeId: string, isLeftCalendar: boolean) => {
    const date = new Date(
      isLeftCalendar ? leftMonth.getFullYear() : rightMonth.getFullYear(),
      isLeftCalendar ? leftMonth.getMonth() : rightMonth.getMonth(),
      day
    ).getTime();
    const range = ranges.find(r => r.id === rangeId);
    return range?.endDate?.getTime() === date;
  };

  const handleLeftMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(leftMonth.getFullYear(), leftMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setLeftMonth(newDate);

    if (isDualView) {
      // Ensure right month is always ahead
      if (newDate >= rightMonth) {
        setRightMonth(new Date(newDate.getFullYear(), newDate.getMonth() + 1));
      }
    }
  };

  const handleRightMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(rightMonth.getFullYear(), rightMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setRightMonth(newDate);

    // Ensure left month is always behind
    if (newDate <= leftMonth) {
      setLeftMonth(new Date(newDate.getFullYear(), newDate.getMonth() - 1));
    }
  };

  const handleLeftYearChange = (year: number) => {
    const newDate = new Date(year, leftMonth.getMonth());
    setLeftMonth(newDate);

    if (isDualView) {
      // Ensure right month is always ahead
      if (newDate >= rightMonth) {
        setRightMonth(new Date(year, newDate.getMonth() + 1));
      }
    }
  };

  const handleRightYearChange = (year: number) => {
    const newDate = new Date(year, rightMonth.getMonth());
    setRightMonth(newDate);

    // Ensure left month is always behind
    if (newDate <= leftMonth) {
      setLeftMonth(new Date(year, newDate.getMonth() - 1));
    }
  };

  const toggleView = () => {
    setIsDualView(!isDualView);
  };

  return (
    <div className="date-range-selector">
      <div className="header">
        <h2 className="title">Date Ranges</h2>
        <div className="header-controls">
          <button className="view-toggle" onClick={toggleView}>
            {isDualView ? 'Single Calendar' : 'Dual Calendar'}
          </button>
          {ranges.length < COLORS.length && (
            <button className="add-button" onClick={addNewRange} title="Add new range">
              {"+"}
            </button>
          )}
        </div>
      </div>

      <div className="ranges">
        {ranges.map(range => (
          <DateRange
            key={range.id}
            {...range}
            isSelected={selectedRange === range.id}
            onSelect={() => setSelectedRange(range.id)}
            onRemove={() => removeRange(range.id)}
            showRemove={ranges.length > 1}
            formatDate={formatDate}
          />
        ))}
      </div>

      <div className={`calendars-container ${isDualView ? 'dual' : 'single'}`}>
        <Calendar
          currentMonth={leftMonth}
          onPrevMonth={() => handleLeftMonthChange('prev')}
          onNextMonth={() => handleLeftMonthChange('next')}
          onSelectDay={(day) => handleDateClick(day, true)}
          getDaysInMonth={getDaysInMonth}
          isDateInRange={(day, rangeId) => isDateInRange(day, rangeId, true)}
          isDateStart={(day, rangeId) => isDateStart(day, rangeId, true)}
          isDateEnd={(day, rangeId) => isDateEnd(day, rangeId, true)}
          ranges={ranges}
          onYearChange={handleLeftYearChange}
        />
        {isDualView && (
          <Calendar
            currentMonth={rightMonth}
            onPrevMonth={() => handleRightMonthChange('prev')}
            onNextMonth={() => handleRightMonthChange('next')}
            onSelectDay={(day) => handleDateClick(day, false)}
            getDaysInMonth={getDaysInMonth}
            isDateInRange={(day, rangeId) => isDateInRange(day, rangeId, false)}
            isDateStart={(day, rangeId) => isDateStart(day, rangeId, false)}
            isDateEnd={(day, rangeId) => isDateEnd(day, rangeId, false)}
            ranges={ranges}
            onYearChange={handleRightYearChange}
          />
        )}
      </div>
    </div>
  );
}