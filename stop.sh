#!/bin/bash

# stop the start.jar

sudo kill -9 $(ps aux | grep start.jar | awk '{print $2}')
