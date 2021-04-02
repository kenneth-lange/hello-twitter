# Hello Twitter 👋
A minimalistic, opinionated Twitter Query API, written in TypeScript.

The purpose of this API is to make it fast and super easy to query Twitter data, without needing to waste time on writing plumbing code, so we instead can invest our time in data analysis and other higher-value tasks.

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
The most basic example is simply to execute a Twitter query, just like you would in the Twitter App, and then list the results.

```javascript
// Let's check out what they're writing about California
const tweets = await twitter.fetchTweets({ query: 'California' });
tweets.forEach(tweet => {
    console.log(`${tweet.author.name} tweeted: "${tweet.text}"`);
});
```

### Example 2: What is Paul Graham tweeting?
So you wanna see what a specific user is weeting, but you don't want to see their retweets or replies. You can easily use JavaScript `filter` to remove unneeded tweets.

```javascript
// Get the latest original tweets (no replies or retweets) from Paul Graham:
const tweets = await twitter.fetchTimeline({ username: 'paulg' });
tweets.filter(tweet => !tweet.isReply && !tweet.isRetweet).forEach(tweet => {
    console.log(`"${tweet.text}" (${tweet.likes} likes)`);
});
```

### Example 3: What are the Top 5 most popular tweets about #TypeScript?
The list of tweets returned by `HelloTwitter` is easy to manipulated with JavaScript's built-in list functions, such as `filter`, `sort`, `slice`, `map`, and `reduce`.

```javascript
// Get a Top 5 of the most popular tweets tagged with #TypeScript:
const tweets = await twitter.fetchTweets({ query: '#TypeScript' });
tweets.sort((a, b) => b.likes - a.likes);
tweets.slice(0, 4).forEach((tweet, index) => {
    console.log(`${index+1}: "${tweet.text}" by ${tweet.author.name} (${tweet.likes} likes)`);
});
```

### Example 4: What are they tweeting at Stanford?
We can use the geo search to find tweets posted at a specific geographical location.

For Stanford, the latitude is 37.424107 and the longitude is -122.166077.

```javascript
const tweets = await twitter.fetchTweets({
    location: {
        latitude: 37.424107,
        longitude: -122.166077
    }
});

tweets.forEach(tweet => {
    console.log(`${tweet.author.name} tweeted: "${tweet.text}"`);
});
```

You can easily tinker with the example so it only shows tweets with photos (hint: `tweet.entities.media.length > 0`) or sort them by popularity (hint: `tweet.likes`).
  
## Tips and Tricks
Small helpful tips and tricks when you are tinkering with Twitter data. Some of the tips are specific to `hello-twitter` and others are general. 

### Deep Link to a Tweet
Sometimes you want to deep link to a tweet on Twitter, so you can engage with the tweet on Twitter's platform.

A deep link to a tweet follows this pattern: `https://twitter.com/<username>/status/<tweet-id>`.

So with `HelloTwitter` we can create the deep link like this:
```javascript
const link = `https://twitter.com/${tweet.author.username}/status/${tweet.id}`;
```

💡 Tip: If you don't have access to the `username`, fear not, because Twitter
is actually _not_ using it, so you can write anything there and the link still 
works correctly as long as you have the right tweet ID.

### Remove line breaks in tweets
When printing a list of tweets to the console, it can be a annoying that a tweet can be spread over multiple lines as it makes it harder to see where one tweets stops and the next begins.

You can use JavaScript's `replace` function to replace the line breaks with spaces:

```javascript
console.log(tweet.text.replace(/\n/g, ' '));
```

### Fetch *all* tweets from a specific user
If you want all tweets, from a specific user, that are available through Twitter's API you can use a very high number as the `resultSize` argument.

```javascript
const tweets = await twitter.fetchTimeline({ username: 'paulg', resultSize: Number.MAX_SAFE_INTEGER });

console.log(`number of tweets returned: ${tweets.length}.`);
console.log(`total number of tweets according to twitter: ${tweets[0].author.numberOfTweets}.`);
```

However, for Twitter users with many tweets (>2,000) there is a risk that, even with a high number in `resultSize`, you will not get all of the tweets (as see in `tweet.author.numberOfTweets`); in particular, the user's oldest tweets. 

⛔️ Warning: Twitter returns tweets in chunks of 200 tweets. So when you ask for more than 200 tweets, then multiple APIs call will be made to Twitter, which pushes you closer towards the max limits. `hello-twitter` will automatically stop when no more Tweets are returned regardless of what size you have asked for.

### Get the oldest tweet in a collection of tweets
Often when you need to create a timeline or similar, you need the oldest (and newest) tweet in a collection to know the total duration of the timeline.

You can use JavaScript's `reduce` function to find the oldest tweet:

```javascript
const tweets = await twitter.fetchTimeline({ username: 'kennethlange' });
const oldestTweet = tweets.reduce((accumulator, currentValue) => {
    return currentValue.created < accumulator.created ? currentValue : accumulator
});
```

Getting the newest tweet in a tweet collection is left as a fun exercise for the reader 😊