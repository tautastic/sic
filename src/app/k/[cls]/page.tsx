import IkarusTable from "@/ui/IkarusTable";

const Page = async () => {
  return (
    <div className="space-y-4">
      <IkarusTable variant={"Heute"} />
      <IkarusTable variant={"Morgen"} />
    </div>
  );
};

export default Page;
