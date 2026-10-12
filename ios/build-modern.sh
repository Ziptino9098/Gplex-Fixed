#!/bin/bash
# Gplex+ for iOS 14 and later: WKWebView, arm64, built with clang and lld against the iPhoneOS 14.5 SDK,
# fake-signed with ldid, packed as an unsigned .ipa (AppSync Unified, TrollStore).
#   ./build-modern.sh <version>      -> out/GplexPlus-<version>.ipa
set -e
cd "$(dirname "$0")"
V="${1:-1.0}"
SDK=sdks/iPhoneOS14.5.sdk
APP=out/modern/Payload/GplexPlus.app
export PATH=/usr/local/bin:$PATH
rm -rf out/modern
mkdir -p "$APP"
clang -target arm64-apple-ios14.0 -isysroot "$SDK" -fobjc-arc -DGP_LEGACY=0 -Wall -O2 \
    -fuse-ld=lld -framework UIKit -framework WebKit -framework Foundation \
    -o "$APP/GplexPlus" app/GPApp.m
sed "s/<string>1.0<\/string>/<string>$V<\/string>/g" app/Info-modern.plist > "$APP/Info.plist"
cp out/themes-modern.plist "$APP/themes.plist"
for f in AppIcon60x60@2x.png AppIcon60x60@3x.png AppIcon76x76.png AppIcon76x76@2x.png AppIcon83.5x83.5@2x.png; do
    cp "out/art/$f" "$APP/$f"
done
printf 'APPL????' > "$APP/PkgInfo"
./ldid-src/ldid -S "$APP/GplexPlus"
(cd out/modern && rm -f "../GplexPlus-$V.ipa" && zip -q -r -X "../GplexPlus-$V.ipa" Payload)
ls -la "out/GplexPlus-$V.ipa"
file "$APP/GplexPlus"
