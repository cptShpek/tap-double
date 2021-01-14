# DappDouble

> Server and Frontend for the DappDouble application

## [Online](http://64.227.39.75/)

## Usage in dev

- Go to the server via terminal: `ssh root@64.227.39.75`
- Go to the /var/www/dapp-double.com folder: `cd /var/www/dapp-double.com`
- Get last changes from git (use ssh password): `git pull`
- Rebuild fronted: `npm run build-client`

## Usage in prod

- Go to the server via terminal: `ssh root@142.93.226.89`
- Go to the /var/www/dapp-double.com folder: `cd /var/www/dapp-double.com/html`
- Get last changes from git (use ssh password): `git pull`
- Rebuild fronted: `npm run build-client`

## Reset DB (Dangerous)

```
npm run cleaner
```

## Stack:

- Node.js
- Express.js
- MongoDB
- Mongoose
- NGINX
- PM2
- React

---

- Version: 1.0.0.
- License: MIT
