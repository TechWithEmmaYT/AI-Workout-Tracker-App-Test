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

## jdk KEY

b2439d28e5ec01324b48c2fd519be55a63462cf4e738ad2e6825b36ac48a176c
