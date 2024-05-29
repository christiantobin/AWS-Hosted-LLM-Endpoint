import {Stack, StackProps} from 'aws-cdk-lib';
import {
  HuggingFaceLlm,
  HuggingFaceLlmProps,
} from 'aws-sagemaker-huggingface-llm';
import {Construct} from 'constructs';

import {
  ApiGatewayToSageMakerEndpoint,
  ApiGatewayToSageMakerEndpointProps,
} from '@aws-solutions-constructs/aws-apigateway-sagemakerendpoint';

export interface HuggingfaceStackProps extends StackProps {
  LLMs: Array<HuggingFaceLlmProps>;
  apiProps?: ApiGatewayToSageMakerEndpointProps;
}

export class Huggingface extends Stack {
  constructor(scope: Construct, id: string, props?: HuggingfaceStackProps) {
    super(scope, id, props);

    if (props)
      for (let LLM of props?.LLMs) {
        const sagemakermodel = new HuggingFaceLlm(
          this,
          `${this.environment}-${LLM.name}`,
          LLM
        );
        if (props.apiProps) {
          new ApiGatewayToSageMakerEndpoint(this, `${LLM.name}-apigateway`, {
            endpointName: sagemakermodel.endpoint,
            resourcePath: props.apiProps?.resourcePath,
            requestMappingTemplate: props.apiProps.requestMappingTemplate,
          });
        }
      }
  }
}
