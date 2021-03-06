import amber from '@material-ui/core/colors/amber';
import deepOrange from '@material-ui/core/colors/deepOrange';
import lime from '@material-ui/core/colors/lime';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import moment from 'moment';

// Indexes/keys for the architectures need to match the ones in
// pkg/api/arches.go.
export const ARCHES = {
  0: 'ALL',
  1: 'AMD64',
  2: 'ARM64',
  3: 'X86',
};

const colors = makeColors();

function makeColors() {
  let colors = [];

  const colorScheme = [lime, amber, orange, deepOrange, red];

  // Create a color list for versions to pick from.
  colorScheme.forEach(color => {
    // We choose the shades beyond 300 because they should not be too
    // light (in order to improve contrast).
    for (let i = 3; i <= 9; i+=2) {
      colors.push(color[i * 100]);
    }
  });

  return colors;
}

export function cleanSemverVersion(version) {
  let shortVersion = version
  if (version.includes("+")) {
    shortVersion = version.split("+")[0]
  }
  return shortVersion
}

export function makeLocaleTime(timestamp, formats={}) {
  const {dateFormat='L', timeFormat='LT'} = formats;
  let localeDateFormat = dateFormat ? dateFormat : '';
  let localeTimeFormat = timeFormat ? timeFormat : '';
  let format = localeDateFormat;

  if (format != '' && localeTimeFormat)
    format += ' ';
  format += localeTimeFormat;

  return moment.utc(timestamp).local().format(format, moment.locale());
}

export function makeColorsForVersions(theme, versions, channel=null) {
  let versionColors = {};
  let colorIndex = 0;
  let latestVersion = null;

  if (channel && channel.package) {
    latestVersion = cleanSemverVersion(channel.package.version);
  }

  for (let i = versions.length - 1; i >= 0; i--) {
    let version = versions[i];
    let cleanVersion = cleanSemverVersion(version);

    if (cleanVersion == latestVersion) {
      versionColors[cleanVersion] = theme.palette.success.main;
    } else {
      versionColors[cleanVersion] = colors[colorIndex++ % colors.length];
    }
  }

  return versionColors;
}
