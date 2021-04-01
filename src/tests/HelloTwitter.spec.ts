import 'mocha';
import { expect } from 'chai';
import nock from 'nock';

import { authFixture } from './auth.fixture';
import { twitterSearchResultFixture } from './search.fixture';
import { twitterTimelineResultFixture } from './timeline.fixture';

import HelloTwitter from '../HelloTwitter';

describe('HelloTwitter', function() {
    it('performs a Twitter search.', async () => {
        const scope = nock('https://api.twitter.com')
            .post('/oauth2/token')
            .reply(200, JSON.stringify(authFixture))
            .get('/1.1/search/tweets.json?tweet_mode=extended&q=test&result_type=recent&count=1')
            .reply(200, JSON.stringify(twitterSearchResultFixture));

        const twitter = new HelloTwitter({
            apiKey: '...',
            apiSecret: '...'
        });

        const tweets = await twitter.fetchTweets({ query: 'test', resultSize: 1 });
        expect(tweets).to.have.lengthOf(1);
        expect(tweets[0].id).to.equal('1376549139132080135');
    });

    it('fetches a timeline.', async () => {
        const scope = nock('https://api.twitter.com')
            .post('/oauth2/token')
            .reply(200, JSON.stringify(authFixture))
            .get('/1.1/statuses/user_timeline.json?screen_name=kennethlange&tweet_mode=extended&count=1')
            .reply(200, JSON.stringify(twitterTimelineResultFixture));

        const twitter = new HelloTwitter({
            apiKey: '...',
            apiSecret: '...'
        });

        const tweets = await twitter.fetchTimeline({ username: 'kennethlange', resultSize: 1});
        expect(tweets).to.have.lengthOf(1);
        expect(tweets[0].id).to.equal('850007368138018817');
    });

    it('test', async () => {
        nock.cleanAll();
        nock.enableNetConnect();

        const twitter = new HelloTwitter({
            apiKey: '...',
            apiSecret: '...'
        });
        
        // witter.fetchTweets({ query: 'hello world' }).then(tweets => console.log(tweets));
    });

});
