FROM node:0.12-wheezy

RUN apt-get update && \
	apt-get install tinyproxy supervisor -y

# Clean up
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /var/cache/apt/*
	
RUN npm install toxy

ADD chimera.js /chimera.js

# Configure Supervisor
ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN mkdir -p /var/run/tinyproxy && touch /var/run/tinyproxy/tinyproxy.pid && chmod 777 /var/run/tinyproxy/tinyproxy.pid

EXPOSE 3000 9000

# Run Supervisor in the foreground
CMD ["/usr/bin/supervisord", "-n"]
