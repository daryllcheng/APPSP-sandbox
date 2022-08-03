import {
  initializeAfterpay,
  createCustomButton,
  createCashTagElement,
  createCheckout,
  sanitizeUrl,
  getQueryParams,
  loadAfterpayJS,
  initializeModalPopup,
  bindAttributesToButton,
  addEventListenerToCashAppPayButton,
} from '../utils.js'

function initializeCashAppPayListeners(afterpayButton) {
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
  afterpayButton.initializeCashAppPayListeners({ countryCode: "US", cashAppPayListenerOptions });
}
// Initialize the CashAppPay flow
// This can be by itself or within the onBegin callback from renderCashAppPayButton 
function initializeForCashAppPay(afterpayButton) {
  var cashAppPayOptions = {
    redirectConfirmUrl: 'https://appsp-sandbox.afterpay-test.repl.co/button',
    onError: function(event) {
      console.log(`onError: ${JSON.stringify(event.data, null, 4)}`);
    },
    onComplete: function(event) {
      console.log(`onComplete: ${JSON.stringify(event.data, null, 4)}`);
      var { cashtag } = event.data;
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

  afterpayButton.initializeForCashAppPay(cashAppPayOptions);
}

// Load PayKit and render the CashAppPayButton without making any additional API calls. Token from createCheckout is not required.
function renderCashAppPayButton(afterpayButton) {
  initializeCashAppPayListeners(afterpayButton); // Only for the redirected page.
  var cashAppPayButtonOptions = {
    button: false,
    manage: false,
    onBegin: function({ begin }) {
      addEventListenerToCashAppPayButton(async (event) => {
        event.preventDefault();
        bindAttributesToButton(afterpayButton);
        initializeForCashAppPay(afterpayButton);
        begin();
      });
    },
  }
  //This allows you to render the button without a token
  afterpayButton.renderCashAppPayButton({
    countryCode: "US",
    cashAppPayButtonOptions
  });
}

window.onload = loadAfterpayJS(async () => {
  createCustomButton();
  createCashTagElement();
  initializeAfterpay(); // call to initialize the Afterpay flow
  initializeModalPopup();
  const afterpayButtons = document.querySelectorAll('afterpay-button');
  afterpayButtons.forEach(afterpayButton => {
    afterpayButton.addEventListener('click', bindAttributesToButton(afterpayButton), true);
    afterpayButton.hasAttribute("isCashAppPay") && renderCashAppPayButton(afterpayButton);
  })
}, "https://afterpayus-integrations.s3.us-west-2.amazonaws.com/javascript/button/afterpay-button-nordstrom.js");