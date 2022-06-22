import React, { useEffect, useState } from "react";
import { OpenGraph } from "@app/components";
import ImageWithBadges from "../../components/polymorphicFaces/singlePolymorphicFaceDetails/ImageWithBadges";
import DetailsWithTabs from "../../components/polymorphicFaces/singlePolymorphicFaceDetails/DetailsWithTabs";
import LoadingSpinner from "../../components/svgs/LoadingSpinner.jsx";
import { getPolymorphMetaV2 } from "@legacy/api/polymorphs";
import { useRouter } from "next/router";

export const SinglePolymorphicFaceDetails = ({ polymorphicMeta }) => {
  const router = useRouter();
  const [update, setUpdate] = useState(false);
  const [metadata, setMetadata] = useState(polymorphicMeta);

  const updateHandler = (update) => {
    setUpdate(update);
  };

  // Fetch new data
  // useEffect(async () => {
  //   if (update) {
  //     const v2Request = await fetch(
  //       `${process.env.REACT_APP_RARITY_METADATA_URL_V2}?ids=${router.query.id}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const polymorphMeta = await v2Request.json();
  //     setMetadata(polymorphMeta);

  //     const { data } = await getPolymorphMetaV2(router.query.id);
  //     setIframeUrl(data?.animation_url);

  //     setUpdate(false);
  //   }
  // }, [update]);

  return (
    <>
      {polymorphicMeta?.length ? (
        <>
          <OpenGraph
            title={`Polymorph ${polymorphicMeta[0]?.character} #${polymorphicMeta[0]?.tokenid}`}
            description={polymorphicMeta[0]?.description || undefined}
            image={polymorphicMeta[0]?.imageurl || undefined}
          />
          <>
            <div className="single--polymorph--details--page">
              <>
                <ImageWithBadges
                  polymorphId={
                    metadata ? metadata[0].tokenid : polymorphicMeta[0].tokenid
                  }
                  polymorphicData={metadata ? metadata[0] : polymorphicMeta[0]}
                  isV1={true}
                  iframeData={""}
                />
                <DetailsWithTabs
                  polymorphId={
                    metadata ? metadata[0].tokenid : polymorphicMeta[0].tokenid
                  }
                  polymorphicData={metadata ? metadata[0] : polymorphicMeta[0]}
                  isV1={true}
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
  const v1Request = await fetch(
    `${process.env.REACT_APP_RARITY_METADATA_URL}?ids=${params.id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let polymorphicMeta = await v1Request.json();

  return {
    props: {
      polymorphicMeta: polymorphicMeta,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
