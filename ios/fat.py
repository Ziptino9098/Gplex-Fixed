"""A fat (universal) Mach-O from thin ones, as lipo -create does. python3 fat.py <out> <thin>..."""
import struct
import sys

CPU = {0xC: ("armv7", 9), 0x100000C: ("arm64", 0)}   # cputype -> (name, cpusubtype)


def main():
    out, thins = sys.argv[1], sys.argv[2:]
    parts = []
    for p in thins:
        d = open(p, "rb").read()
        magic = d[:4]
        if magic == b"\xcf\xfa\xed\xfe":        # MH_MAGIC_64, little endian
            cputype, cpusub = struct.unpack("<II", d[4:12])
        elif magic == b"\xce\xfa\xed\xfe":      # MH_MAGIC
            cputype, cpusub = struct.unpack("<II", d[4:12])
        else:
            raise SystemExit("%s is not a thin Mach-O" % p)
        parts.append((cputype, cpusub & 0xFFFFFF, d))
    # 16 KB alignment for every slice (arm64 wants 2^14)
    align = 14
    off = 8 + 20 * len(parts)
    off = (off + (1 << align) - 1) & ~((1 << align) - 1)
    hdr = struct.pack(">II", 0xCAFEBABE, len(parts))
    body = b""
    cur = off
    for cputype, cpusub, d in parts:
        hdr += struct.pack(">IIIII", cputype, cpusub, cur, len(d), align)
        body += d
        pad = (-len(d)) % (1 << align)
        body += b"\0" * pad
        cur += len(d) + pad
    hdr += b"\0" * (off - len(hdr))
    open(out, "wb").write(hdr + body)
    print(out, ":", ", ".join(CPU.get(c, (hex(c),))[0] for c, _, _ in parts))


if __name__ == "__main__":
    main()
