import 'mocha';
import { assert, expect } from 'chai';

import { parseTweets } from '../Tweet';

import { twitterTimeline } from './timeline.fixture';
import { twitterSearchResult } from './search.fixture';

describe('Tweet', () => {
    it('parses a Twitter timeline', () => {
        const tweets = parseTweets(JSON.stringify(twitterTimeline));

        expect(tweets).to.have.lengthOf(1);
        expect(tweets[0].id).to.equal('850007368138018817');
        expect(tweets[0].text).to.equal('RT @TwitterDev: 1/ Today we’re sharing our vision for the future of the Twitter API platform!nhttps://t.co/XweGngmxlP');
        assert.deepEqual(tweets[0].created, new Date("Thu Apr 06 15:28:43 +0000 2017"));
        expect(tweets[0].app).to.equal('<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>');
        expect(tweets[0].language).to.equal('en');
        expect(tweets[0].likes).to.equal(0);
        expect(tweets[0].retweets).to.equal(284);
        expect(tweets[0].isQuote).to.equal(false);
        expect(tweets[0].isRetweet).to.equal(true);
        expect(tweets[0].isReply).to.equal(false);
        expect(tweets[0].replyTo).to.equal(undefined);
        expect(tweets[0].coordinates).to.equal(undefined);

        // Author
        expect(tweets[0].author.id).to.equal('6253282');
        expect(tweets[0].author.name).to.equal('Twitter API');
        expect(tweets[0].author.username).to.equal('twitterapi');
        expect(tweets[0].author.location).to.equal('San Francisco, CA');
        expect(tweets[0].author.website).to.equal('https://dev.twitter.com');
        expect(tweets[0].author.bio).to.equal("The Real Twitter API. I tweet about API changes, service issues and happily answer questions about Twitter and our API. Don't get an answer? It's on my website.");
        expect(tweets[0].author.isVerified).to.equal(true);
        expect(tweets[0].author.followers).to.equal(6172353);
        expect(tweets[0].author.following).to.equal(46);
        assert.deepEqual(tweets[0].author.created, new Date('Wed May 23 06:01:13 +0000 2007'));
        expect(tweets[0].author.numberOfTweets).to.equal(3583);
        expect(tweets[0].author.language).to.equal('en');

        // Entities
        expect(tweets[0].entities.urls).to.have.lengthOf(1);
        assert.deepEqual(tweets[0].entities.urls, ['https://cards.twitter.com/cards/18ce53wgo4h/3xo1c']);
        expect(tweets[0].entities.tags).to.have.lengthOf(0);
        expect(tweets[0].entities.mentions).to.have.lengthOf(1);
        assert.deepEqual(tweets[0].entities.mentions, ['TwitterDev']);
        expect(tweets[0].entities.media).to.have.lengthOf(0);

        // Full Entities
        expect(tweets[0].fullEntities.urls).to.have.lengthOf(1);
        expect(tweets[0].fullEntities.tags).to.have.lengthOf(0);
        expect(tweets[0].fullEntities.mentions).to.have.lengthOf(1);
        expect(tweets[0].fullEntities.media).to.have.lengthOf(0);

        assert.deepEqual(tweets[0].fullEntities.urls, [{
            url: 'https://t.co/XweGngmxlP',
            expandedUrl: 'https://cards.twitter.com/cards/18ce53wgo4h/3xo1c',
            displayUrl: 'cards.twitter.com/cards/18ce53wg…',
            indices: [94, 117]
        }]);

        assert.deepEqual(tweets[0].fullEntities.mentions, [{
            id: '2244994945',
            name: 'TwitterDev',
            screenName: 'TwitterDev',
            indices: [3, 14]
        }]);
    });

    it('parses a Twitter search', () => {
        const tweets = parseTweets(JSON.stringify(twitterSearchResult));

        expect(tweets).to.have.lengthOf(1);
        expect(tweets[0].id).to.equal('1376549139132080135');
        expect(tweets[0].text).to.equal('RT @KennethLange: 📢 New Blog Post 📢\n \nThe Functional Core, Imperative Shell pattern is so exciting!🔥 This pattern enables #FunctionalProgra…');
        assert.deepEqual(tweets[0].created, new Date('Mon Mar 29 14:57:44 +0000 2021'));
        expect(tweets[0].app).to.equal('<a href=\"https://about.twitter.com/products/tweetdeck\" rel=\"nofollow\">TweetDeck</a>');
        expect(tweets[0].language).to.equal('en');
        expect(tweets[0].likes).to.equal(0);
        expect(tweets[0].retweets).to.equal(4);
        expect(tweets[0].isQuote).to.equal(false);
        expect(tweets[0].isRetweet).to.equal(true);
        expect(tweets[0].isReply).to.equal(false);
        expect(tweets[0].replyTo).to.equal(undefined);
        expect(tweets[0].coordinates).to.equal(undefined);

        // Author
        expect(tweets[0].author.id).to.equal('399621704');
        expect(tweets[0].author.name).to.equal('Kenneth Lange');
        expect(tweets[0].author.username).to.equal('KennethLange');
        expect(tweets[0].author.location).to.equal('Copenhagen, Denmark');
        expect(tweets[0].author.website).to.equal('http://kennethlange.com');
        expect(tweets[0].author.bio).to.equal("CTO at @TiaTechnology | Building an awesome UX for insurance professionals using Design Thinking and React 🚀");
        expect(tweets[0].author.isVerified).to.equal(false);
        expect(tweets[0].author.followers).to.equal(5090);
        expect(tweets[0].author.following).to.equal(3365);
        assert.deepEqual(tweets[0].author.created, new Date('Thu Oct 27 19:44:18 +0000 2011')); // !!!! Better name?
        expect(tweets[0].author.numberOfTweets).to.equal(159);
        expect(tweets[0].author.language).to.equal('en');

        // Entities
        expect(tweets[0].entities.urls).to.have.lengthOf(0);
        expect(tweets[0].entities.tags).to.have.lengthOf(0);
        expect(tweets[0].entities.mentions).to.have.lengthOf(1);
        assert.deepEqual(tweets[0].entities.mentions, ['KennethLange']);
        expect(tweets[0].entities.media).to.have.lengthOf(0);

        // Full Entities
        expect(tweets[0].fullEntities.urls).to.have.lengthOf(0);
        expect(tweets[0].fullEntities.tags).to.have.lengthOf(0);
        expect(tweets[0].fullEntities.mentions).to.have.lengthOf(1);
        expect(tweets[0].fullEntities.media).to.have.lengthOf(0);

        assert.deepEqual(tweets[0].fullEntities.mentions, [{
            id: '399621704',
            name: 'Kenneth Lange',
            screenName: 'KennethLange',
            indices: [3, 16]
        }]);
    });
});