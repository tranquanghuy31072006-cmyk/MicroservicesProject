import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import { getMyInfo } from "../services/userService";
import { isAuthenticated, logOut } from "../services/authenticationService";
import Scene from "./Scene";

export default function Profile() {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const getUserDetails = async () => {
      try {
        const response = await getMyInfo();
        setUserDetails(response.data.result);
      } catch (error) {
        if (error.response?.status === 401) {
          logOut();
          navigate("/login");
          return;
        }

        setErrorMessage("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, [navigate]);

  return (
      <Scene>
        {loading ? (
            <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "30px",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
            >
              <CircularProgress />
              <Typography>Loading ...</Typography>
            </Box>
        ) : errorMessage ? (
            <Typography color="error">{errorMessage}</Typography>
        ) : userDetails ? (
            <Card
                sx={{
                  minWidth: 350,
                  maxWidth: 500,
                  boxShadow: 3,
                  borderRadius: 2,
                  padding: 4,
                }}
            >
              <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "100%",
                    gap: "10px",
                  }}
              >
                <Typography sx={{ fontSize: 18, mb: "40px" }}>
                  Welcome back to Devteria, {userDetails.username} !
                </Typography>

                {[
                  ["User Id", userDetails.id],
                  ["First Name", userDetails.firstName],
                  ["Last Name", userDetails.lastName],
                  ["Date of birth", userDetails.dob],
                ].map(([label, value]) => (
                    <Box
                        key={label}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          width: "100%",
                        }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                        {label}
                      </Typography>

                      <Typography sx={{ fontSize: 14 }}>
                        {value || ""}
                      </Typography>
                    </Box>
                ))}
              </Box>
            </Card>
        ) : (
            <Typography>Profile not found.</Typography>
        )}
      </Scene>
  );
}
