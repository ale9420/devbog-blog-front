#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
SERVICE_NAME="devbog-blog-front"
REPO_NAME="devbog-blog"
IMAGE_NAME="devbog-front"
IMAGE_TAG="$(date +%Y%m%d-%H%M%S)"
IMAGE="us-central1-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "Building and deploying ${IMAGE} ..."

gcloud builds submit \
  --tag "${IMAGE}" \
  --project "${PROJECT_ID}"

gcloud run deploy "${SERVICE_NAME}" \
  --image="${IMAGE}" \
  --region="${REGION}" \
  --platform=managed \
  --allow-unauthenticated \
  --cpu=1 \
  --memory=512Mi \
  --concurrency=80 \
  --min-instances=0 \
  --max-instances=5 \
  --timeout=300 \
  --execution-environment=gen2 \
  --cpu-boost \
  --service-account="devbog-runner@${PROJECT_ID}.iam.gserviceaccount.com" \
  --project "${PROJECT_ID}"

echo "Deployed ${IMAGE_TAG} to Cloud Run."
echo "Service URL: https://${SERVICE_NAME}-${PROJECT_ID:0:8}-${REGION}.a.run.app"
