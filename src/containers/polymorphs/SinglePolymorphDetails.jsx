import React from "react";
import ImageWithBadges from "../../components/polymorphs/singlePolymorphDetails/ImageWithBadges";
import DetailsWithTabs from "../../components/polymorphs/singlePolymorphDetails/DetailsWithTabs";
import { useRouter } from "next/router";
import { useSearchPolymorphs } from "@legacy/hooks/useMyNftsRarityDebouncerAll";
import LoadingSpinner from "../../components/svgs/LoadingSpinner.jsx";

export const SinglePolymorphDetails = () => {
  const router = useRouter();

  const { results } = useSearchPolymorphs();
  const polymorphId = router.query.id;
  const polymorphMetadata = results.filter(
    (result) => polymorphId === result.tokenid.toString()
  );

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
