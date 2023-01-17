import type { IkarusResponse } from "@/lib/types.ikarus";
import { DefaultIkarusResponse } from "@/lib/types.ikarus";

const DateToday = () => {
  if (process.env.VERCEL_ENV === "preview") {
    return "20220117";
  } else {
    const date = new Date();
    // Skip weekends
    if (date.getDay() === 6) {
      date.setDate(date.getDate() + 2);
    } else if (date.getDay() === 0) {
      date.setDate(date.getDate() + 1);
    } else if (19 <= date.getHours()) {
      date.setDate(date.getDate() + 1);
    }
    return date.toISOString().split("T")[0]?.replace(/-/g, "");
  }
};

const DateTomorrow = () => {
  if (process.env.VERCEL_ENV === "preview") {
    return "20220118";
  } else {
    const date = new Date();
    // Skip weekends
    if (date.getDay() === 5 || date.getDay() === 6) {
      date.setDate(date.getDate() + 2);
    } else if (date.getDay() === 0) {
      date.setDate(date.getDate() + 1);
    } else if (19 <= date.getHours()) {
      date.setDate(date.getDate() + 1);
    }
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0]?.replace(/-/g, "");
  }
};

const FormatDate = (date: string) => {
  return new Date(
    date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8)
  ).toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

const requestBody = (variant: "Heute" | "Morgen") => {
  return {
    date: variant === "Heute" ? DateToday() : DateTomorrow(),
    dateOffset: 0,
    departmentIds: [],
    formatName: variant,
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
    showHour: true,
    showInfo: true,
    showMessages: true,
    showOnlyFutureSub: true,
    showRoom: true,
    showSubject: true,
    showSubstText: true,
    showSubstitutionFrom: 0,
    showTeacher: true,
    showTime: true,
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
    requestTime: Date.now(),
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

const IkarusFetch = async (
  variant: "Heute" | "Morgen"
): Promise<IkarusResponse> => {
  try {
    const reqBody = requestBody(variant);
    const res = await fetch(
      "https://ikarus.webuntis.com/WebUntis/monitor/substitution/data?school=hh5837",
      {
        headers: {
          "Accept": "*/*",
          "Accept-Encoding": "*",
          "Content-Type": "application/json",
        },
        keepalive: true,
        body: JSON.stringify(reqBody),
        method: "POST",
        cache: "no-store",
      }
    );
    if (res.ok) {
      return await parseIkarusRes(res);
    }
  } catch (error) {
    console.log(error);
  }
  return DefaultIkarusResponse;
};

export { DateToday, DateTomorrow, FormatDate, IkarusFetch };
