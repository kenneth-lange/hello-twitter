# Hello Twitter 👋
A minimalistic, opinionated Twitter search API, written in TypeScript.

The purpose of this API is to make it fast and super easy to get access to Twitter data, so you don't have to waste time on plumbing and infrastructure, but can instead invest your time in data analysis and other higher-value tasks.

## Get started

### Step 1: Create a Twitter Developer Account
You need a Twitter Developer account to get started. If you don't already have one, you can create one [here](https://developer.twitter.com/en/apply-for-access).

Once you have a Twitter Developer Account, create a new app and go to the **Keys and tokens** tab and make a note of the values in **API key** and **API Secret Key** as you will need them soon 📝

### Step 2: Install the NPM package

***TBD.***

### Step 3: Start coding
Here's a simple hello world program to get you started. You'll need the **API Key** and **API Secret** from Step 1:

```javascript
import HelloTwitter from '../HelloTwitter';

const twitter = new HelloTwitter({
    apiKey: '<YOUR-TWITTER-API-KEY>',
    apiSecret: '<YOUR-TWITTER-API-SECRET>'
});

twitter.fetchTweets({ query: 'Hello world' }).then(tweets => console.log(tweets));
```

The collection of tweets returned is fully typed and documented (in TSDoc), so it should be easy to continue from here simply by using your IDE's autocomplete and intellisense.