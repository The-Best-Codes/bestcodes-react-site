echo 'Removing node_modules and package-lock.json'
rm -rf node_modules
rm -rf package-lock.json

echo 'Running depcheck'
npx depcheck@latest -y
npx depcheck@latest --json >unused-deps.json

echo 'Removing unused dependencies and devDependencies'
node remove-unused-deps.js

echo 'Reinstalling dependencies'
npm install
