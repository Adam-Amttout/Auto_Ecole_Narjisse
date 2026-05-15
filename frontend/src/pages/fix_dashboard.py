#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('Dashboard.js', 'rb') as f:
    raw = f.read()

print(f"Original size: {len(raw)} bytes")

# Step 1: Fix surrogate pair escape sequences like \\ud83d\\udeab -> actual emoji
text = raw.decode('utf-8', errors='replace')

def fix_surrogate_escapes(text):
    pattern = r'\\\\u([Dd][89AaBb][0-9A-Fa-f]{2})\\\\u([Dd][CcDdEeFf][0-9A-Fa-f]{2})'
    def replace_surrogate(m):
        high = int(m.group(1), 16)
        low  = int(m.group(2), 16)
        if 0xD800 <= high <= 0xDBFF and 0xDC00 <= low <= 0xDFFF:
            codepoint = 0x10000 + (high - 0xD800) * 0x400 + (low - 0xDC00)
            return chr(codepoint)
        return m.group(0)
    count_before = len(re.findall(pattern, text))
    fixed = re.sub(pattern, replace_surrogate, text)
    print(f"Fixed {count_before} surrogate pair escapes")
    return fixed

text = fix_surrogate_escapes(text)

# Step 2: Fix double-encoded sequences using byte-level replacements on original
# Re-encode back and do byte replacements
new_raw = text.encode('utf-8')

# Byte-level replacements for remaining broken emojis
# These are double-encoded: original UTF-8 bytes read as latin1 then re-encoded as UTF-8
broken_pairs = [
    # French accented chars still broken (if any remain)
    (bytes([0xc3, 0x83, 0xc2, 0xa9]), '\u00e9'.encode('utf-8')),  # é
    (bytes([0xc3, 0x83, 0xc2, 0xa8]), '\u00e8'.encode('utf-8')),  # è
    (bytes([0xc3, 0x83, 0xc2, 0xa0]), '\u00e0'.encode('utf-8')),  # à
    (bytes([0xc3, 0x83, 0xc2, 0xb4]), '\u00f4'.encode('utf-8')),  # ô
    (bytes([0xc3, 0x83, 0xc2, 0xa7]), '\u00e7'.encode('utf-8')),  # ç
    (bytes([0xc3, 0x83, 0xc2, 0xaa]), '\u00ea'.encode('utf-8')),  # ê
    (bytes([0xc3, 0x83, 0xc2, 0xab]), '\u00eb'.encode('utf-8')),  # ë
    (bytes([0xc3, 0x83, 0xc2, 0xae]), '\u00ee'.encode('utf-8')),  # î
    (bytes([0xc3, 0x83, 0xc2, 0xaf]), '\u00ef'.encode('utf-8')),  # ï
    (bytes([0xc3, 0x83, 0xc2, 0xb9]), '\u00f9'.encode('utf-8')),  # ù
    (bytes([0xc3, 0x83, 0xc2, 0xbb]), '\u00fb'.encode('utf-8')),  # û
    (bytes([0xc3, 0x83, 0xc2, 0xbc]), '\u00fc'.encode('utf-8')),  # ü
    (bytes([0xc3, 0x83, 0xc2, 0x89]), '\u00c9'.encode('utf-8')),  # É
    (bytes([0xc3, 0x83, 0xc2, 0x80]), '\u00c0'.encode('utf-8')),  # À
    (bytes([0xc3, 0x83, 0xc2, 0x87]), '\u00c7'.encode('utf-8')),  # Ç
    (bytes([0xc3, 0x83, 0xc2, 0xa2]), '\u00e2'.encode('utf-8')),  # â
    # Emoji double-encoded: f0 9f XX XX became c3 b0 c5 b8 XX XX
    # 🚫 U+1F6AB: f0 9f 9a ab -> c3 b0 c5 b8 c5 a1 c2 ab (triple encoded? No...)
    # Let's check: f0 = 0xf0, read as latin1 char U+00F0 = ð, encoded as UTF-8: c3 b0
    #              9f = 0x9f, not standard latin1... 
    # Actually the remaining emoji issues come from the \ud83d\uXXXX pattern fixed above
]

total = 0
for broken, correct in broken_pairs:
    count = new_raw.count(broken)
    if count > 0:
        new_raw = new_raw.replace(broken, correct)
        total += count
        sys.stdout.write(f"Fixed {count}x: {correct.decode('utf-8')}\n")

print(f"Total byte fixes: {total}")

# Step 3: Fix the specific broken \\ud83d... that are NOT surrogate pairs but text escapes
# e.g. the string literally has: {v:"interdiction",l:"\\ud83d\\udeab Interdiction"}  
# These need to be replaced in the text representation
text2 = new_raw.decode('utf-8', errors='replace')

# Single \uXXXX escapes in JS strings (not double-backslash)
# These show as \ud83d in the source text
single_surr = r'\\u([Dd][89AaBb][0-9A-Fa-f]{2})\\u([Dd][CcDdEeFf][0-9A-Fa-f]{2})'
def replace_single_surr(m):
    high = int(m.group(1), 16)
    low  = int(m.group(2), 16)
    codepoint = 0x10000 + (high - 0xD800) * 0x400 + (low - 0xDC00)
    return chr(codepoint)

count = len(re.findall(single_surr, text2))
text2 = re.sub(single_surr, replace_single_surr, text2)
print(f"Fixed {count} single-backslash surrogate escapes")

# Write final result
final_raw = text2.encode('utf-8')
with open('Dashboard.js', 'wb') as f:
    f.write(final_raw)

# Verify
verify = final_raw.decode('utf-8', errors='replace')
remaining = verify.count('\ufffd')
print(f"\nDone! Size: {len(raw)} -> {len(final_raw)} bytes")
print(f"Remaining broken chars: {remaining}")

# Show the area that was broken before
idx = verify.find('interdiction')
if idx >= 0:
    sys.stdout.write("\nSample (interdiction area):\n")
    sys.stdout.write(verify[max(0,idx-20):idx+100] + "\n")
