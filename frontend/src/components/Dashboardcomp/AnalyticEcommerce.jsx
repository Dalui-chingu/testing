import PropTypes from "prop-types";
import "../../elements/CardView/CardView.css";
// material-ui
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";

// project import
import MainCard from "../Dashboardcomp/MainCard";

// assets
import { RiseOutlined, FallOutlined } from "@ant-design/icons";

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const AnalyticEcommerce = ({
  color,
  title,
  count,
  percentage,
  isLoss,
  extra,
}) => (
  <>
    <div className="notification">
    <MainCard
  boxShadow
  sx={{
    p: 2.25,
    borderRadius: '15px',
  
    position: 'relative',
    overflow: 'hidden',
    background: `
      linear-gradient(109.6deg, rgb(245, 239, 249) 30.1%, rgb(207, 211, 236) 100.2%)
    `,
    boxShadow: `
      15px 15px 0 0 rgba(142, 110, 255, 0.8),
      30px 30px 0 0 rgba(208, 195, 255, 0.8)
    `,
  }}
  >
  
        <Stack spacing={0.5}>
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
          <Grid container alignItems="center">
            <Grid item>
              <Typography variant="h4" color="inherit">
                {count}
              </Typography>
            </Grid>
            {percentage && (
              <Grid item>
                <Chip
                  variant="combined"
                  color={color}
                  icon={
                    <>
                      {!isLoss && (
                        <RiseOutlined
                          style={{ fontSize: "0.75rem", color: "inherit" }}
                        />
                      )}
                      {isLoss && (
                        <FallOutlined
                          style={{ fontSize: "0.75rem", color: "inherit" }}
                        />
                      )}
                    </>
                  }
                  label={`${percentage}%`}
                  sx={{ ml: 1.25, pl: 1 }}
                  size="small"
                />
              </Grid>
            )}
          </Grid>
        </Stack>
        <Box sx={{ pt: 2.25 }}>
          <Typography variant="caption" color="textSecondary">
            {" "}
            <Typography
              component="span"
              variant="caption"
              sx={{ color: `${color || "primary"}.main` }}
            >
              {extra}
            </Typography>{" "}
          </Typography>
        </Box>
      </MainCard>
    </div>
  </>
);
AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

AnalyticEcommerce.defaultProps = {
  color: "primary",
};

export default AnalyticEcommerce;
