#!/usr/bin/env python3
"""Decodifica e ricodifica i layout .ftu di FlyThings / ZKOS (non sono cifrati).

Formato (verificato su tutti i 157 .ftu del backup):
  0   4  "ZKSW"
  4   2  AA 55
  6   4  L  = lunghezza da offset 8 fino all'inizio dello stream zlib (little endian)
  10  4  lunghezza JSON + 8
  14  4  lunghezza stream zlib + 16
  18  L-10  "campione": byte copiati dallo stream zlib alle posizioni 7,8, 10,11, 13,14, ...
  8+L ...  stream zlib (livello 6, header 78 9C) del JSON del layout
  fine 6  55 AA "ZKS W"

Uso:
  python3 ftu.py decodifica main_1920_720_1.ftu            -> main_1920_720_1.json (leggibile)
  python3 ftu.py codifica main_1920_720_1.json originale.ftu nuovo.ftu
  python3 ftu.py verifica cartella_con_ftu                 -> prova decodifica+ricodifica identica
"""
import json, struct, sys, zlib, os, glob

MAGIC, TAIL = b'ZKSW\xaa\x55', b'\x55\xaaZKSW'

def sample_positions(n):
    return [7 + (i // 2) * 3 + (i % 2) for i in range(n)]

def parse(data):
    if data[:6] != MAGIC or data[-6:] != TAIL:
        raise ValueError('non è un file .ftu ZKSW')
    L = struct.unpack('<I', data[6:10])[0]
    jlen8, zlen16 = struct.unpack('<II', data[10:18])
    sample = data[18:8 + L]
    stream = data[8 + L:-6]
    if len(stream) != zlen16 - 16:
        raise ValueError('lunghezza stream inattesa')
    raw = zlib.decompress(stream)
    if len(raw) != jlen8 - 8:
        raise ValueError('lunghezza JSON inattesa')
    if any(stream[p] != sample[i] for i, p in enumerate(sample_positions(len(sample)))):
        raise ValueError('campione non coerente con lo stream')
    return raw, len(sample)

def build(raw, sample_len):
    stream = zlib.compress(raw, 6)
    sample = bytes(stream[p] for p in sample_positions(sample_len))
    L = 10 + sample_len
    return MAGIC + struct.pack('<III', L, len(raw) + 8, len(stream) + 16) + sample + stream + TAIL

def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    cmd = sys.argv[1]
    if cmd == 'decodifica':
        src = sys.argv[2]; raw, _ = parse(open(src, 'rb').read())
        out = os.path.splitext(src)[0] + '.json'
        obj = json.loads(raw.decode('utf-8'))
        open(out, 'w', encoding='utf-8').write(json.dumps(obj, ensure_ascii=False, indent=2))
        print('scritto', out)
    elif cmd == 'codifica':
        js, orig, out = sys.argv[2:5]
        _, sample_len = parse(open(orig, 'rb').read())   # stessa lunghezza di campione dell'originale
        obj = json.load(open(js, encoding='utf-8'))
        raw = json.dumps(obj, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
        data = build(raw, sample_len)
        parse(data)  # controllo di coerenza
        open(out, 'wb').write(data); print('scritto', out, len(data), 'byte')
    elif cmd == 'verifica':
        ok = bad = 0
        for f in sorted(glob.glob(os.path.join(sys.argv[2], '**', '*.ftu'), recursive=True)):
            data = open(f, 'rb').read()
            try:
                raw, n = parse(data)
                same = build(raw, n) == data
                rt = json.dumps(json.loads(raw), ensure_ascii=False, separators=(',', ':')).encode() == raw
                ok += same; bad += not same
                if not same or not rt: print('DIVERSO' if not same else 'JSON non canonico', f)
            except Exception as e:
                bad += 1; print('ERRORE', f, e)
        print(f'{ok} identici byte per byte, {bad} diversi')
    else:
        print(__doc__); sys.exit(1)

if __name__ == '__main__':
    main()
