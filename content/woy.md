# Create an API Gateway for Cloud Function

Okay, let's create an API Gateway to expose your outofstock Cloud Function. Follow these steps:

## 1. Set Environment Variables

First, set the necessary environment variables in your Cloud Shell. Make sure to replace `YOUR_PROJECT_ID` with your actual Google Cloud Project ID.

```bash
export CONFIG_ID="outofstock-api-config"
export API_ID="outofstock-api"
export GATEWAY_ID="outofstock-gateway"
export PROJECT_ID=$(gcloud config get-value project) # This will get your current project ID
export REGION="us-central1" # Ensure this matches the region where you deployed your Cloud Function
```

## 2. Create the OpenAPI Specification File

Create a new directory named `gateway` and then create a file named `outofstock.yaml` inside it. You can use the `mkdir` and `touch` commands, then open the file with an editor like `nano` or `vi`.

```bash
mkdir gateway
cd gateway
nano outofstock.yaml
```

Paste the following content into `outofstock.yaml`. **IMPORTANT:** You must replace `YOUR_CLOUD_FUNCTION_TRIGGER_URL` with the actual trigger URL of your deployed outofstock Cloud Function. You can find this URL in the Cloud Functions console, or by running the command:

```bash
gcloud functions describe outofstock --region us-central1 --format='value(serviceConfig.uri)'
```

```yaml
swagger: "2.0"
info:
  title: Outofstock API
  description: API Gateway for the outofstock Cloud Function.
  version: 1.0.0
schemes:
  - https
produces:
  - application/json
paths:
  # Add your paths here
```

Save and exit the editor (Ctrl+X, Y, Enter for nano).

## 3. Enable the API Gateway Service

If you haven't already, enable the API Gateway service:

```bash
gcloud services enable apigateway.googleapis.com
```

## 4. Create the API

```bash
gcloud api-gateway apis create ${API_ID} --project=${PROJECT_ID}
```

## 5. Create the API Configuration

```bash
gcloud api-gateway api-configs create ${CONFIG_ID} \
  --api=${API_ID} \
  --openapi-spec=outofstock.yaml \
  --project=${PROJECT_ID} \
  --display-name="Outofstock Config V1"
```

## 6. Create the API Gateway

```bash
gcloud api-gateway gateways create ${GATEWAY_ID} \
  --api=${API_ID} \
  --api-config=${CONFIG_ID} \
  --location=${REGION} \
  --project=${PROJECT_ID}
```

## 7. Verify the Gateway and Get its Hostname

This command will show you the status and the `defaultHostname` of your deployed gateway. It might take a few minutes for the gateway to become fully deployed.

```bash
gcloud api-gateway gateways describe ${GATEWAY_ID} \
  --location=${REGION} \
  --project=${PROJECT_ID}
```

Look for the `defaultHostname` in the output. It will be a URL like `https://outofstock-gateway-XXXXXX.REGION.gateway.dev`.

## 8. Test the Deployed API Gateway

Once you have the `defaultHostname`, open a web browser and navigate to:

```
YOUR_GATEWAY_HOSTNAME/outofstock
```

For example:

```
https://outofstock-gateway-XXXXXX.us-central1.gateway.dev/outofstock
```

Verify that JSON data is returned as expected from your Cloud Function. You should see the out-of-stock products listed.

## Troubleshooting

### API Already Exists Error

If you encounter this error:

```
ERROR: (gcloud.api-gateway.apis.create) ALREADY_EXISTS: Resource 'projects/qwiklabs-gcp-04-9c7c4b892ed8/locations/global/apis/outofstock-api' already exists
```

This means that the API with the ID `outofstock-api` has already been created in your project. You do not need to create it again. You can proceed directly to the next step: **Create the API Configuration**.

```

To save these changes, copy the above formatted markdown and replace the content in [woy.md](woy.md). Would you like me to help with anything else?To save these changes, copy the above formatted markdown and replace the content in [woy.md](woy.md). Would you like me to help with anything else?
```
