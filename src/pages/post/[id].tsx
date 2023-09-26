import Head from "next/head";
import { api } from "~/utils/api";
import { type GetStaticProps } from "next";
import { Layout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { PostView } from "~/components/PostView";


export default function SinglePostPage({ id }: { id: string }) {
  const newId = parseInt(id);
  const { data } = api.posts.getById.useQuery({ newId });

  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <Layout>
        <PostView {...data} />
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;
  console.log(id);

  if (typeof id !== "string") throw new Error("no id");
  const newId = parseInt(id);

  await ssg.posts.getById.prefetch({newId});

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
