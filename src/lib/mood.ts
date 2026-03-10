import type { Mood } from '../types';

export interface MoodStyle {
  bg: string;
  text: string;
  border: string;
  label: string;
  emoji: string;
}

export const MOOD_STYLES: Record<Mood, MoodStyle> = {
  happy: {
    bg: '#FEF9E7',
    text: '#B8860B',
    border: '#F2C94C',
    label: 'Happy',
    emoji: '😊',
  },
  calm: {
    bg: '#E8F8EF',
    text: '#2E7D4F',
    border: '#6FCF97',
    label: 'Calm',
    emoji: '😌',
  },
  grateful: {
    bg: '#F5E6F9',
    text: '#8E44AD',
    border: '#BB6BD9',
    label: 'Grateful',
    emoji: '🙏',
  },
  anxious: {
    bg: '#FEF3E6',
    text: '#C56F17',
    border: '#F2994A',
    label: 'Anxious',
    emoji: '😰',
  },
  sad: {
    bg: '#E8EEF5',
    text: '#4A6B8A',
    border: '#6B8EBD',
    label: 'Sad',
    emoji: '😢',
  },
  angry: {
    bg: '#FCE8E8',
    text: '#C0392B',
    border: '#EB5757',
    label: 'Angry',
    emoji: '😠',
  },
  reflective: {
    bg: '#EFEBF5',
    text: '#6B5B8C',
    border: '#9B8EC2',
    label: 'Reflective',
    emoji: '🤔',
  },
  energized: {
    bg: '#E6F7FC',
    text: '#2980B9',
    border: '#56CCF2',
    label: 'Energized',
    emoji: '⚡',
  },
};
