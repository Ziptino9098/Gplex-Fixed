#!/bin/bash
# Apple's ld64 and lipo for Linux (cctools-port), with libdispatch built from source first: the armv7 link
# that lld cannot do
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"
if [ ! -f libdispatch-out/lib/libdispatch.so ]; then
    cmake -G Ninja -S libdispatch-src -B libdispatch-build -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ \
        -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX="$HERE/libdispatch-out" -DBUILD_SHARED_LIBS=ON > libdispatch-cmake.log 2>&1
    ninja -C libdispatch-build install > libdispatch-ninja.log 2>&1
fi
echo "libdispatch: $(ls libdispatch-out/lib | tr '\n' ' ')"
cd cctools-port/cctools
./autogen.sh > "$HERE/cctools-autogen.log" 2>&1 || true
./configure --prefix="$HERE/cctools-out" --target=aarch64-apple-darwin11 --with-libdispatch="$HERE/libdispatch-out" > "$HERE/cctools-configure.log" 2>&1
make -j8 > "$HERE/cctools-make.log" 2>&1
make install > "$HERE/cctools-install.log" 2>&1
echo "cctools built: $(ls "$HERE/cctools-out/bin" | tr '\n' ' ')"
