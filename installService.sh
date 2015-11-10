sudo cp StoriaNodeService.conf /etc/init/StoriaNodeService.conf

sudo service StoriaNodeService start

sudo service StoriaNodeService stop

sudo tail -f /var/log/upstart/StoriaNodeService.log

