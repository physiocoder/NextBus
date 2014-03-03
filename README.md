## Getting started

Install Meteor.

Install Meteorite.

Download the source code.

git clone http://github.com/mstn/NextBus

Run 

cd NextBus
mrt

The application is available at http://localhost:3000

## Use your own GTFS dataset

Create a directory under private.

Copy your gtfs file there.

Change server/bootstrap.js file. BASE_DIR variable must be the name of the newly created directory.

Yeah... a bit hacking, but we are going to improve it!