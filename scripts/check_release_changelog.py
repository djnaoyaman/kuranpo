#!/usr/bin/env python3
"""Require a reader-facing release note for public-page/design/share changes."""
from pathlib import PurePosixPath
import os,subprocess

def needs_note(path):
    p=PurePosixPath(path)
    return (p.suffix=='.html' and (len(p.parts)==1 or p.parts[0]=='knowledge')) or path.startswith(('assets/','ogp/')) or path in {'llms.txt','llms-full.txt'}

def validate(paths):
    public=[p for p in paths if needs_note(p)]
    if public and 'changelog.html' not in paths:
        raise AssertionError('Public changes require a concise changelog.html entry before release: '+', '.join(public[:8]))

if __name__=='__main__':
    base=os.environ.get('CHANGELOG_BASE_SHA')
    if base:
        paths=subprocess.check_output(['git','diff','--name-only',base,'HEAD'],text=True).splitlines()
        validate(paths)
        print('PASS: public changes include a release-note update')
    else:
        print('SKIP PR-diff gate: no base SHA (unit tests still cover the policy)')
