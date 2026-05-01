/**
 * Razorpay Payment Integration Utility
 * Handles Razorpay payment initialization and verification
 */

let razorpayLoaded = false;

const isProbablyWebView = () => {
  try {
    const ua = String(navigator?.userAgent || "");
    // Common WebView indicators:
    // - Android WebView: "; wv" or "Version/x.x" without Chrome brand
    // - iOS WebView: AppleWebKit but missing Safari
    const isAndroid = /Android/i.test(ua);
    const isChrome = /Chrome/i.test(ua);
    const hasWv = /\bwv\b/i.test(ua);
    const hasVersion = /Version\/\d+/i.test(ua);
    const hasSafari = /Safari/i.test(ua);
    const isIOSWebView = /iPhone|iPad|iPod/i.test(ua) && !hasSafari;
    
    // Improved detection: Android WebView usually has 'wv' or 'Version/x.x' WITHOUT 'Chrome' brand being the primary browser
    return (isAndroid && (hasWv || (hasVersion && !isChrome))) || isIOSWebView;

  } catch {
    return false;
  }
};

/**
 * Load Razorpay checkout script
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (razorpayLoaded) {
      resolve();
      return;
    }

    if (window.Razorpay) {
      razorpayLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      razorpayLoaded = true;
      resolve();
    };
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay script'));
    };
    document.body.appendChild(script);
  });
};

/**
 * Initialize Razorpay payment
 * @param {Object} options - Payment options
 * @param {String} options.key - Razorpay key ID
 * @param {String} options.amount - Amount in paise
 * @param {String} options.currency - Currency code
 * @param {String} options.order_id - Razorpay order ID
 * @param {String} options.name - Company/App name
 * @param {String} options.description - Payment description
 * @param {String} options.prefill.name - Customer name
 * @param {String} options.prefill.email - Customer email
 * @param {String} options.prefill.contact - Customer phone
 * @param {Object} options.notes - Additional notes
 * @param {Function} options.handler - Success callback
 * @param {Function} options.onError - Error callback
 * @param {Function} options.onClose - Close callback
 */
export const initRazorpayPayment = async (options) => {
  try {
    // Load Razorpay script if not already loaded
    await loadRazorpayScript();

    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not available');
    }

    console.log('Initializing Razorpay with Key:', options.key?.substring(0, 8) + '...');

    const razorpayOptions = {
      key: options.key,
      amount: options.amount,
      currency: options.currency || 'INR',
      order_id: options.order_id,
      name: options.name || 'Ananya Hotel',
      description: options.description || 'Payment',
      image: options.image || '/logo.png',
      
      // REQUIREMENT: Explicitly enable upi and other methods as requested
      method: {
        upi: true,
        vpa: true,
        card: true,
        netbanking: true,
        wallet: true,
        emi: true,
        paylater: true,
      },

      // REQUIREMENT: Allow redirect/deep-link for UPI intent apps
      redirect: true,

      // REQUIREMENT: Enable UPI Intent inside Android WebView
      webview_intent: isProbablyWebView(),

      prefill: {
        name: options.prefill?.name || '',
        email: options.prefill?.email || '',
        contact: options.prefill?.contact || ''
      },
      notes: options.notes || {},
      theme: {
        color: options.theme?.color || '#1E293B'
      },
      
      // REQUIREMENT: Match App A's config.display to prioritize UPI
      // Simplified to use the most common working format
      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay via UPI",
              instruments: [{ method: "upi" }],
            },
          },
          preferences: {
            show_default_blocks: true,
          },
        },
      },






      handler: function(response) {
        if (options.handler) {
          options.handler(response);
        }
      },
      modal: {
        ondismiss: function() {
          if (options.onClose) {
            options.onClose();
          }
        },
        escape: true,
        animation: true
      },
      retry: {
        enabled: true,
        max_count: 3
      }
    };

    // Allow overriding config if explicitly passed, but default to our optimized one
    if (options.config) {
      razorpayOptions.config = { ...razorpayOptions.config, ...options.config };
    }

    const razorpay = new window.Razorpay(razorpayOptions);
    
    // Handle payment failures
    razorpay.on('payment.failed', function(response) {
      console.error('Razorpay payment failed:', response);
      if (options.onError) {
        options.onError(response.error || { description: 'Payment failed. Please try again.' });
      }
    });

    // Open Razorpay modal
    razorpay.open();
    
    console.log('✅ Razorpay checkout opened successfully');
    return razorpay;
  } catch (error) {
    console.error('Error initializing Razorpay:', error);
    if (options.onError) {
      options.onError(error);
    }
    throw error;
  }
};

/**
 * Format amount for display
 * @param {Number} amount - Amount in paise
 * @returns {String} Formatted amount string
 */
export const formatAmount = (amount) => {
  return `₹${(amount / 100).toFixed(2)}`;
};
