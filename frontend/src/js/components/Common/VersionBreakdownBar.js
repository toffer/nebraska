import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { useTheme } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cleanSemverVersion, makeColorsForVersions } from '../../constants/helpers';

const useStyles = makeStyles({
  noBorder: {
    border: 'none',
  }
});

const useChartStyle = makeStyles(theme => ({
  chart: {
    zIndex: theme.zIndex.drawer,
  },
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

function VersionsTooltip(props) {
  const classes = useStyles();
  const {data, versions, colors} = props.versionsData;

  return (
    <div className="custom-tooltip">
      <Paper>
        <Table>
          <TableBody>
            {versions.map(version => {
              const color = colors[version];
              const value = data[version].toFixed(1);
              return (
                <TableRow key={version}>
                  <TableCell className={classes.noBorder}>
                    <span style={{color: color, fontWeight: 'bold'}}>{version}</span>
                  </TableCell>
                  <TableCell className={classes.noBorder}>
                    {value} %
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

function VersionProgressBar(props) {
  const classes = useChartStyle();
  const theme = useTheme();
  let lastVersionChannel = '';
  const otherVersionLabel = 'Other';
  const [chartData, setChartData] = React.useState({
    data: {},
    versions: [],
    colors: {},
  });

  function setup(version_breakdown, channel) {
    let data = {};
    let other = {
      versions: [],
      percentage: 0,
    };

    version_breakdown.forEach(entry => {
      const {version, percentage} = entry;
      const percentageValue = parseFloat(percentage);

      if (percentage < 10) {
        other.versions.push(version);
        other.percentage += percentageValue;
        return;
      }

      data[version] = percentageValue;
    });

    let versionColors = makeColorsForVersions(theme, Object.keys(data), channel);
    lastVersionChannel = (channel && channel.package) ? channel.package.version : null;

    if (other.percentage > 0) {
      data[otherVersionLabel] = other.percentage
      versionColors[otherVersionLabel] = theme.palette.grey['500'];
    }

    const versionsSorted = Object.keys(data).sort((version1, version2) => {
      // If the version is the channel's one, then it should come first.
      // If it's the 'Other', then it should come last.
      // Otherwise compare the number of instances.
      const cleanVersion1 = cleanSemverVersion(version1);
      const cleanVersion2 = cleanSemverVersion(version2);
      const results = {cleanVersion1: -1, cleanVersion2: 1};

      for (let version of [cleanVersion1, cleanVersion2]) {
        switch (version) {
          case lastVersionChannel:
            return results[version];
          case otherVersionLabel:
            return -results[version];
          default:
            break;
        }
      }

      return data[cleanVersion1] - data[cleanVersion2];
    });

    data['key'] = 'version_breakdown';

    setChartData({
      data: data,
      versions: versionsSorted,
      colors: versionColors,
    });
  }

  React.useEffect(() => {
    setup(props.version_breakdown, props.channel);
  },
  [props.version_breakdown, props.channel])

  return (
    <ResponsiveContainer width="95%" height={30} className={classes.container}>
      <BarChart
        layout="vertical"
        maxBarSize={10}
        data={[chartData.data]}
        className={classes.chart}
      >
        <Tooltip content={<VersionsTooltip versionsData={chartData} />} />
        <XAxis hide type="number" />
        <YAxis hide dataKey="key" type="category" />
        {chartData.versions.map((version, index) => {
          let color = chartData.colors[version];
          return (
            <Bar
              key={index}
              dataKey={version}
              stackId="1"
              fill={color}
              layout="vertical"
            />
          );
          })
        }
      </BarChart>
    </ResponsiveContainer>
  );
}

VersionProgressBar.propTypes = {
  version_breakdown: PropTypes.array.isRequired,
  channel: PropTypes.object.isRequired
}

export default VersionProgressBar
