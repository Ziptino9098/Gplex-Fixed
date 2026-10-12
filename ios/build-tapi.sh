#!/bin/bash
# libtapi (Apple's text-based stub reader) for ld64, then cctools again with it: the SDKs from theos/sdks
# carry .tbd stubs only, which ld64 reads through libtapi
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE/libtapi-src"
INSTALLPREFIX="$HERE/libtapi-out" ./build.sh > "$HERE/libtapi-build.log" 2>&1
INSTALLPREFIX="$HERE/libtapi-out" ./install.sh > "$HERE/libtapi-install.log" 2>&1
echo "libtapi: $(ls "$HERE/libtapi-out/lib" | tr '\n' ' ')"
cd "$HERE/cctools-port/cctools"
make distclean > /dev/null 2>&1 || true
./configure --prefix="$HERE/cctools-out" --target=aarch64-apple-darwin11 --with-libdispatch="$HERE/libdispatch-out" \
    --with-libtapi="$HERE/libtapi-out" > "$HERE/cctools-configure2.log" 2>&1
make -j8 > "$HERE/cctools-make2.log" 2>&1
make install > "$HERE/cctools-install2.log" 2>&1
echo "cctools with tapi: $(ls "$HERE/cctools-out/bin" | grep -c .) tools"
