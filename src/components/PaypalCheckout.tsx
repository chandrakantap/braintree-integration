import braintree from "braintree-web";
import Script from "next/script";
import { AuthorizationResponse } from "paypal-checkout-components";
import { useState } from "react";

export type PaypalCheckoutProps = {
  authorization: string;
  id?: string;
};

const PaypalCheckout = (props: PaypalCheckoutProps) => {
  const { authorization, id = "paypal-button" } = props;
  const [paymentPayload, setPayload] = useState<AuthorizationResponse>();

  const initialisePaypalUI = async function () {
    await braintree.client
      .create({ authorization })
      .then(function (client) {
        return braintree.paypalCheckout.create({ client });
      })
      .then(function (paypalCheckoutInstance) {
        return paypalCheckoutInstance.loadPayPalSDK({
          currency: "USD",
          intent: "capture",
        });
      })
      .then(function (paypalCheckoutInstance) {
        return window.paypal
          .Buttons({
            fundingSource: "paypal",
            style: {
              color: "white",
              shape: "pill",
            },
            createOrder: function () {
              return paypalCheckoutInstance.createPayment({
                flow: "checkout",
                amount: 145.34,
                currency: "USD",
                intent: "capture",
                enableShippingAddress: true,
                shippingAddressEditable: false,
                shippingAddressOverride: {
                  recipientName: "Scruff McGruff",
                  line1: "1234 Main St.",
                  line2: "Unit 1",
                  city: "Chicago",
                  countryCode: "US",
                  postalCode: "60652",
                  state: "IL",
                  phone: "123.456.7890",
                },
              });
            },
            onApprove: async function (data): Promise<AuthorizationResponse> {
              const payload = await paypalCheckoutInstance.tokenizePayment(
                data
              );
              setPayload(payload);
              return payload;
            },
          })
          .render(`#${id}`);
      })
      .then(function () {
        console.log("Render done");
      });
  };
  return (
    <>
      <div id={id} />
      {paymentPayload ? (
        <>
          <h2>Received Payload</h2>
          <pre>{JSON.stringify(paymentPayload, null, 2)}</pre>
        </>
      ) : null}
      <Script
        src="https://js.braintreegateway.com/web/3.111.0/js/client.min.js"
        onReady={() => void initialisePaypalUI()}
      />
    </>
  );
};

export default PaypalCheckout;
