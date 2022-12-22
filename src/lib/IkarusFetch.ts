import type { IkarusResponse } from "@/lib/types.ikarus";
import { DefaultIkarusResponse } from "@/lib/types.ikarus";
import "server-only";

const dateToday = () => {
  const date = new Date();
  // TODO: Fix this
  //  For testing purposes this currently returns yesterday
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0]?.replace(/-/g, "");
};

const dateTomorrow = () => {
  const date = new Date();
  // TODO: Fix this
  //  For testing purposes this currently returns the day before yesterday
  date.setDate(date.getDate() - 2);
  return date.toISOString().split("T")[0]?.replace(/-/g, "");
};

const makeReqBody = (variant: "Heute" | "Morgen") => {
  return {
    activityTypeIds: [3],
    date: variant === "Heute" ? dateToday() : dateTomorrow(),
    dateOffset: 0,
    departmentElementType: -1,
    departmentIds: [],
    enableSubstitutionFrom: false,
    formatName: variant,
    groupBy: -1,
    hideAbsent: false,
    hideCancelCausedByEvent: false,
    hideCancelWithSubstitution: true,
    mergeBlocks: true,
    schoolName: "hh5837",
    showAbsentElements: [],
    showAbsentTeacher: true,
    showAffectedElements: [],
    showBreakSupervisions: true,
    showCancel: true,
    showClass: true,
    showEvent: true,
    showExamSupervision: false,
    showHour: true,
    showInfo: true,
    showMessages: true,
    showOnlyCancel: false,
    showOnlyFutureSub: true,
    showRoom: true,
    showStudentgroup: false,
    showSubject: true,
    showSubstText: true,
    showSubstTypeColor: false,
    showSubstitutionFrom: 0,
    showTeacher: true,
    showTeacherOnEvent: false,
    showTime: true,
    showUnheraldedExams: false,
    showUnitTime: false,
    strikethrough: false,
    strikethroughAbsentTeacher: false,
  };
};

const parseIkarusRes: (res: Response) => Promise<IkarusResponse> = async (
  res: Response
) => {
  const tmp = await res.json();
  const payloadData = tmp.payload;
  const dataRows = payloadData.rows;

  return {
    date: payloadData.date.toString(),
    nextDate: payloadData.nextDate.toString(),
    rows: [
      ...dataRows.map((row: { data: string[] }) => ({
        period: row.data[0],
        time: row.data[1],
        classes: row.data[2],
        subject: row.data[3],
        room: row.data[4]?.replace(/<[^>]*>/g, "").split(" ")[0],
        substituteTeacher: row.data[5]
          ?.replace(/<[^>]*>/g, "")
          .split(" ")
          .at(-2),
        originalTeacher: row.data[5]
          ?.replace(/<[^>]*>/g, "")
          .split(" ")
          .at(-1),
        info: row.data[6],
        text: row.data[7],
      })),
    ],
    lastUpdate: payloadData.lastUpdate,
    messageData: payloadData.messageData,
    weekDay: payloadData.weekDay,
  };
};

const ikarusFetch = async (
  variant: "Heute" | "Morgen"
): Promise<IkarusResponse> => {
  try {
    const reqBody = makeReqBody(variant);
    const res = await fetch(
      "https://ikarus.webuntis.com/WebUntis/monitor/substitution/data?school=hh5837",
      {
        headers: {
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Content-Type": "application/json",
        },
        keepalive: true,
        body: JSON.stringify(reqBody),
        method: "POST",
      }
    );
    if (res.ok) {
      return await parseIkarusRes(res);
    }
  } catch (error) {
    // console.log(error);
  }
  return DefaultIkarusResponse;
};

export const IkarusFetchToday = async (): Promise<IkarusResponse> => {
  return await ikarusFetch("Heute");
};

export const IkarusFetchTomorrow = async (): Promise<IkarusResponse> => {
  return await ikarusFetch("Morgen");
};
