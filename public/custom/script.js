import { 
  createCheckout,
  sanitizeUrl,
  getQueryParams,
  initializeModalPopup,
  loadAfterpayJS,
  createCashTagElement,
} from '../utils.js'

let beginCashAppPay;
let destroyCashAppPay;

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
        if (document.querySelector('.cash-app-pay-custom-button')) {
          document.querySelector('.cash-app-pay-custom-button').setAttribute('hidden', true); // hide the button
          var cashAppPayCustomer = document.querySelector('cash-app-pay-customer');
          cashAppPayCustomer.setAttribute('cashtag', cashtag);
          cashAppPayCustomer.removeAttribute('hidden'); // show the cashtag
        }
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
      if (document.querySelector('.cash-app-pay-custom-button')) {
        document.querySelector('.cash-app-pay-custom-button').setAttribute('hidden', true); // hide the button
        var cashAppPayCustomer = document.querySelector('cash-app-pay-customer');
        cashAppPayCustomer.setAttribute('cashtag', cashtag);
        cashAppPayCustomer.removeAttribute('hidden'); // show the cashtag
      }
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
  destroyCashAppPay && destroyCashAppPay();
  var cashAppPayButtonOptions = {
    button: false,
    manage: false,
    onBegin: function({ begin, destroy }) {
      beginCashAppPay = begin; // store begin for subsequent calls
      destroyCashAppPay = destroy;
      createCashAppPayCustomButton(); 
    },
  }
  //This allows you to render the button without a token
  AfterPay.renderCashAppPayButton({
    countryCode: "US",
    cashAppPayButtonOptions
  });
}

// Simulate the thredup checkout flow when the cash app pay button is clicked
function placeOrderWithCashAppPay() {
  createCashAppPayText(); // Remove button and replace with text
  createPlaceOrderButton(() => { // Create the place-order button with a callback that adds an event listener
    document.querySelector('.place-order').addEventListener('click', async() => {
      beginCashAppPay();
    });
  });
}

// Simulate an alternative payment option on the checkout page
function initializeAfterpay() {
  document.getElementById("afterpay-button").addEventListener("click", async (event) => {
    event.preventDefault();
    const token = await createCheckout(); 
    AfterPay.initialize({
      countryCode: "US"
    });
    AfterPay.open();
    AfterPay.onComplete = function(event) {
      console.log(`Afterpay Checkout: ${JSON.stringify(event.data, null, 4)}`);
      createPlaceOrderButton(() => { // Create the place-order button with a callback that adds an event listener
        document.querySelector('.place-order').addEventListener('click', (event) => {
          event.preventDefault();
          alert('Afterpay Checkout')
        });
      });
      createCashAppPayCustomButton();
    }

    AfterPay.transfer({ token });
  });
}

 document.getElementById("update-amount").addEventListener("click", (event) => {
   updateAmount();
 })
async function updateAmount() {
  console.log('here')
  const amount = document.getElementById('amount').value || '77.17';
  const token = await createCheckout(true, amount); 
  initializeForCashAppPay(token)
}

// Simulate the removal & recreation of the place-order button when payment methods are changed
function createPlaceOrderButton(cb) {
  let placeOrderButton = document.querySelector('.place-order');
  placeOrderButton && placeOrderButton.remove();
  placeOrderButton = document.createElement('button');
  placeOrderButton.classList.add('btn', 'place-order');
  placeOrderButton.textContent = "PLACE ORDER & ADD TO BUNDLE";
  document.getElementById('content').appendChild(placeOrderButton);
  cb && cb();
}

// Simulate the creation of the cash app pay button 
function createCashAppPayCustomButton() {
  document.querySelector('.cashAppPayText') && document.querySelector('.cashAppPayText').remove();

  if (!document.querySelector('.cash-app-pay-custom-button')) {
    const cashAppPayCustomButton = document.createElement('button');
    cashAppPayCustomButton.classList.add('btn', 'cash-app-pay-custom-button');
    cashAppPayCustomButton.textContent = "Continue with";
    cashAppPayCustomButton.addEventListener('click', () => { placeOrderWithCashAppPay() });
    
    const cashAppPayLogo = document.createElement('cash-app-pay-logo');
    cashAppPayCustomButton.appendChild(cashAppPayLogo);
    document.getElementById('cash-app-pay').after(cashAppPayCustomButton);
  }
}

// Simulate the replacement of the cash app pay button with the text element
function createCashAppPayText() {
  document.querySelector('.cash-app-pay-custom-button').remove();

  const cashAppPayText = document.createElement('div');
  cashAppPayText.classList.add('cashAppPayText');
  cashAppPayText.style.textAlign = "center";
  cashAppPayText.textContent = "You will be redirected to ";
  
  const cashAppPayLogo = document.createElement('cash-app-pay-logo');
  cashAppPayText.appendChild(cashAppPayLogo);
  document.getElementById('cash-app-pay').after(cashAppPayText);
}

async function initCashApp() {
    createCashTagElement();
    initializeCashAppPayListeners();
    renderCashAppPayButton(); // call to render the button
          const token = await createCheckout(true);
      initializeForCashAppPay(token);
    initializeAfterpay(); // call to initialize the Afterpay flow
  }
  
window.onload = loadAfterpayJS(async () => {
  // initCashApp();
  initializeModalPopup();

  document.getElementById("something-else").addEventListener("click", (event) => {
    const content = document.getElementById('content');
    content.innerHTML = ''; // remove content
  
    const somethingElseContent = document.createElement('div');
    somethingElseContent.innerText = 'Something else'
    content.appendChild(somethingElseContent);
  });

  document.getElementById("cash-app-click").addEventListener("click", (event) => {
    const content = document.getElementById('content');
    content.innerHTML = ''; // remove content
  
    const placeOrderTarget = document.createElement('div');
    placeOrderTarget.setAttribute('id', 'place-order-target');
    content.appendChild(placeOrderTarget);
  
    const cashAppPay = document.createElement('div');
    cashAppPay.setAttribute('id', 'cash-app-pay')
    content.appendChild(cashAppPay);
  
    const buttonAfterpay = document.createElement('button');
    buttonAfterpay.setAttribute('id', 'afterpay-button');
    buttonAfterpay.classList = 'btn';
    buttonAfterpay.innerText = 'Pay Now with Afterpay!'
    content.appendChild(buttonAfterpay);
  
    initCashApp();
  });
});
