"use client";

import BraiTreeDropinUI from "@/components/BrainTreeDropInUI";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["CLIENT_TOKEN"],
    queryFn: () => fetch("/api/braintree/token").then((res) => res.json()),
  });
  if (!data?.clientToken) {
    return null;
  }
  return (
    <div className="flex flex-col justify-center items-center gap-8 h-screen p-8">
      <div className="w-full md:w-1/2 mx-auto">
        <BraiTreeDropinUI authorization={data.clientToken} />
      </div>
    </div>
  );
}
