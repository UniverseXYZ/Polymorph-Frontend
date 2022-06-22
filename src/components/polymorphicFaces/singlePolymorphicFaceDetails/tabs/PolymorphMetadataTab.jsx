import React from "react";
import PolymorphMetadataCard from "../../../polymorphs/polymorphMetadataCard/PolymorphMetadataCard";
import { useContractsStore } from "src/stores/contractsStore";

const PolymorphMetadataTab = ({ morphPrice, owner, genome }) => {
  // Dummy data
  const polymorphMetadata = [
    {
      id: 1,
      label: "Next morph price",
      price: morphPrice,
      address: null,
    },
    {
      id: 2,
      label: "Owner",
      address: owner,
    },
    {
      id: 3,
      label: "Genome string",
      address: genome,
    },
  ];

  return (
    <div className="polymorph--metadata--tab">
      {polymorphMetadata.map((metadata) => (
        <PolymorphMetadataCard key={metadata.id} metadata={metadata} />
      ))}
    </div>
  );
};

export default PolymorphMetadataTab;
