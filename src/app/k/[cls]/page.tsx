import IkarusTable from "@/ui/IkarusTable";
import { IkarusFetchToday, IkarusFetchTomorrow } from "@/lib/IkarusFetch";

const Page = async () => {
  const ikarusDataToday = await IkarusFetchToday();
  const ikarusDataTomorrow = await IkarusFetchTomorrow();

  return (
    <div className="space-y-4">
      {ikarusDataToday && (
        <IkarusTable
          variant={"Heute"}
          fetchedData={ikarusDataToday}
        />
      )}
      {ikarusDataTomorrow && (
        <IkarusTable
          variant={"Morgen"}
          fetchedData={ikarusDataTomorrow}
        />
      )}
    </div>
  );
};

export default Page;
