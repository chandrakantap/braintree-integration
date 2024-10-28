### Introduction

Braintree is global payment solutions to accept payment in website and mobile application. It is currently known as PayPal Braintree, acquired by PayPal in 2013.
This document containsFrontend integration steps.

### Involved Players

The Braintree payment consists of three players

- **Client**: Website, Mobile App etc. (e.g., autozone.com website)
- **Server**: Backend server of the implementing organization, not Braintree (e.g., autozone.com backend)
- **Braintree server**: Braintree services

### Account Setup

- We need both [Braintree sandbox](https://www.braintreepayments.com/sandbox) and paypal sandbox.
- Both should be configured using same country
- We need to [link Paypal sandbox to Braintree Sandbox](https://developer.paypal.com/braintree/articles/guides/payment-methods/paypal/setup-guide#enter-your-paypal-credentials-in-the-braintree-control-panel)
- In order to accept PayPal, we must use [Braintree Direct](https://developer.paypal.com/braintree/articles/guides/payment-methods/paypal/overview#availability)

### SDK

Braintree has SDK for both Client and Server

- [Client Javascript SDK](https://developer.paypal.com/braintree/docs/guides/client-sdk/setup/javascript/v3/)
- [Server SDK](https://developer.paypal.com/braintree/docs/start/hello-server/java#or-use-maven)

### Client SDK Authorization

Client SDKs require a form of authorization to interact with the Braintree gateway. Authorization done using a authorization token when create braintree client. We can obtain the token in two ways:

- **tokenization key**: A tokenization key can created in [Braintree Sandbox/Live Control Panel](https://sandbox.braintreegateway.com/merchants/s2x93ws328wvd2q6/users/y6ykj5tp4p79by4g/api_keys).
- **client token**: client token is a short-lived value that authorizes client sdk. Client token should be created using Braintree server sdk. The backend server must expose one api, say `/braintree/client-token`, which the client will call to retrieve a client token.

For example:

```java
private static BraintreeGateway gateway = new BraintreeGateway(
  Environment.SANDBOX,
  "your_merchant_id",
  "your_public_key",
  "your_private_key"
);

get(new Route("/braintree/client_token") {
  @Override
  public Object handle(Request request, Response response) {
    return gateway.clientToken().generate();
  }
});
```

**When to use tokenization key when to use client token**

We can refer to this [capability matrix](https://developer.paypal.com/braintree/docs/guides/authorization/overview#capabilities) to decided which one to use.

For our case, I suggest, we should go with **client token** because of below features:

- Option to implement [3d secure](https://developer.paypal.com/braintree/docs/guides/3d-secure/overview) features
- Option to use [Checkout with vault](https://developer.paypal.com/braintree/docs/guides/paypal/checkout-with-vault/javascript/v3/) feature for better UX for returning customers.

### Payment Execution Sequence

![Payment Sequence](/docimages/payment_sequence.png)

- **[1 and 2]**: This steps is required to obtain a client token from server as described above.If We are using **tokenization key** for client authorisation the these step not required.
- **3**: In this step Client collects the payment infromation using the client SDK. The payment information look like below for paypal:

```json
{
  "nonce": "815d9a20-2cdf-1d02-410a-63594e144b0e",
  "details": {
    "email": "tricia.voyles@autozone.com",
    "firstName": "Tricia",
    "lastName": "Voyles",
    "payerId": "9A2TAWRMKPSG2",
    "countryCode": "US",
    "billingAddress": {
      "countryCode": "US"
    },
    "shippingAddress": {}
  },
  "type": "PayPalAccount"
}
```

- **4**: Client send the payment information to server
- **5**: Server receives the payment method nonce and then uses the server SDK to [create a transaction](https://developer.paypal.com/braintree/docs/guides/transactions/java).

### Add Braintree to UI

Braintree can be integrated using multiple ways

#### 1. [Add using DropinUI](https://developer.paypal.com/braintree/docs/guides/drop-in/overview/javascript/v3/)

Drop-in UI is a complete, ready-made payment UI that offers a quick and easy way to securely accept payments. The UI includes a card entry form and, if enabled, **PayPal, Venmo, Apple Pay, and Google Pay buttons**.

It has below features:

- Render Complete Payment Form automatically
- Supports localization
- Has built in validation.
- UI adapts to the site width and is responsive
- It collects payment data in popup when required. So autozone site will always be visibile to customer.

##### Dropin UI card

![dropin_cardui.png](/docimages/dropin_cardui.png)

##### Dropin UI builtin validation

![dropin_cardui.png](/docimages/builtin_validation.png)

##### Dropin Paypal UI

![dropin_cardui.png](/docimages/dropin_paypalui.png)

##### Dropin Paypal selected

![dropin_cardui.png](/docimages/dropin_paypal_selected_ui.png)

#### 1. [Add using Paypal Buttons](https://developer.paypal.com/braintree/docs/guides/paypal/checkout-with-vault/javascript/v3/)

In this integration it will render single Paywith Pay button by braintree SDK. On Click of that Paypal payment flow popup will open and client will receive payment information which needs to be sent to server for creating transaction. We can customize **label, color and shape**

|                                                          |                                                   |
| -------------------------------------------------------- | ------------------------------------------------- |
| ![paypal_black.png](/docimages/paypal_black.png)         | ![paypal_blue.png](/docimages/paypal_blue.png)    |
| ![paypal_blue_pill.png](/docimages/paypal_blue_pill.png) | ![paypal_gold.png](/docimages/paypal_gold.png)    |
| ![paypal_white.png](/docimages/paypal_white.png)         | ![paypal_black.png](/docimages/paypal_silver.png) |
