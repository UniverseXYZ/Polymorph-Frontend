import React, { useEffect, useState } from "react";
import ImageWithBadges from "../../components/polymorphs/singlePolymorphDetails/ImageWithBadges";
import DetailsWithTabs from "../../components/polymorphs/singlePolymorphDetails/DetailsWithTabs";
import { useRouter } from "next/router";
import LoadingSpinner from "../../components/svgs/LoadingSpinner.jsx";
import { getPolymorphMetaV2 } from "@legacy/api/polymorphs";

export const SinglePolymorphDetails = () => {
  const router = useRouter();
  const [polymorphMetadata, setPolymorphMetadata] = useState([]);
  const [iframeData, setIframeData] = useState();
  const [isV1, setIsV1] = useState(true);
  const polymorphId = router.query.id;

  // Fetch V2 first
  useEffect(async () => {
    if (polymorphId) {
      try {
        const request = await fetch(
          `${process.env.REACT_APP_RARITY_METADATA_URL_V2}?ids=${polymorphId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await request.json();
        if (data.length > 0) {
          setIsV1(false);
          setPolymorphMetadata(data);
        } else {
          setIsV1(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [polymorphId]);

  // Fetch iframe if token is V2
  useEffect(async () => {
    if (!isV1 && polymorphId) {
      try {
        const { data } = await getPolymorphMetaV2(polymorphId);
        setIframeData(data.animation_url);
      } catch (error) {
        console.log(error);
      }
    }
  }, [isV1, polymorphId]);

  // Fetch V1, if token was not V2
  useEffect(async () => {
    if (isV1 && polymorphId) {
      try {
        const request = await fetch(
          `${process.env.REACT_APP_RARITY_METADATA_URL}?ids=${polymorphId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await request.json();
        setPolymorphMetadata(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [isV1, polymorphId]);

  return (
    <>
      {polymorphMetadata.length ? (
        <div className="single--polymorph--details--page">
          <>
            <ImageWithBadges
              polymorphId={polymorphId}
              polymorphData={polymorphMetadata[0]}
              isV1={isV1}
              iframeData={iframeData}
            />
            <DetailsWithTabs
              polymorphId={polymorphId}
              polymorphData={polymorphMetadata[0]}
              isV1={isV1}
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
