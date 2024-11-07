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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<string>('1');

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

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
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

  const isDateInRange = (day: number, rangeId: string) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const range = ranges.find(r => r.id === rangeId);
    if (!range?.startDate || !range?.endDate) return false;
    return date >= range.startDate && date <= range.endDate;
  };

  const isDateStart = (day: number, rangeId: string) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    ).getTime();
    const range = ranges.find(r => r.id === rangeId);
    return range?.startDate?.getTime() === date;
  };

  const isDateEnd = (day: number, rangeId: string) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    ).getTime();
    const range = ranges.find(r => r.id === rangeId);
    return range?.endDate?.getTime() === date;
  };

  return (
    <div className="date-range-selector">
      <div className="header">
        <h2 className="title">Date Ranges</h2>
        {ranges.length < COLORS.length && (
          <button className="add-button" onClick={addNewRange} title="Add new range">
            {"+"}
          </button>
        )}
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

      <Calendar
        currentMonth={currentMonth}
        onPrevMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
        onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
        onSelectDay={handleDateClick}
        getDaysInMonth={getDaysInMonth}
        isDateInRange={isDateInRange}
        isDateStart={isDateStart}
        isDateEnd={isDateEnd}
        ranges={ranges}
      />
    </div>
  );
}