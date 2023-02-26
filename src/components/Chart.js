import React, { useContext } from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "./Title";
import { UserContext } from "../providers/UserProvider";
import { LeaderboardContext } from "../providers/LeaderboardProvider";
import { GlobalContext } from "../providers/GlobalProvider";
// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

// Generate Order Data
function createRowData(name, timestamp, topic, points) {
  return { name, timestamp, topic, points };
}

function formatTimestamp(timestamp) {
  let date = new Date(timestamp.seconds * 1000);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export default function Chart() {
  const theme = useTheme();

  const globalState = useContext(GlobalContext);
  const userState = useContext(UserContext);
  const userChallenges = useContext(LeaderboardContext).users[
    userState.user.uid
  ].solvedChallenges;
  let rows = [];
  userChallenges.forEach((challenge) => {
    if (challenge.name in globalState.challenges) {
      let c = globalState.challenges[challenge.name];
      rows.push(
        createRowData(challenge.name, challenge.timestamp, c.topic, c.points)
      );
    }
  });
  let score = 0;
  let data = rows.map((row) => {
    score += row.points;
    return createData(formatTimestamp(row.timestamp), score);
  });
  data.unshift(
    createData(formatTimestamp(userState.doc.data().createdTimestamp), 0)
  );

  return (
    <React.Fragment>
      <Title>Progression</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 42,
            bottom: 0,
            left: 24,
          }}
          style={{
            fontSize: "15px",
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: "middle", fill: theme.palette.text.primary }}
            >
              Score
            </Label>
          </YAxis>
          <Line
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
