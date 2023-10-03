import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";
import {dark} from "@clerk/themes";

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark
    }} >
      <Head>
        <title>Breads</title>
        <meta name="description" content="🍞" />
        <link rel="icon" href="/images/bread.png" />
      </Head>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
