import { Dropin, PaymentMethodPayload } from "braintree-web-drop-in";
import Script from "next/script";
import { useState, useRef } from "react";

export type HostedFieldProps = {
  authorization: string;
};

const HostedField = (props: HostedFieldProps) => {
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
  return (
    <>
      <Script
        src="https://js.braintreegateway.com/web/dropin/1.43.0/js/dropin.min.js"
        onReady={() => void initialiseDropInUI()}
      />
    </>
  );
};

export default HostedField;
