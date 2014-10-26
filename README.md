# snapcam

send webcam snaps to snapchatters

## install

1. 'streamer': `sudo apt-get install streamer` (will add raspberry pi option)
2. GraphicsMagick: `sudo apt-get install graphicsmagick`
3. `npm install` (the snapchat module is a bit broken, might need fixing)

## configure

1. copy `config-sample.json` to `config.json`
2. and add your snapchat username and password (_make sure your snapchat account can accept snaps from everyone_)
3. [optional] add modes

## run

`node main.js`

## add more

you can add more modes, by adding them to the `modes.json` file. you can add watermarks to the `img` dir too.