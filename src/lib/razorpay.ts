export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateCheckout = async (planId: string, onSuccess: () => void) => {
  const res = await loadRazorpayScript();
  
  if (!res) {
    alert('Razorpay SDK failed to load');
    return;
  }

  // MOCK: In production, backend should generate an order ID.
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'mock_key',
    amount: planId === 'plan_wordmess_plus' ? 9900 : 4900,
    currency: 'INR',
    name: 'WORDMESS',
    description: `Subscription for ${planId}`,
    handler: function (response: any) {
      console.log('Payment success', response);
      // MOCK: Verify signature on backend
      onSuccess();
    },
    prefill: {
      name: 'Player',
      email: 'player@example.com',
    },
    theme: {
      color: '#3B6D11'
    }
  };

  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();
};
