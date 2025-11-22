import { Habit } from '@/types';

const formatICSDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

const getRecurrenceRule = (occurrence: Habit['occurrence']): string => {
  switch (occurrence) {
    case 'daily':
      return 'FREQ=DAILY';
    case 'weekly':
      return 'FREQ=WEEKLY';
    case 'weekdays':
      return 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR';
    default:
      return 'FREQ=DAILY';
  }
};

const getTimeForHabit = (timeOfDay: Habit['timeOfDay']): { hour: number; minute: number } => {
  switch (timeOfDay) {
    case 'morning':
      return { hour: 8, minute: 0 };
    case 'afternoon':
      return { hour: 14, minute: 0 };
    case 'evening':
      return { hour: 19, minute: 0 };
    case 'anytime':
    default:
      return { hour: 10, minute: 0 };
  }
};

export const generateICSFile = (habits: Habit[]): string => {
  const now = new Date();
  const dtstamp = formatICSDate(now);
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Habito//Habit Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ].join('\r\n');

  habits.forEach(habit => {
    const { hour, minute } = getTimeForHabit(habit.timeOfDay);
    const startDate = new Date(habit.createdAt);
    startDate.setHours(hour, minute, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30); // 30-minute event
    
    const dtstart = formatICSDate(startDate);
    const dtend = formatICSDate(endDate);
    const rrule = getRecurrenceRule(habit.occurrence);
    
    icsContent += '\r\n' + [
      'BEGIN:VEVENT',
      `UID:${habit.id}@habito.app`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `RRULE:${rrule}`,
      `SUMMARY:${habit.name}`,
      `DESCRIPTION:${habit.description}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
    ].join('\r\n');
  });

  icsContent += '\r\nEND:VCALENDAR';
  
  return icsContent;
};

export const downloadICSFile = (habits: Habit[], filename: string = 'habito-calendar.ics'): void => {
  const icsContent = generateICSFile(habits);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
