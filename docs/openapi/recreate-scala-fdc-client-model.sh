openapi-generator generate -i fdc-api.yaml -g scala-akka -o fdcclient
mv fdcclient/src/main/scala/org/openapitools/client/model/ ../../backend/src/main/scala/com/macromacro/fdc
rm -r fdcclient
# sed some shit
