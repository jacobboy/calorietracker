openapi-generator generate -i usda-api.yaml -g typescript-fetch -o usdaclient && rm -rf ../../frontend/src/usdaclient && mv usdaclient ../../frontend/src/usdaclient
