"use client";

import PaypalCheckout from "@/components/PaypalCheckout";
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
    <div className="flex flex-col justify-center items-center gap-8 h-screen p-12">
      <div className="w-full md:w-1/2 mx-auto">
        <PaypalCheckout authorization={data.clientToken} />
      </div>
    </div>
  );
}
