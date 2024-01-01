"use client";
import RecoilRootProvider from "./RecoilProvider";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <RecoilRootProvider>{children}</RecoilRootProvider>
    </>
  );
};

export default RootProvider;
