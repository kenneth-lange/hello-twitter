import https from 'https';
import { parseTweets, Tweet } from './Tweet';

type TwitterCredentials = {
    apiKey: string,
    apiSecret: string
}

type SearchOptions = {
    /** The text you want to search for. For instance, 'California' or '#javascript'. */
    query?: string,

    /** Limit the query to tweets from a specific location. */
    location?: {
        latitude: number,
        longitude: number,
        radius?: {
            /** Size of the radius. The default is 1 */
            size: number,
            /** Measurement of the size. The default is 'kilometers'. */
            unit: 'miles' | 'kilometers'
        }
    },

    /** What tweets should be returned? The most recent, the most popular, or a mix of the two. The default is 'recent'. */
    resultType?: 'recent' | 'popular' | 'mixed',

    /** Number of tweets to return. The default is '200'. */
    resultSize?: number
}

type TimelineOptions = {
    /** The Twitter user whose tweets you want to fetch. For instance, 'kennethlange' */
    username: string,

    /** Number of tweets to return. The default is '200', meaning the latest 200 tweets. */
    resultSize?: number
}

export class HelloTwitter {
    private apiKey: string;
    private apiSecret: string;
    private accessToken: string | undefined = undefined;

    constructor(twitterCredentials: TwitterCredentials) {
        if (!twitterCredentials.apiKey) {
            throw Error('apiKey is mandatory.');
        }

        if (!twitterCredentials.apiSecret) {
            throw Error('apiSecret is mandatory.');
        }

        this.apiKey = twitterCredentials.apiKey;
        this.apiSecret = twitterCredentials.apiSecret;
    }

    private callTwitterApi(options: https.RequestOptions, data: string): Promise<string> {
        return new Promise((resolve, reject) => {
            // Automatically calculate content-length header.
            if (options.headers) {
                if (!options.headers['Content-Length']) {
                    options.headers['Content-Length'] = data.length;
                }
                if (!options.headers['User-Agent']) {
                    options.headers['User-Agent'] = 'TweetFetcher';
                }
            }
    
            const request = https.request(options, response => {
                let responseBody = '';
                response.on("data", chunk => responseBody += chunk );
                response.on("end", () => { 
                    if (response.statusCode === 200) {
                        resolve(responseBody); 
                    } else {
                        reject(new Error(responseBody)); 
                    }
                });
            }).on("error", (error) => reject(new Error(error.message)));
            
            request.write(data); 
            request.end();
        });
    };

    private async getToken(): Promise<string> {
        // Twitter Docs:
        // https://developer.twitter.com/en/docs/authentication/oauth-2-0/application-only
        // https://developer.twitter.com/en/docs/authentication/api-reference/token

        if (this.accessToken !== undefined) {
            return this.accessToken;
        }

        // Create the bearer token for Twitter.
        const encodedConsumerKey = encodeURIComponent(this.apiKey);
        const encodedConsumerSecret = encodeURIComponent(this.apiSecret);
        const bearerToken = encodedConsumerKey + ':' + encodedConsumerSecret;
        const bearerTokenBase64 = Buffer.from(bearerToken).toString('base64');

        // Initialize the Twitter API call
        const options = {
            hostname: 'api.twitter.com',
            path: '/oauth2/token',
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + bearerTokenBase64,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };

        const response = await this.callTwitterApi(options, 'grant_type=client_credentials');
        this.accessToken = JSON.parse(response).access_token as string;

        return this.accessToken;
    }

    /** Execute a Twitter query and returns the matching Tweets. */
    public async fetchTweets(options: SearchOptions): Promise<Tweet[]> {
        // Twitter Doc:
        // https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets

        const token = await this.getToken();
        const tweets: Tweet[] = [];
        let maxId: string | null = null;

        const queryCondition = (options.query !== undefined ? '&q=' + encodeURIComponent(options.query): ''); 
        const resultTypeCondition = '&result_type=' + (options.resultType !== undefined ? options.resultType : 'recent');
        const countCondition = '&count=' + encodeURIComponent(Math.min(options.resultSize ?? 200, 200));

        // Handles the location paramter
        let geocodeCondition = '';
        if (options.location) {
            geocodeCondition = '&geocode=' + encodeURIComponent(options.location.latitude) + ',' 
                                           + encodeURIComponent(options.location.longitude);

            if (options.location.radius) {
                geocodeCondition += ',' + options.location.radius.size + (options.location.radius.unit == 'kilometers' ? 'km' : 'mi');
            } else {
                geocodeCondition += ',1mi'
            }
        }

        let keepGoing = true;
        while (keepGoing) {
            const maxIdCondition = (maxId !== null ? '&max_id=' + encodeURIComponent(maxId) : '');
            const response = await this.callTwitterApi({
                hostname: 'api.twitter.com',
                path: '/1.1/search/tweets.json?tweet_mode=extended' + queryCondition + resultTypeCondition + countCondition + maxIdCondition + geocodeCondition, 
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token }
            }, '');

            const newTweets = parseTweets(response);
            tweets.push(...newTweets);

            if (newTweets.length === 0 || tweets.length >= (options.resultSize ?? 200)) {
                keepGoing = false;
            } else {
                maxId = newTweets[newTweets.length - 1].id;
                // Decrease maxId with 1 to avoid duplicates in result.
                maxId = maxId.substr(0, maxId.length - 10) + (parseInt(maxId.substr(maxId.length - 10), 10) - 1).toString().padStart(2, '0'); 
            }
        }
        return tweets;
    }

    /** Fetch tweets written by a specific Twitter user, returned in in reverse chronological order. */
    public async fetchTimeline(options: TimelineOptions): Promise<Tweet[]> {
        // Twitter Doc:
        // https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
        const token = await this.getToken();
        const tweets: Tweet[] = [];
        let maxId: string | null = null;

        let keepGoing = true;
        while (keepGoing) {
            const maxIdCondition = (maxId !== null ? '&max_id=' + encodeURIComponent(maxId) : '');
            const countCondition = '&count=' + encodeURIComponent(Math.min(options.resultSize ?? 200, 200));

            const response = await this.callTwitterApi({
                hostname: 'api.twitter.com',
                path: '/1.1/statuses/user_timeline.json?screen_name=' + encodeURIComponent(options.username) + '&tweet_mode=extended' + maxIdCondition + countCondition,
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token }
            }, '');

            const newTweets = parseTweets(response);
            tweets.push(...newTweets);

            if (newTweets.length === 0 || tweets.length >= (options.resultSize ?? 200)) {
                keepGoing = false;
            } else {
                maxId = newTweets[newTweets.length - 1].id;
                // Decrease maxId with 1 to avoid duplicates in result.
                maxId = maxId.substr(0, maxId.length - 10) + (parseInt(maxId.substr(maxId.length - 10), 10) - 1).toString().padStart(2, '0'); 
            }
        } 
        return tweets;
    }
}
export default HelloTwitter;