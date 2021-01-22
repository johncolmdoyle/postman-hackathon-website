import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as PostmanHackathonWebsite from '../lib/postman-hackathon-website-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new PostmanHackathonWebsite.PostmanHackathonWebsiteStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
