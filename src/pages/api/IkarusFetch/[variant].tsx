import type { IkarusResponse } from "@/lib/types.ikarus";
import { DefaultIkarusResponse } from "@/lib/types.ikarus";
import type { NextApiRequest, NextApiResponse } from "next";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dateToday = () => {
  const date = new Date();
  return date.toISOString().split("T")[0]?.replace(/-/g, "");
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dateTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0]?.replace(/-/g, "");
};

const testingDateHeute = () => {
  return "20221221";
};

const testingDateMorgen = () => {
  return "20221222";
};

const makeReqBody = (variant: "Heute" | "Morgen") => {
  return {
    activityTypeIds: [3],
    // TODO: Change to dateToday() and dateTomorrow() after testing
    date: variant === "Heute" ? testingDateHeute() : testingDateMorgen(),
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
          "Accept-Encoding": "gzip, deflate, br",
          "Content-Type": "application/json",
        },
        keepalive: true,
        body: JSON.stringify(reqBody),
        method: "POST",
        // revalidate every 5 minutes
        next: { revalidate: 300 },
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
      const response = await ikarusFetch(req.query.variant);
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "max-age=60");
      if (response.date !== "") {
        res.status(200).end(JSON.stringify(response));
      } else {
        res.redirect(302, `/api/IkarusFetch/${req.query.variant}`);
      }
    } catch (error) {
      res.json(error);
      res.status(500).end();
    }
  } else {
    res.json({ message: "Invalid variant" });
    res.status(400).end();
  }
};

export default IkarusFetchHandler;
