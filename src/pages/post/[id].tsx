import Head from "next/head";
import { api } from "~/utils/api";
import { type GetStaticProps } from "next";
import { Layout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { PostView } from "~/components/PostView";
import { LoadingPage } from "~/components/loading";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function SinglePostPage({ id }: { id: string }) {
  const newId = parseInt(id);
  const { user } = useUser();
  const [sure, setSure] = useState(false);
  const { data } = api.posts.getById.useQuery({ newId });
  const router = useRouter();
  const { mutate, isLoading: isDeleting } = api.posts.delete.useMutation({
    onSuccess: async () => {
      toast.success("Post deleted");
      await router.push("/");
    },
  });

  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <Layout>
        <PostView {...data} />
        {user?.id == data.author.id && (
          <div className="flex h-20 items-center">
            {!sure && (
              <button
                disabled={isDeleting}
                onClick={() => {
                  setSure(true);
                }}
                className="flex h-full w-full items-center justify-center border border-slate-400"
              >
                Delete Post
              </button>
            )}
            {sure && (
              <>
                <button
                  disabled={isDeleting}
                  className="flex h-full w-1/2 items-center justify-center border border-slate-400"
                  onClick={() => {
                    mutate({ newId });
                  }}
                >
                  Yes, Delete It
                </button>
                <button
                  disabled={isDeleting}
                  className="flex h-full w-1/2 items-center justify-center border border-slate-400"
                  onClick={() => {
                    setSure(false);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
            {isDeleting && <LoadingPage />}
          </div>
        )}
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

  await ssg.posts.getById.prefetch({ newId });

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
