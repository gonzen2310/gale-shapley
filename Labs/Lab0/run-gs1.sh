#!/bin/bash

echo Gale Shapley Algorithm
echo Writing times to data.txt

> data.txt
for i in 1000 1500 2000 2500 5000
do
    node gs1.js $i >> data.txt
done

echo Done!
