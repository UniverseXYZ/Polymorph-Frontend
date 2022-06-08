import Head from 'next/head';
import { useRouter } from 'next/router';
import { lookup } from 'mime-types';

interface IOpenGraphProps {
  title: string;
  titlePostfix?: string | null;
  description?: string;
  image?: string;
  imageAlt?: string;
}

export const OpenGraph = (props: IOpenGraphProps) => {
  const {
    title: _title,
    titlePostfix = ' | Universe',
    description,
    image,
    imageAlt
  } = props;

  const router = useRouter();

  const title = `${_title}${titlePostfix || ''}`

  const url = `${process.env.REACT_APP_BASE_URL}/${router.asPath}`;

  const mimeType = image ? lookup(image) : false;

  return (
    <Head>
      <title>{title}</title>
      {description && (<meta name="description" content={description} />)}

      {/*OPEN GRAPH*/}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Universe" />
      <meta property="og:title" content={title} />
      {description && (<meta property="og:description" content={description} />)}
      {image && (<meta property="og:image" content={image} />)}
      {image && (<meta property="og:image:url" content={image} />)}
      {image && <meta property="og:image:alt" content={imageAlt || title} />}
      {mimeType && <meta property="og:image:type" content={mimeType.toString()} />}

      {/*TWITTER*/}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@universe_xyz" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      {description && (<meta name="twitter:description" content={description} />)}
      {image && (<meta name="twitter:image" content={image} />)}
      {image && <meta name="twitter:image:alt" content={imageAlt || title} />}

      {/*SCHEMA.ORG*/}
      <meta itemProp="name" content={title} />
      {description && (<meta itemProp="description" content={description} />)}
      {image && (<meta itemProp="image" content={image} />)}
    </Head>
  );
};
