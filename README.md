# HelloTwitter 👋
`HelloTwitter` is a minimalistic, opinionated Twitter Query API for TypeScript:

```typescript
const tweets = await twitter.fetchTweets({ query: 'Skywalker' });
tweets.forEach(tweet => {
    console.log(`${tweet.author.name} tweeted: "${tweet.text}"`);
});
```

The purpose of `HelloTwitter` is to make it super easy to query Twitter data, so we can invest our time in data analysis, visualization, and other higher-value tasks.

## Table of Content
- [Get Started](#get-started)
  * [Create a Twitter Developer Account](#Create-a-Twitter-Developer-Account)
  * [Install the NPM package](#Install-the-NPM-package)
  * [Happy coding!](#Happy-coding)
- [Twitter Cookbook](#Twitter-Cookbook)
  * [Recipe 1: Perform a basic Twitter query](#Recipe-1-Perform-a-basic-Twitter-query)
  * [Recipe 2: Find the most popular day to tweet](#Recipe-2-Find-the-most-popular-day-to-tweet)
  * [Recipe 3: Find the best time to tweet](#Recipe-3-Find-the-best-time-to-tweet)
  * [Recipe 4: Create a deeplink to a tweet](#Recipe-4-Create-a-deeplink-to-a-tweet)
  * [Recipe 5: Fetch tweets from a specific user](#Recipe-5-Fetch-tweets-from-a-specific-user)
  * [Recipe 6: Fetch **all** tweets from a specific user](#Recipe-6-Fetch-all-tweets-from-a-specific-user)
  * [Recipe 7: Find the most popular tweets about a topic](#Recipe-7-Find-the-most-popular-tweets-about-a-topic)
  * [Recipe 8: Perform a geo search](#Recipe-8-Perform-a-geo-search)
  * [Recipe 9: Remove line breaks from a tweet](#Recipe-9-Remove-line-breaks-from-a-tweet)
  * [Recipe 10: Find the oldest tweet in a collection of tweets](#Recipe-10-Find-the-oldest-tweet-in-a-collection-of-tweets)
- [License](#License)


## Get Started

### Create a Twitter Developer Account
You need a Twitter Developer account to get started. If you don't already have one, you can create one [here](https://developer.twitter.com/en/apply-for-access).

Once you have a Twitter Developer Account, create a new app and go to the **Keys and tokens** tab and make a note of the values in **API key** and **API Secret Key** as you will need them soon 📝

### Install the NPM package

```console
npm install hello-twitter
```

### Happy coding!
Here's a simple hello world program to get you started. You'll need the **API Key** and **API Secret** from Step 1:

```typescript
import HelloTwitter from 'hello-twitter';

const twitter = new HelloTwitter({
    apiKey: '<YOUR-TWITTER-API-KEY>',
    apiSecret: '<YOUR-TWITTER-API-SECRET>'
});

twitter.fetchTweets({ query: 'Hello world' }).then(tweets => console.log(tweets));
```

The collection of tweets returned is fully typed and documented (in TSDoc), so it should be easy to continue from here simply by using your IDE's autocomplete and intellisense.

I have also included a **Twitter Cookbook** below with recipes for tasks that people often want to do with Twitter data.

  
## Twitter Cookbook
Here are some tips and tricks that can be handy when you tinker with Twitter data. Some of the recipes are specific to `HelloTwitter` and others are general. 


### Recipe 1: Perform a basic Twitter query
The most basic example is simply to execute a Twitter query, just like you would in the Twitter App, and then list the results.

```typescript
// Let's check out what they're writing about California
const tweets = await twitter.fetchTweets({ query: 'California' });
tweets.forEach(tweet => {
    console.log(`${tweet.author.name} tweeted: "${tweet.text}"`);
});
```

Or you can use a `promise` instead of `async/await`: 

```typescript
// Let's check out what they're writing about California
twitter.fetchTweets({ query: 'California' }).then(tweets => {
    tweets.forEach(tweet => {
        console.log(`${tweet.author.name} tweeted: "${tweet.text}"`);
    });
});
```


### Recipe 2: Find the most popular day to tweet
Much tweet analytics is about finding the optimal time to tweet. The example below is just a beginning that shows how many tweets the user has posted on each weekday.

```typescript
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const tweetsPerDay = new Map<string, number>();

const tweets = await twitter.fetchTimeline({ username: 'kennethlange' });
tweets.forEach(tweet => {
    const weekday = weekdays[tweet.created.getDay()];
    const newCount = (tweetsPerDay.get(weekday) ?? 0) + 1;
    tweetsPerDay.set(weekday, newCount);
});

tweetsPerDay.forEach((numberOfTweets, day) => {
    console.log(`${day}: ${numberOfTweets}`);
});
```

We can easily increase the granularity by seeing the time of day when the user tweets (`tweet.created.getHours()`) and instead of looking at the number of tweets, we can see what it the most popular time to tweet (by looking at `tweet.likes` or `tweet.retweets`).


### Recipe 3: Find the best time to tweet
Given that, "When is the optimal time for me to tweet?" seems to be the top question for Twitter Analytics, I thought I would include a quick and dirty example of how to achieve this:

```typescript
type TimeSlot = {
    numberOfTweets: number,
    totalEngagement: number,
    averageEngagement: number
};

// Two-dimensional array (7x24) to represent the 7 days in a week and the 24 hours in a day.
const weekStats: TimeSlot[][] = Array(7).fill(null).map(() => Array(24).fill(null).map(() => {
    return { numberOfTweets: 0, totalEngagement: 0, averageEngagement: 0 }
}));

// Fetch the tweets and put the data into the the time slots.
const tweets = await twitter.fetchTimeline({ username: 'KennethLange' });
tweets.forEach(tweet => {
    const timeSlot = weekStats[tweet.created.getDay()][tweet.created.getHours()];
    timeSlot.numberOfTweets++;
    timeSlot.totalEngagement += tweet.retweets + tweet.likes;
});

// Calculate the average engagement per day
for (let day = 0; day < weekStats.length; day++) {
    for (let hour = 0; hour < weekStats[day].length; hour++) {
        if (weekStats[day][hour].numberOfTweets > 0) {
            weekStats[day][hour].averageEngagement = Math.round(weekStats[day][hour].totalEngagement / weekStats[day][hour].numberOfTweets);
        }
    }
}

// Print the week (CSV style) so it can be imported in a spreadsheet for further analysis.
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
console.log('Weekday, 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23');
for (let day = 0; day < weekStats.length; day++) {
    let entry  = weekdays[day];
    for (let hour = 0; hour < weekStats[day].length; hour++) {
        // Entry can be changed to numberOfTweets or totalEngagament depending on what needs to be analyzed.
        entry += ', ' + weekStats[day][hour].averageEngagement; 
    }
    console.log(entry);
}
```
I included a screenshot below where I have taken the CSV-styled data and copy/pasted it into Google Sheets, added the totals in Column Z and Row 9, and colorized the data to get a heatmap feel:
 
![Google Sheet screenshot](https://kennethlange.com/github_images/twitter_post_heatmap.png)

Looking at column Z, it seems like Tuesday is the best day to tweet, and looking at row 9 it would seem like posting between 09:00 and 11:00 would be the best time.

The example can be further enhanced with limiting the included tweets to a specific time period (like 'last month') and the median (instead of average) could be used to protect against a single, extremely popular tweet. And it would without a doubt be a lot nicer to create a frontend and display the results there instead of using Google Sheets, but that's way beyond the scope for this little recipe 😊


### Recipe 4: Create a deeplink to a tweet
Sometimes you want to deep link to a tweet on Twitter, so you can engage with the tweet on Twitter's platform.

A deep link to a tweet follows this pattern: `https://twitter.com/<username>/status/<tweet-id>`.

So with `HelloTwitter` we can create the deep link like this:
```typescript
const link = `https://twitter.com/${tweet.author.username}/status/${tweet.id}`;
```

💡 **Tip:** If you don't have access to the `username`, fear not, because Twitter
is actually _not_ using it, so you can write anything there and the link still 
works correctly as long as you have the right tweet ID.


### Recipe 5: Fetch tweets from a specific user
So you wanna see what a specific user is weeting, but you don't want to see their retweets or replies. You can easily use JavaScript `filter` to remove unneeded tweets.

```typescript
// Get the latest original tweets (no replies or retweets) from Paul Graham:
const tweets = await twitter.fetchTimeline({ username: 'paulg' });
tweets.filter(tweet => !tweet.isReply && !tweet.isRetweet).forEach(tweet => {
    console.log(`"${tweet.text}" (${tweet.likes} likes)`);
});
```

### Recipe 6: Fetch **all** tweets from a specific user
If you want all tweets, from a specific user, that are available through Twitter's API you can use a very high number as the `resultSize` argument.

```typescript
const tweets = await twitter.fetchTimeline({ username: 'paulg', resultSize: Number.MAX_SAFE_INTEGER });

console.log(`number of tweets returned: ${tweets.length}.`);
console.log(`total number of tweets according to twitter: ${tweets[0].author.numberOfTweets}.`);
```

However, for Twitter users with many tweets (>3,000) there is a risk that, even with a high number in `resultSize`, you will not get all of the tweets (compared to the value in `tweet.author.numberOfTweets`); in particular, the user's oldest tweets. 

⛔️ **Warning:** Twitter returns tweets in chunks of 200 tweets. So when you ask for more than 200 tweets, then multiple APIs call will be made to Twitter, which pushes you closer towards the max limits. `HelloTwitter` will automatically stop when no more Tweets are returned regardless of what size you have asked for.


### Recipe 7: Find the most popular tweets about a topic
The list of tweets returned by `HelloTwitter` is easy to manipulated with JavaScript's built-in list functions, such as `filter`, `sort`, `slice`, `map`, and `reduce`.

So to get the most popular tweets in a collection, we can simply sort by `tweet.likes` (or `tweet.retweets` or both) and then take the first N elements from the list.

```typescript
// Get a Top 5 of the most popular tweets tagged with #TypeScript:
const tweets = await twitter.fetchTweets({ query: '#TypeScript' });
tweets.sort((a, b) => b.likes - a.likes);
tweets.slice(0, 5).forEach((tweet, index) => {
    console.log(`${index+1}: "${tweet.text}" by ${tweet.author.name} (${tweet.likes} likes)`);
});
```


### Recipe 8: Perform a geo search
We can use the geo search to find tweets posted at a specific geographical location.

So let's figure out what they're tweeting at Stanford (latitude: 37.424107 and longitude: -122.166077).

```typescript
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


### Recipe 9: Remove line breaks from a tweet
When printing a list of tweets to the console, it can be a annoying that a tweet can be spread over multiple lines as it makes it harder to see where one tweets stops and the next begins.

You can use JavaScript's `replace` function to replace the line breaks with spaces:

```typescript
console.log(tweet.text.replace(/\n/g, ' '));
```

### Recipe 10: Find the oldest tweet in a collection of tweets
Often when you need to create a timeline or similar, you need the oldest (and newest) tweet in a collection to know the total duration of the timeline.

You can use JavaScript's `reduce` function to find the oldest tweet:

```typescript
const tweets = await twitter.fetchTimeline({ username: 'kennethlange' });
const oldestTweet = tweets.reduce((accumulator, currentValue) => {
    return currentValue.created < accumulator.created ? currentValue : accumulator
});
```

Getting the newest tweet in a tweet collection is left as a fun exercise for the reader 😊

And alternative approach is also simply to sort the array (`tweets.sort`) and then take the first and last element.



## License
This project is licensed under the [MIT License](https://github.com/kenneth-lange/hello-twitter/blob/main/LICENSE).