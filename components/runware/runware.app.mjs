import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "runware",
  propDefinitions: {
    taskType: {
      type: "string",
      label: "Task Type",
      description: "The type of task to be processed by the Runware API.",
      options: Object.values(constants.TASK_TYPE),
    },
    outputType: {
      type: "string",
      label: "Output Type",
      description: "Specifies the output type in which the image is returned.",
      optional: true,
      options: [
        "base64Data",
        "dataURI",
        "URL",
      ],
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "Specifies the format of the output image.",
      optional: true,
      options: [
        "PNG",
        "JPG",
        "WEBP",
      ],
    },
    uploadEndpoint: {
      type: "string",
      label: "Upload Endpoint",
      description: "This parameter allows you to specify a URL to which the generated image will be uploaded as binary image data using the HTTP PUT method. For example, an S3 bucket URL can be used as the upload endpoint. When the image is ready, it will be uploaded to the specified URL.",
      optional: true,
    },
    checkNSFW: {
      type: "boolean",
      label: "Check NSFW",
      description: "This parameter is used to enable or disable the NSFW check. When enabled, the API will check if the image contains NSFW (not safe for work) content. This check is done using a pre-trained model that detects adult content in images. When the check is enabled, the API will return `NSFWContent: true` in the response object if the image is flagged as potentially sensitive content. If the image is not flagged, the API will return `NSFWContent: false`. If this parameter is not used, the parameter `NSFWContent` will not be included in the response object. Adds `0.1` seconds to image inference time and incurs additional costs. The NSFW filter occasionally returns false positives and very rarely false negatives.",
      optional: true,
    },
    includeCost: {
      type: "boolean",
      label: "Include Cost",
      description: "If set to `true`, the cost to perform the task will be included in the response object. Defaults to `false`.",
      optional: true,
    },
    positivePrompt: {
      type: "string",
      label: "Positive Prompt",
      description: "A positive prompt is a text instruction to guide the model on generating the image. It is usually a sentence or a paragraph that provides positive guidance for the task. This parameter is essential to shape the desired results. For example, if the positive prompt is `dragon drinking coffee`, the model will generate an image of a dragon drinking coffee. The more detailed the prompt, the more accurate the results. The length of the prompt must be between 4 and 2000 characters.",
    },
    negativePrompt: {
      type: "string",
      label: "Negative Prompt",
      description: "A negative prompt is a text instruction to guide the model on generating the image. It is usually a sentence or a paragraph that provides negative guidance for the task. This parameter helps to avoid certain undesired results. For example, if the negative prompt is `red dragon, cup`, the model will follow the positive prompt but will avoid generating an image of a red dragon or including a cup. The more detailed the prompt, the more accurate the results. The length of the prompt must be between 4 and 2000 characters.",
      optional: true,
    },
    seedImage: {
      type: "string",
      label: "Seed Image",
      description: "When doing Image-to-Image, Inpainting or Outpainting, this parameter is **required**. Specifies the seed image to be used for the diffusion process. The image can be specified in one of the following formats:\n - An UUID v4 string of a [previously uploaded image](https://docs.runware.ai/en/getting-started/image-upload) or a [generated image](https://docs.runware.ai/en/image-inference/api-reference).\n - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.\n - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.\n - A URL pointing to the image. The image must be accessible publicly. Supported formats are: PNG, JPG and WEBP.",
      optional: true,
    },
    maskImage: {
      type: "string",
      label: "Mask Image",
      description: "When doing Inpainting or Outpainting, this parameter is **required**. Specifies the mask image to be used for the inpainting process. The image can be specified in one of the following formats:\n - An UUID v4 string of a [previously uploaded image](https://docs.runware.ai/en/getting-started/image-upload) or a [generated image](https://docs.runware.ai/en/image-inference/api-reference).\n - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.\n - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.\n - A URL pointing to the image. The image must be accessible publicly. Supported formats are: PNG, JPG and WEBP.",
      optional: true,
    },
    strength: {
      type: "string",
      label: "Strength",
      description: "When doing Image-to-Image, Inpainting or Outpainting, this parameter is used to determine the influence of the **Seed Image** image in the generated output. A higher value results in more influence from the original image, while a lower value allows more creative deviation. Min: `0` Max: `1` and Default: `0.8`.",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "Used to define the height dimension of the generated image. Certain models perform better with specific dimensions. The value must be divisible by 64, eg: `512`, `576`, `640` ... `2048`.",
      min: 512,
      max: 2048,
    },
    width: {
      type: "integer",
      label: "Width",
      description: "Used to define the width dimension of the generated image. Certain models perform better with specific dimensions. The value must be divisible by 64, eg: `512`, `576`, `640` ... `2048`.",
      min: 512,
      max: 2048,
    },
    model: {
      type: "string",
      label: "Model",
      description: "This identifier is a unique string that represents a specific model. You can find the AIR identifier of the model you want to use in our [Model Explorer](https://docs.runware.ai/en/image-inference/models#model-explorer), which is a tool that allows you to search for models based on their characteristics. More information about the AIR system can be found in the [Models page](https://docs.runware.ai/en/image-inference/models). Eg. `civitai:78605@83390`.",
    },
    steps: {
      type: "integer",
      label: "Steps",
      description: "The number of steps is the number of iterations the model will perform to generate the image. The higher the number of steps, the more detailed the image will be. However, increasing the number of steps will also increase the time it takes to generate the image and may not always result in a better image (some [schedulers](https://docs.runware.ai/en/image-inference/api-reference#request-scheduler) work differently). When using your own models you can specify a new default value for the number of steps. Defaults to `20`.",
      min: 1,
      max: 100,
      optional: true,
    },
    scheduler: {
      type: "string",
      label: "Scheduler",
      description: "An scheduler is a component that manages the inference process. Different schedulers can be used to achieve different results like more detailed images, faster inference, or more accurate results. The default scheduler is the one that the model was trained with, but you can choose a different one to get different results. Schedulers are explained in more detail in the [Schedulers page](https://docs.runware.ai/en/image-inference/schedulers).",
      optional: true,
    },
    seed: {
      type: "string",
      label: "Seed",
      description: "A seed is a value used to randomize the image generation. If you want to make images reproducible (generate the same image multiple times), you can use the same seed value. When requesting multiple images with the same seed, the seed will be incremented by 1 (+1) for each image generated. Min: `0` Max: `9223372036854776000`. Defaults to `Random`.",
      optional: true,
    },
    numberResults: {
      type: "integer",
      label: "Number Of Results",
      description: "The number of images to generate from the specified prompt. If **Seed** is set, it will be incremented by 1 (+1) for each image generated.",
      optional: true,
    },
  },
  methods: {
    getUrl(path = "") {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    async makeRequest({
      $ = this, path, headers, ...args
    }) {
      const response = await axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
      if (response.errors) {
        throw new Error(JSON.stringify(response.errors));
      }
      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};