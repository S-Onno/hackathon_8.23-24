export type StudyLog = {
  date: string;
  hours: number;
  topic: string;
};

export type FriendProfile = {
  name: string;
  goal: string;
  favoriteSubject: string;
};

export type FriendSummary = {
  id: string;
  name: string;
  today: number;
  week: number;
  month: number;
};

export type FriendDetails = FriendSummary & {
  lastStudyDate: string;
  message: string;
  studyLogs: StudyLog[];
  profile: FriendProfile;
};
