import { LogRecord } from '@/types';

const LOG_KEY = 'habito.completionLog';

export const getCompletionLog = (): LogRecord[] => {
  try {
    const data = localStorage.getItem(LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading completion log:', error);
    return [];
  }
};

export const addLogEntry = (entry: LogRecord): void => {
  try {
    const log = getCompletionLog();
    log.push(entry);
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch (error) {
    console.error('Error adding log entry:', error);
  }
};

export const clearCompletionLog = (): void => {
  try {
    localStorage.removeItem(LOG_KEY);
  } catch (error) {
    console.error('Error clearing log:', error);
  }
};

export const getLogForHabit = (habitId: string): LogRecord[] => {
  return getCompletionLog().filter(log => log.habitId === habitId);
};

export const getLogInDateRange = (startDate: Date, endDate: Date): LogRecord[] => {
  const log = getCompletionLog();
  return log.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= startDate && entryDate <= endDate;
  });
};
