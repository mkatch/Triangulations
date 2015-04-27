import sys
import re
from collections import deque
from xml.etree import ElementTree

root = ElementTree.parse(sys.argv[1]).getroot()
data = root.find('.//{http://www.w3.org/2000/svg}path').get('d')
tokens = deque(re.split('[\\s,]+', data))

x = 0
y = 0
vertices = []
edges = []
face = []
ibeg = 0
while tokens:
    cmd = tokens.popleft()
    rel = cmd.islower()
    cmd = cmd.upper()
    if cmd == 'Z':
        edges.append([len(vertices) - 1, ibeg])
        x = vertices[ibeg][0]
        y = vertices[ibeg][1]
    if cmd == 'M':
        x = float(tokens.popleft()) + (x if rel else 0)
        y = float(tokens.popleft()) + (y if rel else 0)
        vertices.append([x, y])
        ibeg = len(vertices) - 1
        face.append([ibeg])
    if cmd == 'M' or cmd == 'L':
        while not tokens[0].isalpha():
            x = float(tokens.popleft()) + (x if rel else 0)
            y = float(tokens.popleft()) + (y if rel else 0)
            vertices.append([x, y])
            i = len(vertices) - 1
            edges.append([i - 1, i])
            face[-1].append(i)

print("var %s = {" % sys.argv[2])
print("  vertices: %s," % vertices)
print("  edges: %s," % edges)
print("  faces: %s" % [face])
print("};")
