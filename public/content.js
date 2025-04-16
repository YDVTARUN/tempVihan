
// Marketplace configurations
const marketplaceConfigs = [
  {
    domain: "amazon.com",
    selectors: {
      productName: "#productTitle",
      price: ".a-price .a-offscreen",
      buyButton: "#buy-now-button, #submit.a-button-input"
    }
  },
  {
    domain: "ebay.com",
    selectors: {
      productName: ".x-item-title__mainTitle",
      price: ".x-price-primary .x-bin-price__content",
      buyButton: ".x-bin-action__btn"
    }
  },
  {
    domain: "walmart.com",
    selectors: {
      productName: "[data-testid='product-title']",
      price: "[data-testid='price-wrap'] .w_Cs",
      buyButton: "[data-testid='add-to-cart-btn'], [data-testid='buy-now-btn']"
    }
  },
  {
    domain: "etsy.com",
    selectors: {
      productName: ".wt-text-body-01",
      price: ".wt-text-title-03",
      buyButton: ".add-to-cart-form button"
    }
  },
  // Add more marketplaces as needed
];

// Determine if we're on a supported marketplace
function getCurrentMarketplace() {
  const hostname = window.location.hostname;
  return marketplaceConfigs.find(config => hostname.includes(config.domain));
}

// Extract product information
function extractProductInfo(config) {
  const productNameElement = document.querySelector(config.selectors.productName);
  const priceElement = document.querySelector(config.selectors.price);
  
  if (!productNameElement || !priceElement) return null;
  
  const productName = productNameElement.textContent.trim();
  // Extract numeric price from text
  const priceText = priceElement.textContent.trim();
  const priceMatch = priceText.match(/(\\$|£|€|₹)?([0-9,.]+)/);
  const price = priceMatch ? parseFloat(priceMatch[2].replace(/,/g, '')) : 0;
  
  return {
    productName,
    price,
    website: window.location.hostname
  };
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
  });
  
  // Save money instead
  saveButton.addEventListener('click', () => {
    // Record the save decision
    savePurchaseDecision(productInfo, reasonInput.value, false);
    modal.remove();
    
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
  
  // Get existing records
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
  });
}

// Generate UUID for record IDs
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Intercept buy button clicks
function interceptBuyButtons(config) {
  const buyButtons = document.querySelectorAll(config.selectors.buyButton);
  
  buyButtons.forEach(button => {
    // Remove any previous listeners
    button.removeEventListener('click', handleBuyButtonClick);
    
    // Add new listener
    button.addEventListener('click', handleBuyButtonClick);
  });
  
  function handleBuyButtonClick(event) {
    chrome.storage.local.get(['extensionEnabled'], function(data) {
      const isEnabled = data.extensionEnabled !== undefined ? data.extensionEnabled : true;
      
      if (isEnabled) {
        event.preventDefault();
        event.stopPropagation();
        
        const productInfo = extractProductInfo(config);
        if (productInfo) {
          createImpulseModal(productInfo);
        }
      }
      // If disabled, let the normal click go through
    });
  }
}

// Initialize when page is loaded
function initImpulseLock() {
  const currentMarketplace = getCurrentMarketplace();
  
  if (currentMarketplace) {
    console.log('ImpulseLock: Detected marketplace:', currentMarketplace.domain);
    
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
  }
}

// Wait for page to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initImpulseLock);
} else {
  initImpulseLock();
}
