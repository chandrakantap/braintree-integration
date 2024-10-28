### How to include Braintree DropInUI([Braintree Documentation](https://developer.paypal.com/braintree/docs/start/drop-in))

Below is a sample React Componet named `BrainTreeDropInUI` that can be used to integrated dropInUI in React.

```jsx
import { Dropin, PaymentMethodPayload } from "braintree-web-drop-in";
import Script from "next/script";
import { useRef, useState } from "react";

export type BraiTreeDropinUIProps = {
  authorization: string;
};

const BraiTreeDropinUI = (props: BraiTreeDropinUIProps) => {
  const { authorization } = props;
  const [paymentPayload, setPayload] = useState<PaymentMethodPayload>();
  const braintreeDropinInstance = useRef<Dropin>();

  const initialiseDropInUI = async () => {
    braintreeDropinInstance.current = await window.braintree.dropin.create({
      authorization: authorization,
      container: "#dropin-container",
      paypal: {
        flow: "checkout",
        amount: 104.35,
        currency: "USD",
      },
    });
  };
  const submitForm = () => {
    if (!braintreeDropinInstance.current) {
      return null;
    }
    braintreeDropinInstance.current
      .requestPaymentMethod()
      .then((payload) => {
        console.log(payload);
        setPayload(payload);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div id="dropin-container" />
      <button
        type="button"
        className="bg-black text-white rounded-lg px-4 py-2 font-semibold"
        onClick={submitForm}
      >
        Continue
      </button>
      {paymentPayload ? (
        <>
          <h2>Received Payload</h2>
          <pre>{JSON.stringify(paymentPayload, null, 2)}</pre>
        </>
      ) : null}
      <Script
        src="https://js.braintreegateway.com/web/dropin/1.43.0/js/dropin.min.js"
        onReady={() => void initialiseDropInUI()}
      />
    </>
  );
};

export default BraiTreeDropinUI;
```

Usage:

- Obtain a `client token` or `tokenization key` as described [here](https://developer.paypal.com/braintree/docs/guides/authorization/overview#types-of-authorization)
- Pass that to `BraiTreeDropinUI` component

```jsx
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
```

### How to include Paypal custom Integration([Braintree Documentation](https://developer.paypal.com/braintree/docs/guides/paypal/overview/javascript/v3/))

Below is a sample React Componet named `PaypalCheckout` that can be used to integrated custom paypal

```jsx
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

```

**Usage:**
Obtain authorization token same way as for Dropin Ui and pass that to `PaypalCheckout` component:

```jsx
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
```

Link:

- braintree-web-drop-in: https://braintree.github.io/braintree-web-drop-in/docs/current/module-braintree-web-drop-in.html
- braintree-web: https://braintree.github.io/braintree-web/3.111.0/PayPalCheckout.html
