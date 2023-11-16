"use client";
import { type NextPage } from "next";
import Head from "next/head";
import { Layout } from "~/Components/Components";
import { ErrorMessage, LoadingMessage } from "~/Components/ErrorMessage";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/shared";

const Home: NextPage = () => {
  const { data, isLoading, error } = api.video.getRandomVideos.useQuery(40);

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (error || !data) {
      return (
        <ErrorMessage
          icon="GreenPlay"
          message="No Videos"
          description="Sorry there is no videos at this time."
        />
      );
    } else {
      return <></>;
    }
  };

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
        {!data ? (
          <Error />
        ) : (
          <>
            <p>Data is true</p>
          </>
        )}
      </Layout>
    </>
  );
};

export default api.withTRPC(Home);
