import braintree from "braintree";

export async function GET() {
  const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "vpz2dppz6kybj8jd",
    publicKey: "4c3czxxjr2bznmq9",
    privateKey: process.env.PRIVATE_KEY || "",
  });
  const clientToken = await gateway.clientToken
    .generate({})
    .then((response) => response.clientToken)
    .catch((err) => err);
  return Response.json({ clientToken });
}
