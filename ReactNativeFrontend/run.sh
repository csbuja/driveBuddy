# helpful when packager has an error
watchman watch-del-all
rm -rf node_modules/ && npm install
npm start -- -- reset-cached
