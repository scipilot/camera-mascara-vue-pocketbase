# Camera Mascara - Vue3 Pocketbase front-end app

This is a simple front-end for the "Camera Mascara" (mark 2), a Raspberry Pi Hat single-pixel masked camera, inspired by the work by Jon Bumstead of Okooptics [instructables](https://www.instructables.com/Non-line-of-sight-Imaging-With-a-Photoresistor-and/) [YouTube](https://www.youtube.com/watch?v=dMH6VUs5u8k). 

- See the server-side project to be installed on the Pi here: https://github.com/scipilot/camera-mascara
- See the related Pi Hat hardware design Kicad project here: https://github.com/scipilot/camera-mascara-jzh


This small web app allows you to "take photos" with the Pi Hat while varying some parameters without having to SSH in, edit and run the code on the Pi. It makes the "camera" into a more usable device - the web app is easily hosted inside the Pi itself so the whole thing is self-contained. (If you are making changes, the web app can be run on a developer machine on the same local network, as it will use the same API.)

The server-side project contains a Pocketbase server which provides a REST API wrapping a database which stores and present the resulting images, plus a few management tables such as "devices" and the "jobs" posted to configure the device, monitor light levels and initiate photo scans. This front-end app therefore contains a Pocketbase API client and uses reactive data subscriptions to present the UI and monitor the long-running jobs (photos can take many minutes to complete).

To get it all up and running:

a) construct the Pi Hat and mount it on a Pi Zero W (or similar, see other repo), 
b) set up the server in the Pi (see other repo),
c) build and upload this Vue app into the Pockebase hosting folder on the Pi (see below).

To prepare for deployment of this project, you first need to create the pb_public folder in Pocketbase on the Pi, and give your user permission to save to it (avoids sudo). e.g.


	ssh pi@raspberrypi.local
	sudo mkdir /usr/local/pocketbase/pb_public
	sudo chown pi:pi /usr/local/pocketbase/pb_public


To build and deploy the Vue app to the Pi you can use this helper script, providing the ssh user (default "pi") e.g.

	bin/deploy pi

This assumes: hosting via Pocketbase, host is raspberrypi.local, and ssh has a local login key stored to avoid entering the password every time.

Then view the UI on: http://raspberrypi.local:8090/ 

If you need to change the Pi's default domain name (which works magically via mDNS, but would clash with any other Pis on the same network), you can edit the .env file `VITE_POCKETBASE_URL` - the only config option for this project.



# Standard Vue Project 

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

