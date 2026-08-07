https://gist.github.com/chirag-chhajed/d0bc667325544c3e7cccc04e03b5d1dc

npx expo start --clear

## run this after table created

% npm run db:migrate

//
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:push": "drizzle-kit push",
"db:studio": "drizzle-kit studio"

npx eas build --platform android --profile preview

npm install --global eas-cli
npm install -g eas-cli # you're on 20.5.1, latest is 21.4.0
npx expo export -p web # builds dist/ (static site + server bundle)
eas deploy

eas env:create --name DATABASE_URL --value <neon-url> --environment production
eas env:create --name BETTER_AUTH_SECRET --value <secret> --environment production
eas env:create --name BETTER_AUTH_URL --value <your-expo-app-url> --environment production
eas env:create --name IMAGEKIT_PRIVATE_KEY --value <key> --environment production

https://ai-workout-tracker-app--1yh9zv4h89.expo.app

//https://ai-workout-tracker-app--tbuskumtq9.expo.app

npx expo run:android --variant release
npx react-native build-android --mode=release

## upload store key password

1fb9a436b6c001a3dedbdb1de6404b023ae0ba1e7445ea75e912c0c10804e611

##

npx expo export --platform web

## only api to be build

npx expo export --platform web --no-ssg

##

eas deploy --alias testapi

eas env:create

eas env:create --scope project --name BETTER_AUTH_URL --value https://ai-workout-tracker-app--testapi.expo.app --environment production --visibility plaintext

eas env:create --scope project --name BETTER_AUTH_SECRET --value replace-with-at-least-32-random-characters --environment production --visibility secret

eas env:create --scope project --name DATABASE_URL --value <your-db-url> --environment production --visibility secret

eas env:create --scope project --name IMAGEKIT_PRIVATE_KEY --value <your-imagekit-private-key> --environment production --visibility secret
