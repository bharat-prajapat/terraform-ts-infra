import { App, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { AwsProvider, s3, dynamodb, lambda, iam } from "@cdktf/provider-aws";
import * as fs from "fs";
import * as crypto from "crypto";
import * as path from "path";

class InfraStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // AWS Provider
    new AwsProvider(this, "aws", {
      region: "us-east-1",
    });

    // IAM Role for Lambda
    const lambdaRole = new iam.IamRole(this, "LambdaExecutionRole", {
      name: "cdktf-lambda-role",
      assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      }),
    });

    new iam.IamRolePolicyAttachment(this, "LambdaBasicExecutionPolicy", {
      role: lambdaRole.name,
      policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    });

    // S3 Bucket
    new s3.S3Bucket(this, "SampleBucket", {
      bucket: "terraform-ts-infra-sample-bucket",
    });

    // DynamoDB Table
    new dynamodb.DynamodbTable(this, "SampleTable", {
      name: "terraform-ts-infra-table",
      billingMode: "PAY_PER_REQUEST",
      hashKey: "id",
      attribute: [
        {
          name: "id",
          type: "S",
        },
      ],
    });

    // Lambda Function
    const lambdaZipPath = path.resolve(__dirname, "./lambda/lambda.zip");
    const lambdaZipBuffer = fs.readFileSync(lambdaZipPath);
    const sourceCodeHash = crypto.createHash("sha256").update(lambdaZipBuffer).digest("base64");

    new lambda.LambdaFunction(this, "SampleLambda", {
      functionName: "terraform-ts-infra-lambda",
      role: lambdaRole.arn,
      handler: "index.handler",
      runtime: "nodejs18.x",
      filename: lambdaZipPath,
      sourceCodeHash,
    });
  }
}

const app = new App();
new InfraStack(app, "terraform-ts-infra");
app.synth();
