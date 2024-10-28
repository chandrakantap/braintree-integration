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
