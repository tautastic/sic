import { Boundary } from "@/ui/Boundary";

export const IkarusTableLoading = () => {
  return (
    <Boundary labels={["Lade...", "Lade..."]}>
      <div className="overflow-y-hidden overflow-x-scroll">
        <div className="my-6 text-center leading-loose text-gray-400">
          Lade...
        </div>
      </div>
    </Boundary>
  );
};
