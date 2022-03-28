/* eslint-disable no-console */
import { spawnSync } from 'child_process';
import { basename } from 'path';
import * as semver from 'semver';
import { getPackages } from '@manypkg/get-packages';
import { read as readConfig } from '@changesets/config';
import readChangesets from '@changesets/read';
import assembleReleasePlan from '@changesets/assemble-release-plan';
import applyReleasePlan from '@changesets/apply-release-plan';

const getNewVersion = (version: string, type: 'major' | 'minor' | 'patch'): string => {
  const gitHash = spawnSync('git', ['rev-parse', '--short', 'HEAD']).stdout.toString().trimEnd();

  return semver.inc(version, `pre${type}`, true, `alpha-${gitHash}`);
};

const getRelevantChangesets = (baseBranch: string): string[] => {
  const comparePoint = spawnSync('git', ['merge-base', `origin/${baseBranch}`, 'HEAD'])
    .stdout.toString()
    .trimEnd();
  console.log('compare point', comparePoint);

  const listModifiedFiles = spawnSync('git', ['diff', '--name-only', comparePoint])
    .stdout.toString()
    .trimEnd()
    .split('\n');
  console.log('modified files', listModifiedFiles);

  const items = listModifiedFiles.filter((f) => f.startsWith('.changeset')).map((f) => basename(f, '.md'));
  console.log('items', items);

  return items;
};

const updateVersions = async (): Promise<void | never> => {
  const cwd = process.cwd();
  const packages = await getPackages(cwd);
  const config = await readConfig(cwd, packages);
  const modifiedChangesets = getRelevantChangesets(config.baseBranch);
  const changesets = (await readChangesets(cwd)).filter((change) => modifiedChangesets.includes(change.id));

  if (changesets.length === 0) {
    throw new Error('Unable to find any relevant package for canary publishing. Please make sure changesets exists!');
  }

  const releasePlan = assembleReleasePlan(changesets, packages, config, undefined, false);

  if (releasePlan.releases.length === 0) {
    throw new Error('Unable to find any relevant package for canary releasing. Please make sure changesets exists!');
  }

  for (const release of releasePlan.releases) {
    if (release.type !== 'none') {
      release.newVersion = getNewVersion(release.oldVersion, release.type);
    }
  }

  await applyReleasePlan(
    releasePlan,
    packages,
    {
      ...config,
      commit: false,
    },
    false,
    true,
  );
};

updateVersions().then(() => {
  console.info('✅  Done!');
});
