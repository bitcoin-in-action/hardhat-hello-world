# It's Web3 baby!!!

Welcome to the shell!

## Next steps

1. docker-compose up
2. wait for blockscout explorer loaded
3. deploy your first contract

```sh
cd 2-prelaunch/hello-world
```

to enter our hello world workspace!
## docker-compose up

Update it before...

```sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

...then use it!

```sh
docker-compose up
```

## wait for blockscout explorer loaded

Wait until __npm install__ finish...

...openining a new <walkthrough-open-cloud-shell-button></walkthrough-open-cloud-shell-button> and

```sh
docker logs -f oz
```

...then click <walkthrough-web-preview-icon></walkthrough-web-preview-icon> and open the 4000 port.

## deploy your first contract

Opena a new <walkthrough-open-cloud-shell-button></walkthrough-open-cloud-shell-button> and

```sh
docker exec -ti --workdir /opt/emerald-city/helloworld oz npx hardhat run --network localhost scripts/deploy.js
```
Now check the explorer, you'll see a new block!
