import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>SANSMedia</title>
        <meta name="description" content="Social Media Post" key="desc" />
        <meta property="og:title" content="SANSMedia" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:image" itemProp="image" content="/logo.png" />
        <meta property="og:description" content="Website media social Post" />
        <meta property="og:url" content="https://sansmedia.vercel.app/" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
