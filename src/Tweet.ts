/**
 * An fully typed tweet. Somewhat opinionated.
 * 
 * For more information about the different twitter entities:
 * Tweet: https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/object-model/tweet
 * Entities: https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/object-model/entities
 * Media: https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/object-model/entities#media
 */
export type Tweet = {
    /** The unique ID of the tweet. Note: The type is a string (rather than number) because JavaScript's number type is too small to hold the ID. */
    id: string,

    /** The full 280 characters of the tweet. */
    text: string,

    /** Date when the tweet was created. */
    created: Date,

    /** What app (such as Twitter for iPhone or Hubspot) was used to compose the tweet? Note the value is a hyperlink. */
    app: string,

    /** Language of the tweet. For instance, 'en'. */
    language: string,

    /** How many times this tweet has been liked? (a.k.a. favorited or saved-for-later). */
    likes: number,

    /** How many times this tweet has been retweeted. */
    retweets: number,

    /** Is this a quote tweet? That is, a tweet quoting another tweet? */
    isQuote: boolean,

    /** Is this a retweet of another tweet? */ 
    isRetweet: boolean,

    /** Is this tweet a reply to another tweet? */
    isReply: boolean,

    /** If a tweet is a reply, this property gives details about what and who the reply was to. */
    replyTo?: {
        /** The tweet that this tweet replies to. For example, 1375708863282970628. */
        tweetId: string,

        /** The unique ID of the user that this tweet replies to. For example, 399621704. */
        userId: string,

        /** The unique Twitter username of the user that this tweet replies to. For example, 'KennethLange'. */
        username: string
    },

    /** Where was the tweet tweeted? According to the user or client application. */
    coordinates?: {
        /** The longitude of the Tweet. For example, 12.6475 */
        longitude: number,

        /** The latitude of the Tweet. For example, 55.654 */
        latitude: number
    },

    /** The Twitter user who created this Tweet. */
    author: {
        /** The unique ID of the user. Note that it is a string (rather than number) because JavaScript's number type is too small to hold the ID. */
        id: string,

        /** The non-unique name of the user who wrote the tweet. For instance, 'Kenneth Lange'. */
        name: string,

        /** The unique Twitter username of the user who wrote the tweet. For instance, 'KennethLange'. */
        username: string,

        /** The location field from the user's profile. For example, 'Copenhagen, Denmark'. */
        location: string,

        /** The user's website. For example, 'https://kennethlange.com'. */
        website: string,

        /** The description of the user on the user's profile page. */
        bio: string,

        /** Is this a verified Twitter account? */
        isVerified: boolean,

        /** How many are following this user?  */
        followers: number,

        /** How many other users are this user following? */
        following: number,

        /** When was this user created? */
        created: Date,

        /** How many tweets has this user created? */
        numberOfTweets: number,

        /** The language of the user. */
        language: string,
    },
    /** The entities (URLs, tags, mentions, and media) used in the Tweet. */
    entities: {
        /** Easy access to all the URLs nested in entities.urls.expandedUrls. */
        urls: string[],

        /** Easy access to all the hashtags nested in entities.tags.text. */
        tags: string[],

        /** Easy access to all the mentions nested in entities.mentions.screenName. */
        mentions: string[],

        /** Easy access to all the media nested in entities.media.mediaUrl */
        media: string[]
    },

    /**  More information about the entities in the Tweet. Harder to use than the 'entities' property. */
    fullEntities: {
        urls: {
            /** The URL embedded in the Tweet text. This is also the URL that the indices refers to. */
            url: string,

            /** The expanded URL. */
            expandedUrl: string,

            /** The URL shown to the user. */
            displayUrl: string,

            /** The start and end index of the URL in the tweet's text. */
            indices: number[]
        }[],
        tags: {
            /** A hashtag, such as #DevOps (but without the #). */
            text: string,

            /** The start and end index of the hashtag in the tweet's text. */
            indices: number[]
        }[],
        mentions: {
            /** The unique ID of the user mentioned. */
            id: string,

            /** The profile name. For instance, 'Kenneth Lange'. */
            name: string,

            /** The unique Twitter handle. For instance, 'KennethLange'. */
            screenName: string,

            /** The start and end index of the mention in the tweet's text. */
            indices: number[]
        }[],
        media: {
            /** Unique ID of the media. */
            id: string,

            /** URL shown to user. */
            displayUrl: string,

            /** URL to where the media can be seen on Twitter. */
            expandedUrl: string

            /** The start and end index of the media's location in the tweet's text. */
            indices: number[],

            /** The link to the actual media (for example, .jpg file) on Twitter. */
            mediaUrl: string,

            /** The type of the media. For example, 'photo'. */
            type: string
        }[]
    }
};

/** Takes a tweet collection returned by Twitter (in JSON) and maps it to a value of the Tweet type. */
export const parseTweets = (json: string): Tweet[] => {
    const jsonResponse = JSON.parse(json);

    // If the tweet collection is wrapped by 'statuses' property, then remove the 
    // 'statuses' property, so it will just be a collection.
    const jsonTweets = (jsonResponse.statuses ? jsonResponse.statuses : jsonResponse);

    // Parse each tweet in the raw JSON collection and append it to the tweets array.
    const tweets: Tweet[] = [];
    jsonTweets.forEach((status: any) => {
        tweets.push({
            id: status.id_str,
            text: status.full_text || status.text,
            language: status.lang,
            created: new Date(status.created_at),
            likes: status.favorite_count || 0,
            retweets: status.retweet_count,
            app: status.source,
            isQuote: status.is_quote_status,
            isRetweet: status.retweeted_status !== undefined,
            isReply: status.in_reply_to_status_id !== null,
            author: {
                id: status.user.id_str,
                name: status.user.name,
                username: status.user.screen_name,
                location: status.user.location,
                website: status.user.url,
                bio: status.user.description,
                isVerified: status.user.verified,
                followers: status.user.followers_count,
                following: status.user.friends_count,
                created: new Date(status.user.created_at), 
                numberOfTweets: status.user.statuses_count,
                language: status.user.lang
            },
            entities: {
                urls: [],
                tags: [],
                mentions: [],
                media: []
            },
            fullEntities: {
                urls: [],
                tags: [],
                mentions: [],
                media: []
            }
        });

        // Get the expanded URL for the user's website
        if (status.user.entities.url && tweets[tweets.length - 1].author.website) {
            tweets[tweets.length - 1].author.website = status.user.entities.url.urls[0].expanded_url;
        }

        // Parse reply
        if (status.in_reply_to_status_id) {
            status.replyTo = {
                tweetId: status.in_reply_to_status_id_str || '0',
                userId: status.in_reply_to_user_id_str || '0',
                username: status.in_reply_to_screen_name || ''
            }
        }

        // Parse coordinates
        if (status.coordinates) {
            tweets[tweets.length - 1].coordinates = {
                longitude: status.coordinates[0],
                latitude: status.coordinates[1]
            }
        }

        // Parse URLs
        status.entities.urls.forEach((urlObject: any) => {
            tweets[tweets.length - 1].entities.urls.push(urlObject.expanded_url);
            tweets[tweets.length - 1].fullEntities.urls.push({
                url: urlObject.url,
                expandedUrl: urlObject.expanded_url,
                displayUrl: urlObject.display_url,
                indices: urlObject.indices
            });
        });

        // Parse Hashtags
        status.entities.hashtags.forEach((tagObject: any) => {
            tweets[tweets.length - 1].entities.tags.push(tagObject.text);
            tweets[tweets.length - 1].fullEntities.tags.push({
                text: tagObject.text,
                indices: tagObject.indices
            });
        });

        // Parse Mentions
        status.entities.user_mentions.forEach((mentionObject: any) => {
            tweets[tweets.length - 1].entities.mentions.push(mentionObject.screen_name);
            tweets[tweets.length - 1].fullEntities.mentions.push({
                id: mentionObject.id_str,
                name: mentionObject.name,
                screenName: mentionObject.screen_name,
                indices: mentionObject.indices
            });
        });

        // Parse Media
        if (status.entities.media) {
            status.entities.media.forEach((mediaObject: any) => {
                tweets[tweets.length - 1].entities.media.push(mediaObject.media_url);
                tweets[tweets.length - 1].fullEntities.media.push({
                    id: mediaObject.id_str,
                    displayUrl: mediaObject.display_url,
                    expandedUrl: mediaObject.expanded_url,
                    indices: mediaObject.indices,
                    mediaUrl: mediaObject.media_url,
                    type: mediaObject.type
                });
            });
        }
    });
    return tweets;
}