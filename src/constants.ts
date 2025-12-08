
import type { ScheduleDay } from "./types";

export const SCHEDULE_DATA: ScheduleDay[] = [
  {
    day: 'Monday',
    sessions: [
      { id: 'mon-1', subject: 'Electronics System', startTime: '08:00', endTime: '08:50', type: 'Lecture' },
      { id: 'mon-2', subject: 'Technical English', startTime: '09:50', endTime: '10:40', type: 'Lecture' },
      { id: 'mon-3', subject: 'Manuf Process', startTime: '10:45', endTime: '11:35', type: 'Lecture' },
    ]
  },
  {
    day: 'Tuesday',
    sessions: [
      { id: 'tue-1', subject: 'Manuf Process', startTime: '08:00', endTime: '08:50', type: 'Lecture' },
      { id: 'tue-2', subject: 'Physics', startTime: '09:50', endTime: '10:40', type: 'Lecture' },
      { id: 'tue-3', subject: 'Maths', startTime: '10:45', endTime: '11:35', type: 'Lecture' },
      { id: 'tue-4', subject: 'Electronics System Lab', startTime: '11:40', endTime: '13:20', type: 'Lab' },
      { id: 'tue-5', subject: 'Phy Lab', startTime: '14:00', endTime: '15:40', type: 'Lab' },
    ]
  },
  {
    day: 'Wednesday',
    sessions: [
      { id: 'wed-1', subject: 'Maths', startTime: '08:00', endTime: '08:50', type: 'Lecture' },
      { id: 'wed-2', subject: 'Electronics System', startTime: '08:55', endTime: '09:45', type: 'Lecture' },
      { id: 'wed-3', subject: 'Technical English', startTime: '10:45', endTime: '11:35', type: 'Lecture' },
      { id: 'wed-4', subject: 'Manuf Process', startTime: '15:50', endTime: '17:30', type: 'Lecture' },
    ]
  },
  {
    day: 'Thursday',
    sessions: [
      { id: 'thu-1', subject: 'Technical English', startTime: '08:00', endTime: '08:50', type: 'Lecture' },
      { id: 'thu-2', subject: 'Manuf Process', startTime: '08:55', endTime: '09:45', type: 'Lecture' },
      { id: 'thu-3', subject: 'Physics', startTime: '10:45', endTime: '11:35', type: 'Lecture' },
      { id: 'thu-4', subject: 'Maths', startTime: '11:40', endTime: '12:30', type: 'Lecture' },
      { id: 'thu-5', subject: 'Technical English Lab', startTime: '14:00', endTime: '15:40', type: 'Lab' },
      { id: 'thu-6', subject: 'Java', startTime: '15:50', endTime: '17:30', type: 'Lecture' },
    ]
  },
  {
    day: 'Friday',
    sessions: [
      { id: 'fri-1', subject: 'Physics', startTime: '08:00', endTime: '08:50', type: 'Lecture' },
      { id: 'fri-2', subject: 'Maths', startTime: '08:55', endTime: '09:45', type: 'Lecture' },
      { id: 'fri-3', subject: 'Electronics System', startTime: '09:50', endTime: '10:40', type: 'Lecture' },
      { id: 'fri-4', subject: 'Java', startTime: '11:40', endTime: '13:20', type: 'Lecture' },
    ]
  },
  {
    day: 'Saturday',
    sessions: []
  },
  {
    day: 'Sunday',
    sessions: []
  }
];

export const TIMER_URL = "https://vclock.com/timer/";

// Monochrome Gray Scale Aesthetic
export const SUBJECT_COLORS: Record<string, string> = {
  'Electronics System': 'border-gray-800 bg-[#F5F5F5] text-gray-900', // Very Light Gray
  'Technical English': 'border-gray-800 bg-[#E5E5E5] text-gray-900',   // Light Gray
  'Manuf Process': 'border-gray-800 bg-[#D4D4D4] text-gray-900',       // Medium Gray
  'Physics': 'border-gray-800 bg-[#FAFAFA] text-gray-900',             // White Smoke
  'Maths': 'border-gray-800 bg-[#EEEEEE] text-gray-900',                // Paper Gray
  'Java': 'border-gray-800 bg-[#DDDDDD] text-gray-900',                 // Silver
  'Lab': 'border-gray-800 bg-white text-gray-900'                       // Pure White
};

export const DAILY_QUOTES = [
  "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
  "Perform your obligatory duty, because action is indeed better than inaction.",
  "Set thy heart upon thy work, but never on its reward.",
  "A gift is pure when it is given from the heart to the right person at the right time and at the right place, and when we expect nothing in return.",
  "Change is the law of the universe. You can be a millionaire, or a pauper in an instant.",
  "The mind is restless and difficult to restrain, but it is subdued by practice.",
  "There is neither this world, nor the world beyond, nor happiness for the one who doubts.",
  "One who sees inaction in action, and action in inaction, is intelligent among men.",
  "Man is made by his belief. As he believes, so he is.",
  "Delusion arises from anger. The mind is bewildered by delusion.",
  "Reshape yourself through the power of your will; never let yourself be degraded by self-will.",
  "Happiness is a state of mind, that has nothing to do with the external world.",
  "The only way you can conquer me is through love and there I am gladly conquered.",
  "Calmness, gentleness, silence, self-restraint, and purity: these are the disciplines of the mind."
];
