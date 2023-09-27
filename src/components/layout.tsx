import { type PropsWithChildren } from "react";
import breads from "../../public/bread.png"
import Image from "next/image";
import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";

export const Layout = (props: PropsWithChildren) => {
  const { user, isSignedIn } = useUser();

  return (
    <main className="flex h-screen justify-around md:flex-row flex-col">
      <div className="flex md:flex-col flex-row md:justify-start border-slate-400 justify-between">
        <Link href={"/"}>
        <div className="py-5 px-5 md:px-0 flex items-center">
          <Image src={breads} alt={"Breads Logo"} width={46} height={46}/>
          <h1 className="text-2xl font-bold ml-2 justify-self-center">Breads</h1>
        </div>
        </Link>
        <div className="items-start flex-col gap-4 h-full flex justify-center md:justify-start md:px-0 px-5">
        {isSignedIn && <><h1 className="text-2xl font-bold pt-10 hidden md:inline">{`Welcome ${user?.firstName ?? ""}`}</h1>
          <SignOutButton /></>}
          {!isSignedIn && <div className="text-2xl font-bold pt-10 hidden md:inline">Welcome to Breads</div>}
        </div>
        <p className="text-sm justify-self-end py-5 px-5 md:px-0 md:inline hidden">Created by <Link className="underline" href="http://atomic-hiroto.github.io/">Pritam</Link> / <Link className="underline" href="https://create.t3.gg/">T3 Stack</Link></p>
      </div>
      <div className="h-full w-full md:border-x border-slate-400 md:max-w-2xl overflow-y-scroll">
          {props.children}
      </div>
    </main>
  );
};
