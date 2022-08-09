import React from "react";
import PolymorphMetadataCard from "../../polymorphMetadataCard/PolymorphMetadataCard";
import { useContractsStore } from "src/stores/contractsStore";

const PolymorphMetadataTab = ({
  morphPrice,
  owner,
  genome,
  contractAddress,
  tokenId,
  tokenStandard,
  network,
}) => {
  // Dummy data
  const polymorphMetadata = [
    {
      id: 1,
      label: "Contract Address",
      address: contractAddress,
    },
    {
      id: 2,
      label: "Token ID",
      value: tokenId,
    },
    {
      id: 3,
      label: "Token Standard",
      value: tokenStandard,
    },
    {
      id: 4,
      label: "Blockchain",
      value: network,
    },
    {
      id: 5,
      label: "Owner",
      address: owner,
    },
    {
      id: 6,
      label: "Genome string",
      address: genome,
    },
    {
      id: 7,
      label: "Next morph price",
      price: morphPrice,
      address: null,
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
