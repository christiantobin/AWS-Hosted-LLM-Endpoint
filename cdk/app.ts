import {App} from 'aws-cdk-lib';
import {InstanceClass, InstanceSize} from 'aws-cdk-lib/aws-ec2';
import {HuggingFaceLlmProps} from 'aws-sagemaker-huggingface-llm';
import {Huggingface} from './stacks/Huggingface.stack';

const app = new App();

const LLMs: Array<HuggingFaceLlmProps> = [
  {
    instanceType: `ml.${InstanceClass.G5}.${InstanceSize.XLARGE2}`,
    environmentVariables: {
      HF_MODEL_ID: 'NousResearch/Llama-2-7b-chat-hf',
      SM_NUM_GPUS: '1',
      MAX_INPUT_LENGTH: '2048',
      MAX_TOTAL_TOKENS: '4096',
      MAX_BATCH_TOTAL_TOKENS: '8192',
    },
    name: 'llama2-chatbot',
  },
];

new Huggingface(app, 'LLM-Endpoints', {
  LLMs,
  tags: {environment: 'dev'},
  env: {region: process.env.REGION, account: process.env.ACCOUNT},
  description: 'Example CDK Project for LLM Endpoint Creation',
});

app.synth();
