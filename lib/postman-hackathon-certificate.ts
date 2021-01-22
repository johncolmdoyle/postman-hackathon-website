import * as cdk from '@aws-cdk/core';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as route53 from '@aws-cdk/aws-route53';

export class PostmanHackathonCertificateStack extends cdk.Stack {
  public readonly cert: acm.ICertificate;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromLookup(this, "zone", { domainName: 'api-network.info' });

    const certificate = new acm.Certificate(this, 'Certificate', {
       domainName: 'api-network.info',
       subjectAlternativeNames: ["www.api-network.info"],
       validation: acm.CertificateValidation.fromDns(zone),
    });

    this.cert = certificate;
  }
}

