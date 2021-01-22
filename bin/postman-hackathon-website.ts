#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PostmanHackathonWebsiteStack } from '../lib/postman-hackathon-website-stack';
import { PostmanHackathonCertificateStack } from '../lib/postman-hackathon-certificate';

const app = new cdk.App();
const certStack = new PostmanHackathonCertificateStack(app, 'PostmanHackathonCertificateStack', {env: {'account': process.env['CDK_DEFAULT_ACCOUNT'], 'region': 'us-east-1'}});
const websiteStack = new PostmanHackathonWebsiteStack(app, 'PostmanHackathonWebsiteStack', {
                       certificate: certStack.cert,
                       env: {'account': process.env['CDK_DEFAULT_ACCOUNT'], 'region': 'us-east-1'}
                     });

websiteStack.addDependency(certStack);

cdk.Tags.of(app).add("app", "postman-hackathon");
