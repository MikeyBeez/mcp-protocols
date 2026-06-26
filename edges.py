#!/usr/bin/env python3
"""Typed protocol edges — query layer over edges.json.

Edges are DATA, not yet wired into the matcher (tiers stay the priority hierarchy;
prompt_process/triggers.json untouched). This makes the relationships traversable:
  edges.py neighbors <protocol>   # typed incoming + outgoing edges
  edges.py related <protocol>     # flat list of everything connected
  edges.py validate               # check endpoints resolve to a protocol .md (skills noted)
  edges.py orphans                # protocols with NO edges (excludes intentional_leaves)
  edges.py stats                  # coverage + edge counts by type
  edges.py graph                  # dump every edge
"""
import sys, os, json

HERE = os.path.dirname(os.path.abspath(__file__))
EDGES = os.path.join(HERE, "edges.json")
PROTODIR = os.path.join(HERE, "protocols")


def _data():
    return json.load(open(EDGES))


def triples():
    out = []
    for e in _data()["edges"]:
        tos = e["to"] if isinstance(e["to"], list) else [e["to"]]
        for t in tos:
            out.append((e["from"], e["type"], t))
    return out


def _protocols():
    return {os.path.splitext(x)[0] for x in os.listdir(PROTODIR) if x.endswith(".md")}


def _connected():
    c = set()
    for f, t, to in triples():
        c.add(f)
        c.add(to)
    return c


def neighbors(p):
    es = triples()
    print("# " + p)
    outg = [(t, to) for (f, t, to) in es if f == p]
    inc = [(t, f) for (f, t, to) in es if to == p]
    if outg:
        print("  outgoing:")
        for t, to in outg:
            print("    --%s--> %s" % (t, to))
    if inc:
        print("  incoming:")
        for t, f in inc:
            print("    %s --%s-->" % (f, t))
    if not outg and not inc:
        print("  (no edges)")


def related(p):
    r = set()
    for f, t, to in triples():
        if f == p:
            r.add(to)
        if to == p:
            r.add(f)
    print(" ".join(sorted(r)) or "(none)")


def validate():
    es = triples()
    known = {os.path.splitext(x)[0] for x in os.listdir(PROTODIR) if x.endswith(".md")}
    files = set(os.listdir(HERE)) | set(os.listdir(PROTODIR))
    unresolved = sorted({n for f, t, to in es for n in (f, to)
                         if n not in known and n not in files})
    print("edges:", len(es))
    print("unresolved endpoints (skills/external — expected, not in protocols/):")
    print("  " + (", ".join(unresolved) if unresolved else "none"))


def orphans():
    protos = _protocols()
    leaves = set(_data().get("intentional_leaves", []))
    connected = _connected() & protos
    unexpected = sorted(protos - connected - leaves)
    print("protocols:", len(protos), "| connected:", len(connected),
          "| intentional leaves:", len(leaves & protos))
    print("UNEXPECTED orphans (%d):" % len(unexpected))
    print("  " + (", ".join(unexpected) if unexpected else "none — graph is coherent"))
    in_leaves = sorted(leaves & protos)
    if in_leaves:
        print("intentional leaves (expected, not gaps): " + ", ".join(in_leaves))


def stats():
    es = triples()
    protos = _protocols()
    leaves = set(_data().get("intentional_leaves", []))
    connected = _connected() & protos
    by_type = {}
    for f, t, to in es:
        by_type[t] = by_type.get(t, 0) + 1
    cov = 100.0 * len(connected) / len(protos) if protos else 0.0
    print("edges: %d  |  protocols: %d  |  connected: %d (%.0f%%)  |  intentional leaves: %d"
          % (len(es), len(protos), len(connected), cov, len(leaves & protos)))
    print("by type:")
    for t in sorted(by_type):
        print("  %-13s %d" % (t, by_type[t]))
    ext = sorted({n for f, t, to in es for n in (f, to)} - protos)
    if ext:
        print("non-protocol endpoints (skills/files): " + ", ".join(ext))


def graph():
    for f, t, to in triples():
        print("%s --%s--> %s" % (f, t, to))


def main(a):
    if not a:
        print(__doc__); return
    c = a[0]
    if c == "neighbors":
        neighbors(a[1])
    elif c == "related":
        related(a[1])
    elif c == "validate":
        validate()
    elif c == "orphans":
        orphans()
    elif c == "stats":
        stats()
    elif c == "graph":
        graph()
    else:
        print("unknown command:", c)


if __name__ == "__main__":
    main(sys.argv[1:])
