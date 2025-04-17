# Spindle: Mindful Spending Assistant

Spindle is a Chrome extension and mobile plugin designed to help users avoid impulsive online purchases by applying psychological friction before completing transactions.

## Features

- **Purchase Interruption**: Detects checkout pages and overlays a modal when users attempt to make a purchase
- **Reflection Timer**: Enforces a 10-second pause before allowing the purchase to continue 
- **Mindful Spending**: Requires users to articulate why they're making this purchase right now
- **Savings Redirection**: Option to save the money instead of completing the purchase
- **Analytics Dashboard**: Tracks impulse purchases stopped and money saved
- **Behavioral Insights**: Analyzes spending patterns and provides personalized tips

## How It Works

1. **Detect Purchase Intent**: The extension identifies when a user is about to complete a purchase
2. **Activate Impulse Vault**: A modal appears, blocking the purchase button 
3. **Enforced Reflection**: Users must wait 10 seconds and explain their purchase motivation
4. **Decision Support**: After reflection, users can proceed with the purchase or save the money
5. **Track Progress**: All decisions are recorded to help users visualize their spending habits

## Technology

This application is built with:
- React with TypeScript
- TailwindCSS for styling
- Chrome Extension APIs
- LocalStorage and Chrome Storage for data persistence

## Installation

### Chrome Extension Installation (For Developers)

1. Clone this repository to your local machine
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode" in the top right corner
6. Click "Load unpacked" and select the `dist` directory from this project
7. The Spindle extension should now be installed in your browser

### Supported Marketplaces

Spindle works on many popular e-commerce sites including:
- Amazon
- eBay
- Walmart
- Etsy
- And many more!

The extension automatically detects product information and buy buttons on supported sites.

## Next Steps

Future enhancements planned for Spindle include:
- Chrome Web Store extension packaging
- Mobile app version using React Native
- Cloud synchronization across devices
- Integration with banking APIs for direct savings transfers
- Machine learning to better predict and prevent impulsive spending

## Business Model

Spindle follows a freemium model:
- **Free tier**: Basic impulse control features
- **Premium tier**: Advanced analytics, AI-powered insights, and automatic savings ($99/month)
- **Enterprise**: B2B offering for banks and financial institutions

## About

Spindle was created based on behavioral economics research showing that introducing even small friction points in the purchasing process can significantly reduce impulsive spending.
