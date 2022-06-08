import React, { useState } from "react";
import { OpenGraph } from "@app/components";
import ImageWithBadges from "../../components/polymorphs/singlePolymorphDetails/ImageWithBadges";
import DetailsWithTabs from "../../components/polymorphs/singlePolymorphDetails/DetailsWithTabs";
import LoadingSpinner from "../../components/svgs/LoadingSpinner.jsx";
import { getPolymorphMetaV2 } from "@legacy/api/polymorphs";

export const SinglePolymorphDetails = ({ polymorphMeta, animationUrl, isV1 }) => {
  const [update, setUpdate] = useState(false);

  const updateHandler = (update) => {
    setUpdate(update);
  };

  return (
    <>
      {polymorphMeta?.length ? (
        <>
          <OpenGraph
            title={`Polymorph ${polymorphMeta[0]?.character} #${polymorphMeta[0]?.tokenid}`}
            description={polymorphMeta[0]?.description || undefined}
            image={polymorphMeta[0]?.imageurl || undefined}
          />
          <>
            <div className="single--polymorph--details--page">
              <>
                <ImageWithBadges
                  polymorphId={polymorphMeta[0]?.tokenid}
                  polymorphData={polymorphMeta[0]}
                  isV1={isV1}
                  iframeData={animationUrl || null}
                />
                <DetailsWithTabs
                  polymorphId={polymorphMeta[0]?.tokenid}
                  polymorphData={polymorphMeta[0]}
                  isV1={isV1}
                  update={updateHandler}
                />
              </>
            </div>
          </>
        </>
      ) : (
        <div className="loading">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
};

export async function getStaticProps({ params }) {
  let animationUrl;
  let isV1 = true;

  const v1Request = await fetch(`${process.env.REACT_APP_RARITY_METADATA_URL}?ids=${params.id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  let polymorphMeta = await v1Request.json();

  if (polymorphMeta.length == 0) {
    const v2Request = await fetch(`${process.env.REACT_APP_RARITY_METADATA_URL_V2}?ids=${params.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    polymorphMeta = await v2Request.json();
    const { data } = await getPolymorphMetaV2(params.id);
    animationUrl = data?.animation_url;
    isV1 = false;
  }

  return {
    props: {
      polymorphMeta: polymorphMeta,
      animationUrl: animationUrl || null,
      isV1: isV1,
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
