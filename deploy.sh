#!/bin/bash

rm -rf dist/

npm run build

tar -zcvf dist.tar.gz dist/

scp dist.tar.gz root@118.31.14.134:/root/deploy/
