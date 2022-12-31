import type { IkarusResponse } from "@/lib/types.ikarus";
import { DefaultIkarusResponse } from "@/lib/types.ikarus";
import type { NextApiRequest, NextApiResponse } from "next";

const vercel_env = process.env.VERCEL_ENV;

const dateToday = () => {
  if (vercel_env === "preview") {
    return "20221221";
  } else {
    const date = new Date();
    // Skip weekends
    if (date.getDay() === 6) {
      date.setDate(date.getDate() + 2);
    } else if (date.getDay() === 0) {
      date.setDate(date.getDate() + 1);
    }
    return date.toISOString().split("T")[0]?.replace(/-/g, "");
  }
};

const dateTomorrow = () => {
  if (vercel_env === "preview") {
    return "20221222";
  } else {
    const date = new Date();
    // Skip weekends
    if (date.getDay() === 5 || date.getDay() === 6) {
      date.setDate(date.getDate() + 2);
    } else if (date.getDay() === 0) {
      date.setDate(date.getDate() + 1);
    }
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0]?.replace(/-/g, "");
  }
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
          "Accept-Encoding": "*",
          "Content-Type": "application/json",
        },
        keepalive: true,
        body: JSON.stringify(reqBody),
        method: "POST",
        // revalidate every 4.5 minutes
        next: { revalidate: 270 },
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

const IkarusFetchHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<IkarusResponse | unknown>
) => {
  if (req.query.variant === "Heute" || req.query.variant === "Morgen") {
    try {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "s-maxage=270, stale-while-revalidate");
      const response = await ikarusFetch(req.query.variant);
      if (response.date !== "") {
        res.status(200).end(JSON.stringify(response));
      } else {
        // Wait 50ms then redirect to the same endpoint
        await new Promise((resolve) => setTimeout(resolve, 50));
        res.setHeader("Cache-Control", "no-store");
        res.redirect(307, `/api/IkarusFetch/${req.query.variant}`);
      }
    } catch (error) {
      res.status(500).end(JSON.stringify(error));
    }
  } else {
    res.status(400).end(JSON.stringify({ message: "Invalid variant" }));
  }
};

export default IkarusFetchHandler;
