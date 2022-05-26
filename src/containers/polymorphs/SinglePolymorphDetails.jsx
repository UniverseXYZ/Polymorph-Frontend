import React, { useEffect, useState } from "react";
import ImageWithBadges from "../../components/polymorphs/singlePolymorphDetails/ImageWithBadges";
import DetailsWithTabs from "../../components/polymorphs/singlePolymorphDetails/DetailsWithTabs";
import { useRouter } from "next/router";
import { useSearchPolymorphs } from "@legacy/hooks/useMyNftsRarityDebouncerAll";
import LoadingSpinner from "../../components/svgs/LoadingSpinner.jsx";
import { usePolymorphStore } from "src/stores/polymorphStore";

export const SinglePolymorphDetails = () => {
  const router = useRouter();
  const [iframeData, setIframeData] = useState();
  const [isV1, setIsV1] = useState();

  const { userPolymorphs } = usePolymorphStore();

  const { results } = useSearchPolymorphs();
  const polymorphId = router.query.id;
  const polymorphMetadata = results.filter(
    (result) => polymorphId === result.tokenid.toString()
  );

  useEffect(() => {
    const polymorphIsV1 = userPolymorphs.some(
      (userPolymorph) => userPolymorph.tokenId === polymorphId
    );
    if (polymorphIsV1) {
      setIsV1(true);
    } else {
      setIsV1(false);
    }
  }, []);

  useEffect(async () => {
    try {
      const source = await fetch(
        `https://us-central1-polymorphmetadata.cloudfunctions.net/rinkeby-iframe?id=${polymorphId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await source.json();
      setIframeData(json);
    } catch (err) {
      console.log(err);
    }
  }, [isV1, results]);

  return (
    <>
      {polymorphMetadata.length ? (
        <div className="single--polymorph--details--page">
          <>
            {/* IF V1 */}
            <ImageWithBadges
              polymorphId={polymorphId}
              polymorphData={polymorphMetadata[0]}
              isV1={isV1}
              iframeData={iframeData}
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
