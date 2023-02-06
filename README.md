# Playwright_NodeJS_API
High-performance, high-concurrency Express endpoint for web scraping using Playwright and NodeJS

This repository contains a high-performance, high-concurrency Express JS endpoint for web scraping using Playwright and NodeJS. The endpoint provides an API for interacting with Playwright and allows developers to automate web browsers in a scalable, efficient manner.

## Features
- Built with Express JS, a modern, fast, web framework for building APIs with NodeJS
- Optimized for high performance and high concurrency using asynchronous programming
- Easy to extend and customize to meet specific requirements
- Redis cache supported
- Ready to deploy in cloud

## Prerequisites
- NodeJS
- Playwright-extra & Puppeteer-extra-plugin-stealth
- Redis

## Getting Started
1. Clone the repository:
2. Navigate to the project directory:
3. Install the required dependencies:
4. Run the endpoint:
5. Test the endpoint using your preferred method, such as Postman or cURL.

## Usage 
```javascript
const axios = require('axios')

// Make request
axios.get('https://jsonplaceholder.typicode.com/posts/1')

// Show response data
.then(res => console.log(res.data))
.catch(err => console.log(err))

```

## Contributions
Contributions are welcome! If you have an idea for a new feature or find a bug, please open an issue or submit a pull request.


