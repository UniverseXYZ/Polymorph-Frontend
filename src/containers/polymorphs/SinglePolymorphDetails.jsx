import React, { useState, useEffect } from "react";
import ImageWithBadges from "../../components/polymorphs/singlePolymorphDetails/ImageWithBadges";
import DetailsWithTabs from "../../components/polymorphs/singlePolymorphDetails/DetailsWithTabs";
import { useContractsStore } from "src/stores/contractsStore";
import { useRouter } from "next/router";
import { useSearchPolymorphs } from "@legacy/hooks/useRarityDebouncer";
import LoadingSpinner from "../../components/svgs/LoadingSpinner.jsx";

export const SinglePolymorphDetails = () => {
  const router = useRouter();
  const [contract, setContract] = useState(null);
  const { polymorphContract, polymorphContractV2 } = useContractsStore();

  const { results } = useSearchPolymorphs();
  const polymorphId = router.query.id;
  const polymorphMetadata = results.filter(
    (result) => polymorphId === result.tokenid.toString()
  );

  useEffect(async () => {
    if (polymorphContract && polymorphContractV2) {
      try {
        if (await polymorphContract.ownerOf(polymorphId)) {
          setContract(polymorphContract);
        }
      } catch (err) {
        if (await polymorphContractV2.ownerOf(polymorphId)) {
          setContract(polymorphContractV2);
        }
      }
    }
  }, [polymorphContract, polymorphContractV2]);

  return (
    <>
      {polymorphMetadata.length ? (
        <div className="single--polymorph--details--page">
          <>
            <ImageWithBadges
              polymorphId={polymorphId}
              polymorphData={polymorphMetadata[0]}
            />
            <DetailsWithTabs
              polymorphId={polymorphId}
              polymorphData={polymorphMetadata[0]}
            />
          </>
        </div>
      ) : (
        <div className="loading">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
};
