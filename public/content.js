
// Marketplace configurations
const marketplaceConfigs = [
  {
    domain: "amazon",
    selectors: {
      productName: "#productTitle, .a-size-large.product-title-word-break",
      price: ".a-price .a-offscreen, .a-price-whole, .a-offscreen",
      buyButton: "#buy-now-button, #submit.a-button-input, .a-button-input[name='submit.buy-now'], input[name='submit.buy-now']"
    }
  },
  {
    domain: "flipkart",
    selectors: {
      productName: ".B_NuCI, ._30jeq3, .G6XhRU",
      price: "._30jeq3._16Jk6d, ._30jeq3, .dyC4hf",
      buyButton: "._2KpZ6l._2U9uOA._3v1-ww, ._2KpZ6l, button._2KpZ6l, ._2KpZ6l._2U9uOA.ihZ75k"
    }
  },
  {
    domain: "ebay.com",
    selectors: {
      productName: ".x-item-title__mainTitle, .ux-textspans--BOLD",
      price: ".x-price-primary .x-bin-price__content, .x-price-primary span",
      buyButton: ".x-bin-action__btn, .btn.btn-prim, input[value='Buy It Now']"
    }
  },
  {
    domain: "walmart.com",
    selectors: {
      productName: "[data-testid='product-title'], .f3, .w_a9, .prod-ProductTitle",
      price: "[data-testid='price-wrap'] .w_Cs, .f4.f3-m, span.w_hLcU",
      buyButton: "[data-testid='add-to-cart-btn'], [data-testid='buy-now-btn'], button.button--primary"
    }
  },
  {
    domain: "etsy.com",
    selectors: {
      productName: ".wt-text-body-01, .wt-text-heading",
      price: ".wt-text-title-03, .wt-text-title-01",
      buyButton: ".add-to-cart-form button, .wt-btn--filled, form button[type='submit']"
    }
  },
  // Add more marketplaces as needed
];

// Debug function - sends logs to background script and debug page
function debug(message) {
  console.log(`ImpulseLock: ${message}`);
  
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.sendMessage({
      action: 'logInfo',
      message: message
    });
  }
}

// Determine if we're on a supported marketplace
function getCurrentMarketplace() {
  const hostname = window.location.hostname;
  debug(`Current hostname: ${hostname}`);
  
  const marketplace = marketplaceConfigs.find(config => hostname.includes(config.domain));
  
  if (marketplace) {
    debug(`Marketplace detected: ${marketplace.domain}`);
  } else {
    debug("No matching marketplace configuration found");
  }
  
  return marketplace;
}

// Extract product information
function extractProductInfo(config) {
  debug(`Attempting to extract product info with selectors: ${JSON.stringify(config.selectors)}`);
  
  // Try different selectors for product name and price
  const productNameElement = document.querySelector(config.selectors.productName);
  const priceElement = document.querySelector(config.selectors.price);
  
  if (!productNameElement) {
    debug("Could not find product name element");
    debug(`Looked for: ${config.selectors.productName}`);
    debug(`Current page title: ${document.title}`);
  }
  
  if (!priceElement) {
    debug("Could not find price element");
    debug(`Looked for: ${config.selectors.price}`);
  }
  
  if (!productNameElement && !priceElement) {
    // If we can't find either product name or price, try to use page title and a default price
    const pageTitle = document.title.split('|')[0].trim();
    debug(`Using page title instead: ${pageTitle}`);
    
    return {
      productName: pageTitle || "Unknown Product",
      price: 99.99, // Default placeholder price
      website: window.location.hostname
    };
  }
  
  const productName = productNameElement ? productNameElement.textContent.trim() : document.title.split('|')[0].trim();
  
  // Extract numeric price from text
  let price = 99.99; // Default price if extraction fails
  
  if (priceElement) {
    const priceText = priceElement.textContent.trim();
    debug(`Found price text: ${priceText}`);
    
    // Handle different currency formats
    const priceMatch = priceText.match(/(\\$|£|€|₹|Rs\.)?([0-9,.]+)/);
    if (priceMatch) {
      price = parseFloat(priceMatch[2].replace(/,/g, ''));
      debug(`Extracted price: ${price}`);
    }
  }
  
  const productInfo = {
    productName,
    price,
    website: window.location.hostname
  };
  
  debug(`Extracted product info: ${JSON.stringify(productInfo)}`);
  return productInfo;
}

// Create and inject the ImpulseLock modal
function createImpulseModal(productInfo) {
  // Remove any existing modal
  const existingModal = document.getElementById('impulselock-modal');
  if (existingModal) existingModal.remove();
  
  // Create modal container
  const modal = document.createElement('div');
  modal.id = 'impulselock-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  `;
  
  // Modal content
  let timeLeft = 10;
  modal.innerHTML = `
    <div style="background: white; width: 90%; max-width: 500px; border-radius: 12px; padding: 24px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 style="margin: 0; color: #7E69AB; font-size: 20px;">Impulse Vault</h2>
        <button id="close-modal" style="background: none; border: none; cursor: pointer; font-size: 20px;">×</button>
      </div>
      
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #666;">Product:</span>
          <span style="font-weight: 500;">${productInfo.productName}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #666;">Price:</span>
          <span style="font-weight: 500;">$${productInfo.price.toFixed(2)}</span>
        </div>
      </div>
      
      <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 24px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: #E5DEFF; display: flex; justify-content: center; align-items: center; margin-bottom: 16px;">
          <div style="font-size: 24px; font-weight: bold; color: #7E69AB;">
            <span id="timer">${timeLeft}</span>s
          </div>
        </div>
        
        <h3 id="timer-text" style="margin: 0; text-align: center; font-size: 16px;">
          ${timeLeft} seconds to think...
        </h3>
      </div>
      
      <div style="margin-bottom: 24px;">
        <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #555;">
          Why are you buying this right now?
        </label>
        <textarea id="reason-input" 
          style="width: 100%; min-height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"
          placeholder="I'm buying this because..."></textarea>
        <p id="char-count" style="margin: 4px 0 0; font-size: 12px; color: #888;">
          Please write at least 10 characters
        </p>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button id="continue-purchase" 
          style="background: #ccc; color: white; border: none; border-radius: 4px; padding: 12px; font-weight: 500; cursor: not-allowed;"
          disabled>
          Continue with Purchase
        </button>
        
        <button id="save-money" 
          style="background: white; color: #7E69AB; border: 1px solid #7E69AB; border-radius: 4px; padding: 12px; font-weight: 500; cursor: not-allowed;"
          disabled>
          Instead, I'll save $${productInfo.price.toFixed(2)}
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  debug("Modal created and appended to body");
  
  // Timer functionality
  const timerElement = document.getElementById('timer');
  const timerTextElement = document.getElementById('timer-text');
  const reasonInput = document.getElementById('reason-input');
  const charCount = document.getElementById('char-count');
  const continueButton = document.getElementById('continue-purchase');
  const saveButton = document.getElementById('save-money');
  
  // Close button
  document.getElementById('close-modal').addEventListener('click', () => {
    modal.remove();
    debug("Modal closed by user");
  });
  
  // Timer interval
  const timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerTextElement.textContent = "Now, explain your decision";
      checkUnlockConditions();
    }
  }, 1000);
  
  // Check if we should unlock buttons
  function checkUnlockConditions() {
    const reasonLength = reasonInput.value.trim().length;
    const timerDone = timeLeft <= 0;
    
    if (timerDone && reasonLength >= 10) {
      continueButton.disabled = false;
      saveButton.disabled = false;
      continueButton.style.background = '#7E69AB';
      continueButton.style.cursor = 'pointer';
      saveButton.style.cursor = 'pointer';
      debug("Buttons unlocked - user can now proceed");
    } else {
      continueButton.disabled = true;
      saveButton.disabled = true;
      continueButton.style.background = '#ccc';
      continueButton.style.cursor = 'not-allowed';
      saveButton.style.cursor = 'not-allowed';
    }
    
    // Update character count message
    if (reasonLength < 10) {
      charCount.textContent = `Please write at least 10 characters (${reasonLength}/10)`;
    } else {
      charCount.textContent = `✓ Requirement met`;
      charCount.style.color = '#4CAF50';
    }
  }
  
  // Watch for input changes
  reasonInput.addEventListener('input', checkUnlockConditions);
  
  // Continue with purchase
  continueButton.addEventListener('click', () => {
    // Record the purchase decision
    savePurchaseDecision(productInfo, reasonInput.value, true);
    modal.remove();
    debug("User chose to continue with purchase");
  });
  
  // Save money instead
  saveButton.addEventListener('click', () => {
    // Record the save decision
    savePurchaseDecision(productInfo, reasonInput.value, false);
    modal.remove();
    debug("User chose to save money instead");
    
    // Show confirmation message
    const savedMessage = document.createElement('div');
    savedMessage.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      z-index: 999999;
    `;
    savedMessage.textContent = `Great! You saved $${productInfo.price.toFixed(2)}`;
    document.body.appendChild(savedMessage);
    
    setTimeout(() => {
      savedMessage.remove();
    }, 5000);
  });
}

// Save the purchase decision to Chrome storage
function savePurchaseDecision(productInfo, reason, wasPurchased) {
  const record = {
    id: generateUUID(),
    date: new Date().toISOString(),
    productName: productInfo.productName,
    price: productInfo.price,
    reason: reason,
    wasPurchased: wasPurchased,
    wasSaved: !wasPurchased,
    website: productInfo.website
  };
  
  debug(`Saving purchase decision - Purchased: ${wasPurchased}`);
  
  // Get existing records
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['purchaseRecords', 'userStats'], function(data) {
      // Update purchase records
      const records = data.purchaseRecords || [];
      records.unshift(record);
      
      // Update stats if money was saved
      let stats = data.userStats || {
        totalImpulsesStopped: 0,
        totalMoneySaved: 0,
        weeklyImpulsesStopped: 0,
        weeklyMoneySaved: 0,
        monthlyImpulsesStopped: 0,
        monthlyMoneySaved: 0
      };
      
      if (!wasPurchased) {
        stats.totalImpulsesStopped += 1;
        stats.totalMoneySaved += productInfo.price;
        stats.weeklyImpulsesStopped += 1;
        stats.weeklyMoneySaved += productInfo.price;
        stats.monthlyImpulsesStopped += 1;
        stats.monthlyMoneySaved += productInfo.price;
      }
      
      // Save to storage
      chrome.storage.local.set({
        purchaseRecords: records,
        userStats: stats
      });
      
      debug("Purchase decision saved to storage");
    });
  } else {
    debug("Chrome storage not available, unable to save purchase decision");
  }
}

// Generate UUID for record IDs
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Intercept buy button clicks - IMPROVED VERSION
function interceptBuyButtons(config) {
  debug(`Looking for buy buttons with selector: ${config.selectors.buyButton}`);
  
  // Find all buy buttons
  const buyButtons = document.querySelectorAll(config.selectors.buyButton);
  debug(`Found ${buyButtons.length} buy buttons`);
  
  function handleBuyButtonClick(event) {
    debug("Buy button clicked!");
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['extensionEnabled'], function(data) {
        const isEnabled = data.extensionEnabled !== undefined ? data.extensionEnabled : true;
        debug(`Extension enabled: ${isEnabled}`);
        
        if (isEnabled) {
          // Stop the default action
          event.preventDefault();
          event.stopPropagation();
          
          // Extract product information
          const productInfo = extractProductInfo(config);
          if (productInfo) {
            createImpulseModal(productInfo);
          } else {
            debug("Could not extract product information");
          }
          
          return false;
        }
      });
    } else {
      debug("Chrome API not available, extension won't intercept");
    }
  }
  
  // Add event listeners to all found buy buttons
  buyButtons.forEach((button, index) => {
    debug(`Setting up button ${index}: ${button.outerHTML.substring(0, 50)}...`);
    
    // Remove existing event listeners to avoid duplicates
    button.removeEventListener('click', handleBuyButtonClick);
    
    // Add capture phase listener to catch the event before it propagates
    button.addEventListener('click', handleBuyButtonClick, true);
    
    // Also add regular bubble phase listener as a backup
    button.addEventListener('click', handleBuyButtonClick);
    
    // Add visual indicator that the button is being monitored (optional)
    button.style.position = 'relative';
    button.classList.add('impulselock-monitored');
    
    debug(`Added click listeners to button ${index}`);
  });
  
  // For forms that might contain buy buttons
  const forms = document.querySelectorAll('form');
  debug(`Found ${forms.length} forms that might contain buy buttons`);
  
  forms.forEach((form, index) => {
    // Check if the form might be a checkout form
    const formAction = form.getAttribute('action') || '';
    const formId = form.getAttribute('id') || '';
    const formClass = form.getAttribute('class') || '';
    
    const isCheckoutForm = 
      formAction.includes('checkout') || 
      formAction.includes('buy') || 
      formId.includes('buy') || 
      formClass.includes('buy') ||
      formAction.includes('add-to-cart');
    
    if (isCheckoutForm) {
      debug(`Form ${index} looks like a checkout form: ${formId || formAction}`);
      
      // Add listener to the form submit event
      form.addEventListener('submit', function(event) {
        debug(`Form ${index} submit intercepted`);
        
        if (typeof chrome !== 'undefined' && chrome.storage) {
          chrome.storage.local.get(['extensionEnabled'], function(data) {
            const isEnabled = data.extensionEnabled !== undefined ? data.extensionEnabled : true;
            
            if (isEnabled) {
              event.preventDefault();
              
              const productInfo = extractProductInfo(config);
              if (productInfo) {
                createImpulseModal(productInfo);
              }
            }
          });
        }
      }, true);
    }
  });
}

// Initialize when page is loaded
function initImpulseLock() {
  debug("Initializing extension");
  const currentMarketplace = getCurrentMarketplace();
  
  if (currentMarketplace) {
    debug(`Detected marketplace: ${currentMarketplace.domain}`);
    
    // Initial button interception
    interceptBuyButtons(currentMarketplace);
    
    // Watch for DOM changes to catch dynamically added buttons
    const observer = new MutationObserver(() => {
      interceptBuyButtons(currentMarketplace);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    debug("MutationObserver set up for dynamic content");
  } else {
    debug(`No supported marketplace detected on ${window.location.hostname}`);
  }
}

// Wait for page to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initImpulseLock);
  debug("Waiting for DOMContentLoaded");
} else {
  debug("Page already loaded, initializing now");
  initImpulseLock();
}

// Add additional initialization for pages that load content dynamically
window.addEventListener('load', function() {
  debug("Window load event fired, checking for buy buttons");
  setTimeout(initImpulseLock, 1000); // Re-initialize after a delay
});

// Add listeners for single-page apps that change content without a full page reload
window.addEventListener('popstate', function() {
  debug("URL changed, re-initializing");
  setTimeout(initImpulseLock, 500);
});

// Initial call to ensure it runs
setTimeout(initImpulseLock, 500);
