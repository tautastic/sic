import { Boundary } from "@/ui/Boundary";

export const IkarusTableLoading = () => {
  return (
    <Boundary labels={["Lade...", "Lade..."]}>
      <div className="overflow-y-hidden overflow-x-scroll">
        <div className="text-center text-gray-400">Lade...</div>
      </div>
    </Boundary>
  );
};
