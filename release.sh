#!/bin/bash


URL="https://drbwnfea1gxrk.cloudfront.net"
CLOUDFRONT_DISTRIBUTION="E1SF7W9PEC2YGU"
S3_BUCKET="marinminds-app"
VERSION=$(cat package.json | jq '.version'  | tr -d '"')
PROFILE="marinminds"

echo "**** [1/5] Building application v${VERSION}"
yarn build

echo "**** [2/5] Syncing build/* to s3://$S3_BUCKET..."
aws s3 sync build/ s3://${S3_BUCKET}  --profile ${PROFILE} --cache-control max-age=172800 --delete

echo "**** [3/5] Creating CloudFront invalidation..."
aws configure set preview.cloudfront true
INVALIDATION_ID=$(aws cloudfront create-invalidation --profile ${PROFILE} --distribution-id ${CLOUDFRONT_DISTRIBUTION} --paths "/index.html" "/static/" "/assets/" "/*" "/static/*" "/assets/*" | jq '.Invalidation.Id' | tr -d '"')
echo "**** [4/5] Waiting for CloudFront invalidation ${INVALIDATION_ID} to complete..."
aws cloudfront wait invalidation-completed --profile ${PROFILE} --id ${INVALIDATION_ID} --distribution-id ${CLOUDFRONT_DISTRIBUTION}

echo "**** [5/5] Committing and pushing to GitHub"
git add --all . && git commit -am "Release v$VERSION" && git tag -a "v$VERSION" -m "Release v$VERSION"  && git push && git push --tags
echo "**** All done! Application is live on $URL"