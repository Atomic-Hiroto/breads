import Head from "next/head";
import { api } from "~/utils/api";

export default function ProfilePage({ username }: { username: string }) {
  const { data } = api.profile.getUserByUsername.useQuery({ username });

  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Layout>
        <div className="relative h-36 border-slate-400 bg-slate-600">
          <Image
            src={data.profilePicture}
            alt={`${data.username}'s profile pic`}
            width={128}
            height={128}
            className="absolute bg-black bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black"
          />
        </div>
        <div className="h-[64px]" />
        <div className="p-4 text-2xl font-bold">{`@${data.username}`}</div>
        <div className="border-b border-slate-400" />
      </Layout>
    </>
  );
}

import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";
import { db } from "~/server/db";
import { type GetStaticProps } from "next";
import { Layout } from "~/components/layout";
import Image from "next/image";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { db, userId: null },
    transformer: SuperJSON,
  });
  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username: username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
