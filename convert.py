#!/bin/python3

# ./convert.py model.obj > model.js
# Converts .obj to a js file that contains a vertex list and a face list.
# The video below uses an OBJ that is converted to this javascript file and a wireframe is rendered. I wanted to replicate it. 
# https://www.youtube.com/watch?v=qjWkNZ0SXfo 

# you can translate the model 
# ./convert.py model.obj 0 -0.5 0 > model.js
#                        ^   ^  ^
#                        X   Y  Z

import sys

def parse_obj(path, x_translation, y_translation, z_translation):
    vertices = []
    faces = []

    with open(path, "r") as f:
        for line in f:
            if line.startswith("v "):
                _, x, y, z = line.split()
                vertices.append(
                        (
                            # v′ = v + t
                            # this lets us move the model during conversion.
                         (float(x) + x_translation),
                         (float(y) + y_translation),
                         (float(z) + z_translation)
                         ))

            elif line.startswith("f "):
                parts = line.split()[1:]
                face = []
                for p in parts:
                    # Handles v, v/vt, v/vt/vn
                    idx = int(p.split("/")[0]) - 1
                    face.append(idx)

                # Triangulate quads/ngons
                for i in range(1, len(face) - 1):
                    faces.append([face[0], face[i], face[i + 1]])

    return vertices, faces


def main():

    if len(sys.argv) > 2:
        # pass file and translations into func
        vs, fs = parse_obj(sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]))
    else:
        vs, fs = parse_obj(sys.argv[1], 0, 0, 0)

    #  output js format to pipe into a js file.
    print("const vs = [")
    for v in vs:
        print(f"  {{x: {v[0]:.6f}, y: {v[1]:.6f}, z: {v[2]:.6f}}},")
    print("];\n")

    print("const fs = [")
    for f in fs:
        print(f"  [{f[0]}, {f[1]}, {f[2]}],")
    print("];")

if (__name__ == "__main__"):
    main()
