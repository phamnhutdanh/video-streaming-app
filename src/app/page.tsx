"use client";
import { type NextPage } from "next";
import Head from "next/head";
import { Layout } from "~/Components/Components";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/shared";

const Home: NextPage = () => {
  const { data, isLoading, error } = api.video.getRandomVideos.useQuery(40);

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

      <Layout closeSidebar={false}>
        <p>This is from home pages</p>
      </Layout>
    </>
  );
};

export default api.withTRPC(Home);
