

config:
	cp cp config.json ~/.homebridge

run:
	git pull
	cp config.json ~/.homebridge
	homebridge
