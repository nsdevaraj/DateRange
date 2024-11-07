import React from 'react';
import './styles.css';

interface DateRangeProps {
  id: string;
  color: string;
  startDate: Date | null;
  endDate: Date | null;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  showRemove: boolean;
  formatDate: (date: Date) => string;
}

export function DateRange({
  id,
  color,
  startDate,
  endDate,
  isSelected,
  onSelect,
  onRemove,
  showRemove,
  formatDate
}: DateRangeProps) {
  return (
    <div
      className={`date-range ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="color-indicator" style={{ backgroundColor: color }} />
      <div className="date-range-content">
        <div className="date-range-text">
          {startDate ? formatDate(startDate) : 'Select start date'} -{' '}
          {endDate ? formatDate(endDate) : 'Select end date'}
        </div>
      </div>
      {showRemove && (
        <button className="remove-button" onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}>
          {"x"}
        </button>
      )}
    </div>
  );
}