
// Exisitng Afterpay Popup Integration
export function initializeAfterpay() {
  document.getElementById("afterpay-button").addEventListener("click", async (event) => {
    event.preventDefault();
    const token = await createCheckout();
    AfterPay.initialize({
      countryCode: "US"
    });
    AfterPay.open();
    AfterPay.onComplete = function(event) {
      console.log(`cashTag: ${JSON.stringify(event.data, null, 4)}`);
    }

    AfterPay.transfer({ token });
  });
}

export function createCustomButton() {
  // Create custom button
  var cashAppPayCustomButton = document.createElement('button');
  cashAppPayCustomButton.classList.add('btn', 'cash-app-pay-custom-button');
  cashAppPayCustomButton.textContent = "Continue with";

  // Attach cash app pay logo to button
  var cashAppPayLogo = document.createElement('cash-app-pay-logo');
  cashAppPayCustomButton.appendChild(cashAppPayLogo);
  document.getElementById('cash-app-pay').after(cashAppPayCustomButton);
}

export function createCashTagElement() {
  // Create cashTag element
  var cashAppPayCustomer = document.createElement('cash-app-pay-customer');
  cashAppPayCustomer.setAttribute('hidden', true);
  document.getElementById('cash-app-pay').after(cashAppPayCustomer);
}

// Retrieve AP token
export async function createCheckout(isCashAppPay = false) {
  const apToken = getQueryParams().apToken || null;
  const redirectConfirmUrl = getQueryParams().redirectConfirmUrl || window.location.href;

  if (apToken) return apToken;

  const payload = {
    ...(isCashAppPay && { "isCashAppPay": isCashAppPay }),
    "amount": {
      "amount": "77.71",
      "currency": "USD"
    },
    "consumer": {
      "phoneNumber": "2120000000",
      "givenNames": "Joe",
      "surname": "Consumer",
      "email": "test@afterpay.com"
    },
    "billing": {
      "name": "Joe Consumer",
      "line1": "1004 Point Lobos Ave",
      "area1": "San Francisco",
      "region": "CA",
      "postcode": "94121",
      "countryCode": "US",
      "phoneNumber": "2120000000"
    },
    "shipping": {
      "name": "Joe Consumer",
      "line1": "1004 Point Lobos Ave",
      "area1": "San Francisco",
      "region": "CA",
      "postcode": "94121",
      "countryCode": "US",
      "phoneNumber": "2120000000"
    },
    "items": [
      {
        "name": "Blue Carabiner",
        "sku": "12341234",
        "quantity": 1,
        "pageUrl": "https://www.afterpay-merchant.com/carabiner-354193.html",
        "imageUrl": "https://img.afterpay-merchant.com/carabiner-7378-391453-1.jpg",
        "price": {
          "amount": "40.00",
          "currency": "USD"
        },
        "categories": [
          ["Sporting Goods", "Climbing Equipment", "Climbing", "Climbing Carabiners"],
          ["Discounts", "Climbing"]
        ]
      },
      {
        "name": "Jeans",
        "sku": "12341235",
        "quantity": 1,
        "pageUrl": "https://www.afterpay-merchant.com/jeans-354193.html",
        "imageUrl": "https://img.afterpay-merchant.com/jeans-7378-391453-1.jpg",
        "price": {
          "amount": "20.00",
          "currency": "USD"
        },
        "categories": [
          ["Sporting Goods", "Climbing Equipment", "Climbing", "Climbing Carabiners"],
          ["Discounts", "Climbing"]
        ]

      }
    ],
    "discounts": [
      {
        "displayName": "10% Off Subtotal",
        "amount": {
          "amount": "3.00",
          "currency": "USD"
        }
      }
    ],
    "merchant": {
      "redirectConfirmUrl": sanitizeUrl(redirectConfirmUrl),
      "redirectCancelUrl": "https://www.afterpay-merchant.com/cancel",
      "popupOriginUrl": "https://www.afterpay-merchant.com/cancel",
      "name": ""
    },
    "merchantReference": "merchant-order-number",
    "shippingAmount": {
      "amount": "10.00",
      "currency": "USD"
    }
  };

  const { data } = await axios.post('/create-checkout', payload);
  const { token } = data.response;
  return token;
}

export function bindAttributesToButton(afterpayButton) {
  // The merchant’s unique order id/reference that this payment corresponds to. This is used to reconcile orders in the Afterpay merchant portal.
  afterpayButton.merchantReference = "";
  //Money Object 
  // The total amount of the order to be charged to the consumer. This includes any shipping and tax, minus any discounts. This will be the maximum amount that you can charge to the virtual Visa Card.
  afterpayButton.amount = "77.71" // required 
  // The currency in ISO 4217 format. The value provided must correspond to the currency of the Merchant account making the request.
  afterpayButton.currency = "USD"; // required
  //Item Object
  afterpayButton.items = JSON.stringify([{
    "name": "name",
    "sku": "sku",
    "quantity": 1,
    "price": {
      "amount": "100.00",
      "currency": "USD"
    },
    "pageUrl": "some url",
    "imageUrl": "some url",
    "categories": [["item"]]
  }]);
  //Consumer Object 
  afterpayButton.shippingName = "shippingName";
  afterpayButton.consumerPhoneNumber = "0404040404";
  afterpayButton.consumerGivenNames = "consumerGivenNames";
  afterpayButton.consumerSurname = "consumerSurname";
  afterpayButton.consumerEmail = "test@gmail.com"; // required
  //Contact Object 
  afterpayButton.shippingLine1 = "shippingLine1";
  afterpayButton.shippingLine2 = "shippingLine2";
  afterpayButton.shippingArea1 = "shippingArea1";
  afterpayButton.shippingArea2 = "shippingArea2";
  afterpayButton.shippingRegion = "shippingRegion";
  afterpayButton.shippingPostcode = "shippingPostcode";
  afterpayButton.shippingCountryCode = "US";
  afterpayButton.shippingPhoneNumber = "phoneNumber";
  //Contact Object 
  afterpayButton.billingName = "billingName";
  afterpayButton.billingLine1 = "billingLine1";
  afterpayButton.billingLine2 = "billingLine2";
  afterpayButton.billingArea1 = "billingArea1";
  afterpayButton.billingArea2 = "billingArea2";
  afterpayButton.billingRegion = "billingRegion";
  afterpayButton.billingPostcode = "billingPostcode";
  afterpayButton.billingCountryCode = "US";
  afterpayButton.billingphoneNumber = "billingphoneNumber";

  // set the onError callback
  afterpayButton.onError = function(event) {
    const { errorCode, errorId, message, httpStatusCode } = event.data;
    console.table({ errorCode, errorId, message, httpStatusCode })
  };

  // set the onComplete callback
  // The virtual card needs to be authorized less than 60 minutes after the card is returned to the merchant.
  afterpayButton.onComplete = function(event) {
    const { status, token, authToken } = event.data;
    console.table({ status, token, authToken })
    // The consumer confirmed the payment schedule.
    // The virtualCard details can be inserted into your checkout
    if (status === 'SUCCESS') {
      if (event.data.virtualCard) {
        const { virtualCard } = event.data;
        console.table(virtualCard)
      } else if (event.data.virtualCardToken) {
        const { virtualCardToken } = event.data;
        const { paymentGateway, cardToken, expiryMonth, expiryYear } = virtualCardToken;
        console.table({ paymentGateway, cardToken, expiryMonth, expiryYear })
      }
    } else if (status === 'CANCELLED') console.log('Transaction was cancelled.'); // The consumer cancelled the payment or closed the popup window.
  };
}

/**
 * Sanitize a URL.
 *
 * Source @braintree/sanitize-url
 * <https://github.com/braintree/sanitize-url>
 *
 * @param {string} url
 * @return {string}
 */
export function sanitizeUrl(url) {
  if (!url) {
    return "about:blank";
  }

  var invalidProtocolRegex = /^(%20|\s)*(javascript|data|vbscript)/im;
  var ctrlCharactersRegex = /[^\x20-\x7EÀ-ž]/gim;
  var urlSchemeRegex = /^([^:]+):/gm;
  var relativeFirstCharacters = [".", "/"];

  function _isRelativeUrlWithoutProtocol(url) {
    return relativeFirstCharacters.indexOf(url[0]) > -1;
  }

  var sanitizedUrl = url.replace(ctrlCharactersRegex, "").trim();
  if (_isRelativeUrlWithoutProtocol(sanitizedUrl)) {
    return sanitizedUrl;
  }

  var urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);
  if (!urlSchemeParseResults) {
    return sanitizedUrl;
  }

  var urlScheme = urlSchemeParseResults[0];
  if (invalidProtocolRegex.test(urlScheme)) {
    return "about:blank";
  }

  return sanitizedUrl;
}

export function getQueryParams() {
  return new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
  });
}

export function loadAfterpayJS(fn, src = null) {
  const scriptTag = document.createElement('script');
  scriptTag.src = src ? src : getQueryParams().apScript || "https://portal.sandbox.afterpay.com/afterpay.js";

  scriptTag.onload = fn;
  scriptTag.onreadystatechange = fn;

  document.head.appendChild(scriptTag);
}

export function initializeModalPopup() {
  // Get the modal
  const modal = document.getElementById("myModal");

  // Get the button that opens the modal
  const btn = document.getElementById("redirectedPage");
  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
  }
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

export function initializeOptionalModalPopup() {
  const optionalModal = document.getElementById("optionalModal");
  const optionalModalButton = document.getElementById("optionalModalButton");
  const optionalModalClose = document.getElementById("optionalModalClose");

  optionalModalButton.onclick = function() {
    optionalModal.style.display = "block";
  }
  optionalModalClose.onclick = function() {
    optionalModal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == optionalModal) {
      optionalModal.style.display = "none";
    }
  }
}

export function addEventListenerToCashAppPayButton(func) {
  const customButton = document.querySelector('.cash-app-pay-custom-button')
  customButton.addEventListener('click', func);
}

// This code should be added to the page the customer is redirected to 
// after completing the QR code/authentication with the Cash App.
// This can be the same page the button is shown (e.g. merchant.com/checkout) 
// Or a new page (e.g merchant.com/review)
// The redirect url is set in the create checkout call
// "redirectConfirmUrl"
export function initializeCashAppPayListeners() {
  var cashAppPayListenerOptions = {
    onComplete: function(event) {
      console.log(`onComplete: ${JSON.stringify(event.data, null, 4)}`);
      var { cashtag } = event.data;
      window.alert(`Success: ${cashtag}`)
      document.querySelector('.cash-app-pay-custom-button').setAttribute('hidden', true); // hide the button
      var cashAppPayCustomer = document.querySelector('cash-app-pay-customer');
      cashAppPayCustomer.setAttribute('cashtag', cashtag);
      cashAppPayCustomer.removeAttribute('hidden'); // show the cashtag
    },
    /* Optional event listeners */
    eventListeners: {
      "CUSTOMER_INTERACTION": ({ isMobile }) => {
        console.log(`CUSTOMER_INTERACTION is on Mobile: ${isMobile}`)
      },
      "CUSTOMER_REQUEST_DECLINED": () => {
        console.log(`CUSTOMER_REQUEST_DECLINED`)
      },
      "CUSTOMER_REQUEST_APPROVED": () => {
        console.log(`CUSTOMER_REQUEST_APPROVED`)
      },
      "CUSTOMER_REQUEST_FAILED": () => {
        console.log(`CUSTOMER_REQUEST_FAILED`)
      }
    }
  }
  AfterPay.initializeCashAppPayListeners({ countryCode: "US", cashAppPayListenerOptions });
}