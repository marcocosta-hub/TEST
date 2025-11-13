#!/bin/bash

echo Before Run wss-container-apply-configurations

# Run wss-container-apply-configurations
java -cp /etc/usr/local/whitesource/utils/wss-container-apply-configurations-24.11.2-jar-with-dependencies.jar:/ com.wss.container.ApplyConfigurations -v /etc/usr/local/whitesource/conf/prop.json

echo After running update-Config-From-Wss-Properties

# Run bolt4bb Application
java $JAVA_OPTS -jar /etc/usr/local/whitesource/bolt-runner-25.9.1-jar-with-dependencies.jar
