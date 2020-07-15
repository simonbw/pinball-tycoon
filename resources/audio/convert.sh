#!/usr/bin/env bash

for i in ./*.aif;
  do ffmpeg -i "$i" "${i%.*}.flac";
done
