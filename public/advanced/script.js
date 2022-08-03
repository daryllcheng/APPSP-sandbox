import { 
  initializeAfterpay,
  createCustomButton,
  createCashTagElement,
  createCheckout,
  sanitizeUrl,
  getQueryParams,
  loadAfterpayJS,
  initializeModalPopup
} from '../utils.js'

// This code should be added to the page the customer is redirected to 
// after completing the QR code/authentication with the Cash App.
// This can be the same page the button is shown (e.g. merchant.com/checkout) 
// Or a new page (e.g merchant.com/review)
// The redirect url is set in the create checkout call
// "redirectConfirmUrl"
function initializeCashAppPayListeners() {
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

  AfterPay.initializeCashAppPayListeners({countryCode: "US", cashAppPayListenerOptions});
}

// Initialize the CashAppPay flow
// This can be by itself or within the onBegin callback from renderCashAppPayButton 
function initializeForCashAppPay(token) {
  var cashAppPayOptions = {
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

  AfterPay.initializeForCashAppPay({
    countryCode: "US",
    token,
    cashAppPayOptions
  });
}

// Load PayKit and render the CashAppPayButton without making any additional API calls. Token from createCheckout is not required.
function renderCashAppPayButton() {  
  var cashAppPayButtonOptions = {
    button: false,
    manage: false,
    onBegin: function({ begin }) {
      addEventListenerToCashAppPayButton(async (event) => {
        event.preventDefault();
        const token = await createCheckout(true);
        initializeForCashAppPay(token);
        begin();
      });
    },
  }
  //This allows you to render the button without a token
  AfterPay.renderCashAppPayButton({
    countryCode: "US",
    cashAppPayButtonOptions
  });
}

function addEventListenerToCashAppPayButton(func) {
  const customButton = document.querySelector('.cash-app-pay-custom-button')
  customButton.addEventListener('click', func);
}

window.onload = loadAfterpayJS(async () => {
    createCustomButton();
    createCashTagElement();
    initializeCashAppPayListeners(); // Only for the redirected page.
    initializeAfterpay(); // call to initialize the Afterpay flow
    renderCashAppPayButton(); 
    initializeModalPopup();
});