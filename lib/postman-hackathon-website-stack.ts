import * as cdk from '@aws-cdk/core';
import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront'
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as route53 from '@aws-cdk/aws-route53';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as targets from '@aws-cdk/aws-route53-targets';

const websiteDistSourcePath = './website/public';
const deploymentVersion = '1.0.0';

interface CdkPostmanStackProps extends cdk.StackProps {
  readonly certificate: acm.ICertificate;
  readonly env: any;
}

export class PostmanHackathonWebsiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: CdkPostmanStackProps) {
    super(scope, id, props);

    const sourceBucket = new Bucket(this, 'hackathonWebsiteBuckect', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });

    new BucketDeployment(this, 's3Deployment', {
      sources: [Source.asset(websiteDistSourcePath)],
      destinationBucket: sourceBucket,
      destinationKeyPrefix: `${deploymentVersion}/`,
    });

    const distribution = new CloudFrontWebDistribution(this, 'hackathonCloudfrontCDN', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: sourceBucket.bucketName,
            originPath: `${deploymentVersion}/`
          },
          behaviors : [ {isDefaultBehavior: true}]
        }
      ],
      aliasConfiguration: {
        acmCertRef: props?.certificate?.certificateArn || '',
        names: ['api-network.info', 'www.api-network.info']
      }
    });

    const zone = route53.HostedZone.fromLookup(this, "zone", { domainName: 'api-network.info' });

    const websiteARecord = new route53.ARecord(this, 'websiteARecord', {
      zone: zone,
      recordName: 'api-network.info',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
    });

    const websiteWWWARecord = new route53.ARecord(this, 'websiteWWWARecord', {
      zone: zone,
      recordName: 'www.api-network.info',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
    });
  }
}
