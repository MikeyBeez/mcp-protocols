#!/usr/bin/env python3
"""Validate a filled protocol form against its schema in forms.json.

COMPLETENESS check only: confirms every required field is present and non-empty
(plus conditional requirements). It does NOT check the fields are true — pair
with verification-loop for that.

Usage:
  form_validate.py <protocol-id> <form.json>     # validate a filled form (file or '-' for stdin)
  form_validate.py <protocol-id> -               # read the form JSON from stdin
  form_validate.py --list                        # list known forms + required fields
  form_validate.py --self-test                   # run built-in checks
Add --log to append the result to ~/Code/harness/forms_log.jsonl (an audit trail
the active-inference loop can later read).
Exit code 0 = valid, 1 = missing fields, 2 = usage/schema error.
"""
import json, os, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
FORMS = os.path.join(HERE, "forms.json")
LEDGER = os.path.expanduser("~/Code/harness/forms_log.jsonl")


def load_forms():
    return json.load(open(FORMS, encoding="utf-8"))["forms"]


def _truthy(v):
    return v is not None and str(v).strip() != ""


def validate(proto, form):
    forms = load_forms()
    if proto not in forms:
        return False, [f"(unknown protocol '{proto}'; known: {', '.join(sorted(forms))})"]
    schema = forms[proto]
    missing = [f for f in schema.get("required", []) if not _truthy(form.get(f))]
    # conditional requirements, e.g. failure_class required when outcome != success
    for field, cond in (schema.get("conditional_required") or {}).items():
        try:
            key, _, want = cond.partition("!=")
            if want.strip():  # "outcome != success"
                if str(form.get(key.strip(), "")).strip().lower() != want.strip().lower() and not _truthy(form.get(field)):
                    missing.append(f"{field} (required because {cond})")
        except Exception:
            pass
    return (len(missing) == 0), missing


def log_result(proto, ok, missing, form):
    try:
        os.makedirs(os.path.dirname(LEDGER), exist_ok=True)
        with open(LEDGER, "a", encoding="utf-8") as fh:
            fh.write(json.dumps({
                "ts": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
                "protocol": proto, "ok": ok, "missing": missing, "form": form,
            }) + "\n")
    except Exception as e:
        print("(log failed:", e, ")", file=sys.stderr)


def main(argv):
    if "--list" in argv:
        for k, v in load_forms().items():
            print(f"{k}: required={v.get('required')}")
        return 0
    if "--self-test" in argv:
        ok1, m1 = validate("intent-gate", {"intent": "x", "scope": "y", "validation": "z", "reversible": "true"})
        ok2, m2 = validate("intent-gate", {"intent": "x", "scope": "", "validation": "z"})
        ok3, m3 = validate("reflect", {"task": "t", "outcome": "failure"})  # needs failure_class
        ok4, m4 = validate("reflect", {"task": "t", "outcome": "success"})
        print("complete intent-gate -> ok:", ok1, m1)
        print("missing scope+reversible -> ok:", ok2, "missing:", m2)
        print("reflect failure w/o failure_class -> ok:", ok3, "missing:", m3)
        print("reflect success -> ok:", ok4, m4)
        return 0 if (ok1 and not ok2 and not ok3 and ok4) else 2
    args = [a for a in argv if not a.startswith("--")]
    do_log = "--log" in argv
    if len(args) < 2:
        print(__doc__); return 2
    proto, src = args[0], args[1]
    raw = sys.stdin.read() if src == "-" else open(src, encoding="utf-8").read()
    try:
        form = json.loads(raw)
    except Exception as e:
        print("FORM is not valid JSON:", e); return 2
    ok, missing = validate(proto, form)
    if do_log:
        log_result(proto, ok, missing, form)
    if ok:
        print(f"OK: '{proto}' form complete.")
        return 0
    print(f"INCOMPLETE: '{proto}' missing -> " + "; ".join(missing))
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
