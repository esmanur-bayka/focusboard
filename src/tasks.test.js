import { describe, expect, it } from 'vitest';
import { INITIAL_TASKS, STORAGE_KEY, filterTasks, getProgress, readTasks, validateTask, writeTasks } from './tasks.js';

describe('task data and persistence', () => {
  it('rejects blank and overlong titles', () => {
    expect(validateTask({ ...INITIAL_TASKS[0], title: '   ' })).toBeTruthy();
    expect(validateTask({ ...INITIAL_TASKS[0], title: 'x'.repeat(101) })).toBeTruthy();
  });
  it('rejects invalid enum values and oversized notes', () => {
    for (const [key, value] of [['category', 'Other'], ['status', 'invalid'], ['priority', 'invalid'], ['note', 'x'.repeat(501)]]) {
      expect(validateTask({ ...INITIAL_TASKS[0], [key]: value })).toBeTruthy();
    }
  });
  it('loads demos only on first visit, preserving a saved empty board', () => {
    expect(readTasks(localStorage).tasks).toHaveLength(5);
    localStorage.setItem(STORAGE_KEY, '[]');
    expect(readTasks(localStorage).tasks).toEqual([]);
  });
  it('preserves corrupt data instead of silently overwriting it', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');
    expect(readTasks(localStorage).error).toBeTruthy();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{broken');
  });
  it('rejects duplicate task IDs and invalid stored objects', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([INITIAL_TASKS[0], INITIAL_TASKS[0]]));
    expect(readTasks(localStorage).error).toBeTruthy();
    localStorage.setItem(STORAGE_KEY, '[null]');
    expect(readTasks(localStorage).error).toBeTruthy();
  });
  it('reports unavailable storage without crashing', () => {
    const unavailable = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('quota'); } };
    expect(readTasks(unavailable).error).toBeTruthy();
    expect(writeTasks(unavailable, [])).toBeTruthy();
  });
  it('combines text, category and priority filters with Turkish casing', () => {
    const task = { ...INITIAL_TASKS[0], title: 'İLETİŞİM ARAYÜZÜ' };
    expect(filterTasks([task], { query: 'iletişim', category: 'Web', priority: 'high' })).toEqual([task]);
    expect(filterTasks([task], { query: 'iletişim', category: 'Mobil' })).toEqual([]);
    expect(filterTasks([task], { priority: 'low' })).toEqual([]);
  });
  it('computes progress safely for empty and mixed lists', () => {
    expect(getProgress([])).toEqual({ total: 0, done: 0, doing: 0, percentage: 0 });
    expect(getProgress(INITIAL_TASKS)).toEqual({ total: 5, done: 2, doing: 1, percentage: 40 });
  });
});
