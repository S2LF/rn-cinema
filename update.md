# Update SDK

Le SDK 42 est actuellement déprécié. Mise à jours vers la dernière version SDK 46 (au 24/08/2022).

[Voir la doc Expo à ce sujet](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)

Pour mettre à jours, lancer la commande :

```sh

expo upgrade

```

### Problèmes rencontrés

* L'installation du SDK 46 a bien fonctionné mais le `npm i` à la fin a échoué.

Pour régler cela, il a fallut lancer la commande `npm update --legacy-peer-deps` afin de forcer la mise à jours des packages.

* Erreur avec package `react-native-safe-area-context`

Lors du build de l'application sur mobile, une erreur de lié à ce package.

[Voir Github Issue similaire ](https://github.com/react-navigation/react-navigation/issues/7033)

Pour régler ce soucis, il a fallut réinstaller spécifiquement ce package :

```sh

npm i react-native-safe-area-context

```

* Erreur avec le package `React-Native-Reanimated`

<img src="https://i.stack.imgur.com/tggnR.png"/>

Cette erreur se résout en créant un fichier `babel.confid.js` avec ce contenu :

```javascript

module.exports = function(api) {

api.cache(true);

return {

presets: ['babel-preset-expo'],

plugins: ['react-native-reanimated/plugin'],

};

};

```

[Sujet StackOverflow sur ce problème](https://stackoverflow.com/questions/73200340/react-native-reanimated-error-node-modules-react-native-reanimated-src-index-t)

* Erreur lié à Linux & VSCode

```

"Visual Studio Code is unable to watch for file changes in this large workspace" (error ENOSPC)

```

[Sujet StackOverflow sur ce problème](https://stackoverflow.com/questions/55763428/react-native-error-enospc-system-limit-for-number-of-file-watchers-reached)

Solution:

```sh

# insert the new value into the system config

echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

```
