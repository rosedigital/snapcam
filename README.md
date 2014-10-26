# snapcam

send webcam snaps to snapchatters

**use at own risk, snapchat api is dodgy and unofficial - security risks**

## install

1. [ffmpeg](https://www.ffmpeg.org/download.html): `sudo apt-get install ffmpeg` (will add raspberry pi option)
2. video4linux2: `sudo apt-get install v4l-utils`
3. [GraphicsMagick](http://www.graphicsmagick.org/): `sudo apt-get install graphicsmagick`
4. `npm install` (the snapchat module is a bit broken, might need fixing)

## configure

1. copy `config-sample.json` to `config.json`
2. and add your snapchat username and password (_make sure your snapchat account can accept snaps from everyone_)
3. [optional] add modes

## run

`node main.js`

## add more

you can add more modes, by adding them to the `modes.json` file. you can add watermarks to the `img` dir too.
