# ezScrum_Ubuntu

ezScrum v1.7.1 fork form [ezScrum](http://sourceforge.net/projects/ezscrum/files/Release/v1.7.1/).


## setting

modify the ``localhost`` string to real host (like 192.168.56.2), and it can\`t work with ``localhost``.

    $ vim JettyServer.xml
    ...
    <SystemProperty name="jetty.host" default="localhost"/>

## Makefile

Run the ezScrum.

	$ make

Stop the ezScrum.

	$ make stop

Update the ezScrum_Ubuntu from my github.

    $ make update

