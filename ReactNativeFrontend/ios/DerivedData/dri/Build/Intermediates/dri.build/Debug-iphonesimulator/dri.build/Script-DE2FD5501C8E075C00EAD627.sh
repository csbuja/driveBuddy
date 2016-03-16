#!/bin/sh
INFOPLIST="${TARGET_BUILD_DIR}/${INFOPLIST_PATH}"
echo "writing to $INFOPLIST"
PLISTCMD="Add :SERVER_IP string $(ifconfig | grep inet\ | tail -1 | cut -d " " -f 2)"
echo -n "$INFOPLIST" | xargs -0 /usr/libexec/PlistBuddy -c "$PLISTCMD" || true
PLISTCMD="Set :SERVER_IP $(ifconfig | grep inet\ | tail -1 | cut -d " " -f 2)"
echo -n "$INFOPLIST" | xargs -0 /usr/libexec/PlistBuddy -c "$PLISTCMD" || true
