import React, { forwardRef } from "react";
import { Avatar, Box, Typography } from "@mui/material";

const Post = forwardRef(({ post }, ref) => {
    const { userId, createdDate, content } = post;

    return (
        <Box
            ref={ref}
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    width: "100%",
                    marginBottom: 2,
                }}
            >
                <Avatar sx={{ marginRight: 2 }}>
                    {userId ? userId.charAt(0).toUpperCase() : "U"}
                </Avatar>

                <Box>
                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                    >
                        User ID: {userId}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 400,
                            color: "text.secondary",
                            marginBottom: 1,
                        }}
                    >
                        {createdDate
                            ? new Date(createdDate).toLocaleString()
                            : ""}
                    </Typography>

                    <Typography sx={{ fontSize: 14 }}>
                        {content}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
});

export default Post;
