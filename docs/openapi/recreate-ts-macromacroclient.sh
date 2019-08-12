openapi-generator generate -i macromacro.yaml -g typescript-fetch -o macromacro && rm -rf ../../frontend/src/client/ && mv macromacro/ ../../frontend/src/client
