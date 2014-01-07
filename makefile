#!/bin/bash

SHELL = /bin/bash

.PHONY: all start stop setting update

all: start

start: start.jar
	sudo /usr/bin/java -jar start.jar &
	@echo "launch finish!"

stop: stop.sh
	@-./stop.sh
	@echo "kill 'start.jar'."

setting: JettyServer.xml
	vi -p JettyServer.xml

update: .git
	git pull
