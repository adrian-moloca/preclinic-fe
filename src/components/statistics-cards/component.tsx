import {
  Box,
  Typography,
  Grid,
  Chip,
} from "@mui/material";
import { FC } from "react";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import { StatisticData } from "../../mock/statistics";
import { CardContentWrapper, StatisticCard, StatisticIconWrapper, StatisticsCardsWrapper } from "./style";

export const StatisticsCards: FC = () => {

  return (
    <StatisticsCardsWrapper container>
      {StatisticData.map((item, index) => (
        <Grid key={index}>
          <StatisticCard>
            <CardContentWrapper>
              <StatisticIconWrapper>
                <InsertChartIcon />
              </StatisticIconWrapper>
              <Chip
                label={item.percent}
                color={item.percentColor}
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            </CardContentWrapper>

            <Typography variant="caption" color="textSecondary" mt={2}>
              in last 7 Days
            </Typography>

            <Typography variant="subtitle1" mt={0.5} fontWeight="500">
              {item.title}
            </Typography>

            <Typography variant="h6" fontWeight="bold">
              {item.value}
            </Typography>

            <Box
              sx={{
                height: 40,
                mt: 1,
                borderRadius: 1,
                background: item.chartType === "bar"
                  ? `linear-gradient(to top, ${item.iconColor}, transparent)`
                  : `linear-gradient(to right, ${item.iconColor}, transparent)`,
                opacity: 0.5,
              }}
            />
          </StatisticCard>
        </Grid>
      ))}
    </StatisticsCardsWrapper>
  );
};