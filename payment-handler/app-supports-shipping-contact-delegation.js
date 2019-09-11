self.addEventListener('canmakepayment', (event) => {
  event.respondWith(true);
});

async function responder(event) {
  const methodName = event.methodData[0].supportedMethods;
  var shippingOption = 'invalidOption';
  if(event.paymentOptions.requestShipping) {
    shippingOption ='freeShippingOption';
  }
  return {methodName, details: {}, shippingOption};
}

self.addEventListener('paymentrequest', (event) => {
  event.respondWith(responder(event));
});
