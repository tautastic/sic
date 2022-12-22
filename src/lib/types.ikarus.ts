export interface IkarusRow {
  classes: string;
  info: string;
  originalTeacher: string;
  period: string;
  room: string;
  subject: string;
  substituteTeacher: string;
  text: string;
  time: string;
}

export interface IkarusResponse {
  date: string;
  lastUpdate: string;
  messageData: { messages: [] };
  nextDate: string;
  rows: IkarusRow[];
  weekDay: string;
}

export const DefaultIkarusResponse: IkarusResponse = {
  date: "",
  lastUpdate: "",
  messageData: { messages: [] },
  nextDate: "",
  rows: [],
  weekDay: "",
};
