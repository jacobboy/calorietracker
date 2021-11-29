# https://stackoverflow.com/a/246128
# get current directory of script, regardless of how i'm being executed
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )/"

openapi-generator generate -i ${DIR}/fdcnal-food-data_central_api-1.0.0-swagger.json -g typescript-axios -o ${DIR}/../../fev2/macromacro/src/

# openapi-generator generate -i usda-api.yaml -g typescript-fetch -o usdaclient && rm -rf ../../frontend/src/usdaclient && mv usdaclient ../../frontend/src/usdaclient
