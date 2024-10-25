import braintree from "braintree";

export async function GET() {
  const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "s2x93ws328wvd2q6",
    publicKey: "mcydk25chcpz7ghq",
    privateKey: "2893bf9ebf19c72b41d97f1212694ccf",
  });
  const clientToken = await gateway.clientToken
    .generate({})
    .then((response) => response.clientToken)
    .catch((err) => err);
  return Response.json({ clientToken });
}
