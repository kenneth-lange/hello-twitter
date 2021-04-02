# Hello Twitter 👋
A minimalistic, opinionated Twitter search API, written in TypeScript.

The purpose of this API is to make it fast and super easy to get access to Twitter data, so you don't have to waste time on plumbing and infrastructure, but can instead invest your time in data analysis and other higher-value tasks.

## Get started

### Step 1: Create a Twitter Developer Account
You need a Twitter Developer account to get started. If you don't already have one, you can create one [here](https://developer.twitter.com/en/apply-for-access).

Once you have a Twitter Developer Account, create a new app and go to the **Keys and tokens** tab and make a note of the values in **API key** and **API Secret Key** as you will need them soon 📝

### Step 2: Install the NPM package

```console
npm install hello-twitter
```

### Step 3: Start coding
Here's a simple hello world program to get you started. You'll need the **API Key** and **API Secret** from Step 1:

```javascript
import HelloTwitter from 'hello-twitter';

const twitter = new HelloTwitter({
    apiKey: '<YOUR-TWITTER-API-KEY>',
    apiSecret: '<YOUR-TWITTER-API-SECRET>'
});

twitter.fetchTweets({ query: 'Hello world' }).then(tweets => console.log(tweets));
```

The collection of tweets returned is fully typed and documented (in TSDoc), so it should be easy to continue from here simply by using your IDE's autocomplete and intellisense.

## Code examples

### Example 1: What's happening in California?

```javascript
// Let's check out what they're writing about California
const tweets = await twitter.fetchTweets({ query: 'California' });
tweets.forEach(tweet => {
    console.log(`${tweet.author.name} tweeted: "${tweet.text}"`);
});
```

### Example 2: What is Paul Graham tweeting?

```javascript
// Get the latest original tweets (no replies or retweets) from Paul Graham:
const tweets = await twitter.fetchTimeline({ username: 'paulg' });
tweets.filter(tweet => !tweet.isReply && !tweet.isRetweet).forEach(tweet => {
    console.log(`"${tweet.text}" (${tweet.likes} likes)`);
});
```

### Example 3: The Top 5 most popular tweets about #TypeScript

```javascript
// Get a Top 5 of the most popular tweets tagged with #TypeScript:
const tweets = await twitter.fetchTweets({ query: '#TypeScript' });
tweets.sort((a, b) => b.likes - a.likes);
tweets.slice(0, 4).forEach((tweet, index) => {
    console.log(`${index+1}: "${tweet.text}" by ${tweet.author.name} (${tweet.likes} likes)`);
});
```







