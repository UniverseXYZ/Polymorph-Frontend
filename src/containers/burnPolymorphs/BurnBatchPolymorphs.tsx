import React from "react";
import BurnPolymorphs from "../../components/burnPolymorphs/BurnPolymorphs";
import { usePolymorphStore } from "src/stores/polymorphStore";
import { OpenGraph } from "@app/components";
import OpenGraphImage from "@assets/images/open-graph/polymorphs.png";

export const BurnBatchPolymorphs = () => {
  const { userSelectedPolymorphsToBurn } = usePolymorphStore();

  return (
    <>
      <OpenGraph
        title={`Burn a Polymorph`}
        description={`Upgrade your Polymorph from a V1 to a V2 to unlock new features and content.`}
        image={OpenGraphImage}
      />
      <BurnPolymorphs characters={userSelectedPolymorphsToBurn} type="batch" />
    </>
  );
};
