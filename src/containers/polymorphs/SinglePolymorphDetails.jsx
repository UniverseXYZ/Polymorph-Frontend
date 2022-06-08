import React, { useEffect, useState } from "react";
import ImageWithBadges from "../../components/polymorphs/singlePolymorphDetails/ImageWithBadges";
import DetailsWithTabs from "../../components/polymorphs/singlePolymorphDetails/DetailsWithTabs";
import { useRouter } from "next/router";
import LoadingSpinner from "../../components/svgs/LoadingSpinner.jsx";
import { getPolymorphMetaV2 } from "@legacy/api/polymorphs";
import Head from "next/head";

export const SinglePolymorphDetails = () => {
  const router = useRouter();
  const [polymorphMetadata, setPolymorphMetadata] = useState([]);
  const [iframeData, setIframeData] = useState();
  const [isV1, setIsV1] = useState("");
  const [update, setUpdate] = useState(false);
  const polymorphId = router.query.id;

  // Fetch V2 first
  useEffect(async () => {
    if (polymorphId || update) {
      try {
        const request = await fetch(`${process.env.REACT_APP_RARITY_METADATA_URL_V2}?ids=${polymorphId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await request.json();
        if (data.length > 0) {
          setIsV1(false);
          setPolymorphMetadata(data);
        } else {
          setIsV1(true);
        }
        setUpdate(false);
      } catch (error) {
        console.log(error);
      }
    }
  }, [polymorphId, update]);

  // Fetch iframe if token is V2
  useEffect(async () => {
    if ((!isV1 && polymorphId) || update) {
      try {
        const { data } = await getPolymorphMetaV2(polymorphId);
        setIframeData(data.animation_url);
      } catch (error) {
        console.log(error);
      }
    }
  }, [isV1, polymorphId, update]);

  // Fetch V1, if token was not V2
  useEffect(async () => {
    if (isV1 && polymorphId) {
      try {
        const request = await fetch(`${process.env.REACT_APP_RARITY_METADATA_URL}?ids=${polymorphId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await request.json();
        setPolymorphMetadata(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [isV1, polymorphId]);

  const updateHandler = (update) => {
    setUpdate(update);
  };

  return (
    <>
      {polymorphMetadata.length ? (
        <>
          <Head>
            <title>
              Polymorph {polymorphMetadata[0]?.character} #{polymorphMetadata[0]?.tokenid}
            </title>
            <meta property="og:image" content={polymorphMetadata[0]?.imageurl} key="ogimage" />
            <meta
              property="og:title"
              content={`Polymorph ${polymorphMetadata[0]?.character} #${polymorphMetadata[0]?.tokenid}`}
              key="ogtitle"
            />
            <meta property="og:description" content={polymorphMetadata[0]?.description} key="ogdesc" />
          </Head>
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
                update={updateHandler}
              />
            </>
          </div>
        </>
      ) : (
        <div className="loading">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
};
