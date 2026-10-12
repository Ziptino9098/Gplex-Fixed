#!/bin/bash
# Gplex+ for iOS 6 to 13: UIWebView, armv7 and arm64 in one binary, built with clang against the iPhoneOS 10.3
# SDK and linked with Apple's ld64 (cctools-port), fake-signed with ldid, packed as a .deb that installs
# into /Applications (uicache in postinst) for the site's Cydia repo.
#   ./build-legacy.sh <version>      -> out/com.gplexextended.plus_<version>_iphoneos-arm.deb
set -e
cd "$(dirname "$0")"
V="${1:-1.0}"
SDK=sdks/iPhoneOS10.3.sdk
LD=cctools-out/bin/aarch64-apple-darwin11-ld
# (the theos copy of this SDK's libobjc stub leaves out the struct-returning sends armv7 code uses; put them in once)
grep -q '_objc_msgSend_stret' "$SDK/usr/lib/libobjc.tbd" || \
    sed -i 's/_objc_msgSend,/_objc_msgSend, _objc_msgSend_stret, _objc_msgSendSuper_stret,/' "$SDK/usr/lib/libobjc.tbd"
PKG=out/legacy/pkg
APP=$PKG/Applications/GplexPlus.app
rm -rf out/legacy
mkdir -p "$APP" "$PKG/DEBIAN"
for ARCH in armv7 arm64; do
    MIN=6.0
    if [ "$ARCH" = "arm64" ]; then MIN=7.0; fi
    clang -target $ARCH-apple-ios$MIN -isysroot "$SDK" -fno-objc-arc -DGP_LEGACY=1 -Wall -Wno-deprecated-declarations -O2 \
        -c app/GPApp.m -o "out/legacy/GPApp-$ARCH.o"
    "$LD" -arch $ARCH -syslibroot "$SDK" -ios_version_min $MIN -lSystem -lobjc -framework UIKit -framework Foundation \
        -framework CoreGraphics -o "out/legacy/GplexPlus-$ARCH" "out/legacy/GPApp-$ARCH.o"
done
python3 fat.py "$APP/GplexPlus" out/legacy/GplexPlus-armv7 out/legacy/GplexPlus-arm64
chmod 755 "$APP/GplexPlus"
sed "s/<string>1.0<\/string>/<string>$V<\/string>/g" app/Info-legacy.plist > "$APP/Info.plist"
cp out/themes-legacy.plist "$APP/themes.plist"
for f in Icon-57.png Icon-57@2x.png Icon-60@2x.png Icon-60@3x.png Icon-72.png Icon-72@2x.png Icon-76.png Icon-76@2x.png \
         Default.png Default@2x.png Default-568h@2x.png Default-667h@2x.png Default-736h@3x.png Default-812h@3x.png \
         Default-Portrait.png Default-Portrait@2x.png; do
    cp "out/art/$f" "$APP/$f"
done
printf 'APPL????' > "$APP/PkgInfo"
./ldid-src/ldid -S "$APP/GplexPlus"
cat > "$PKG/DEBIAN/control" <<EOF
Package: com.gplexextended.plus
Name: Gplex+
Version: $V
Architecture: iphoneos-arm
Section: Social
Priority: optional
Depends: firmware (>= 6.0), uikittools
Maintainer: Gplex Extended <https://gplexextended.com/>
Author: Gplex Extended <https://gplexextended.com/>
Homepage: https://plus.gplexextended.com/
Description: Gplex+, the Gplex Extended community, as an app, with a Theme list that draws it the way Google+ looked in the year of any Gplex layout (through the Gplex+ part of Gplex Legacy, served by the site). iOS 6 to 13.
EOF
cat > "$PKG/DEBIAN/postinst" <<'EOF'
#!/bin/sh
if [ -x /usr/bin/uicache ]; then
    /usr/bin/uicache
fi
exit 0
EOF
cat > "$PKG/DEBIAN/postrm" <<'EOF'
#!/bin/sh
if [ -x /usr/bin/uicache ]; then
    /usr/bin/uicache
fi
exit 0
EOF
chmod 755 "$PKG/DEBIAN/postinst" "$PKG/DEBIAN/postrm"
# (gzip: the dpkg of old iOS reads nothing newer)
dpkg-deb -Zgzip --root-owner-group -b "$PKG" "out/com.gplexextended.plus_${V}_iphoneos-arm.deb"
ls -la "out/com.gplexextended.plus_${V}_iphoneos-arm.deb"
file "$APP/GplexPlus"
