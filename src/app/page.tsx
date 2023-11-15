import Head from "next/head";
import { Layout } from "~/Components/Components";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  return (
    <>
      <Head>
        <title>Vidchill</title>
        <meta
          name="description"
          content=" Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on VidChill."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <p>This is from home pages</p>
      </Layout>
    </>
  );
}
