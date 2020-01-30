buildf :
	cd frontend && npm run build && cd -
	rm -f backend/src/main/webapp/asset-manifest.json
	rm -f backend/src/main/webapp/favicon.ico
	rm -f backend/src/main/webapp/index.html
	rm -f backend/src/main/webapp/manifest.json
	rm -f backend/src/main/webapp/service-worker.js
	rm -rf backend/src/main/webapp/static/
	rm -rf backend/src/main/webapp/precache*
	rm -rf backend/src/main/webapp/workbox*
	mv frontend/build/* backend/src/main/webapp

buildb :
	cd backend && sbt package && echo "govApiKey=${GOV_API_KEY}" > target/scala-2.12/classes/application.conf && cd -

deploy : buildf buildb
	${APPENGINE_SDK_HOME}/bin/appcfg.sh --runtime=java8 update backend/target/webapp
