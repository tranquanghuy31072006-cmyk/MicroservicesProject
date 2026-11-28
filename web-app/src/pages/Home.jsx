
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import { isAuthenticated, logOut } from "../services/authenticationService";
import Scene from "./Scene";
import Post from "../components/Post";
import { getMyPosts } from "../services/postService";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const observer = useRef(null);
    const loadingRef = useRef(false);

    // Load posts whenever the requested page changes.
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login");
            return;
        }

        const controller = new AbortController();

        const loadPosts = async () => {
            loadingRef.current = true;
            setLoading(true);
            setErrorMessage("");

            try {
                const response = await getMyPosts(page, controller.signal);
                const result = response.data.result;

                if (!result || !Array.isArray(result.data)) {
                    throw new Error("Invalid posts response");
                }

                const newPosts = result.data;
                const totalPages = result.totalPages || 0;

                setPosts((previousPosts) =>
                    page === 1 ? newPosts : [...previousPosts, ...newPosts]
                );

                setHasMore(page < totalPages && newPosts.length > 0);
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                if (error.response?.status === 401) {
                    logOut();
                    navigate("/login");
                    return;
                }

                setHasMore(false);
                setErrorMessage("Unable to load posts. Please try again.");
            } finally {
                if (!controller.signal.aborted) {
                    loadingRef.current = false;
                    setLoading(false);
                }
            }
        };

        loadPosts();

        return () => {
            controller.abort();
            observer.current?.disconnect();
        };
    }, [navigate, page]);

    // Observe the last post to trigger loading the next page.
    const lastPostElementRef = useCallback(
        (node) => {
            if (observer.current) {
                observer.current.disconnect();
            }

            if (!node || loading || !hasMore) {
                return;
            }

            observer.current = new IntersectionObserver((entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !loadingRef.current
                ) {
                    loadingRef.current = true;
                    setPage((previousPage) => previousPage + 1);
                }
            });

            observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <Scene>
            <Card
                sx={{
                    width: "100%",
                    minWidth: 500,
                    maxWidth: 600,
                    boxShadow: 3,
                    borderRadius: 2,
                    padding: "20px",
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
                    <Typography
                        sx={{
                            fontSize: 18,
                            mb: "10px",
                        }}
                    >
                        Your posts
                    </Typography>

                    {posts.map((post, index) => (
                        <Post
                            ref={index === posts.length - 1 ? lastPostElementRef : null}
                            key={post.id}
                            post={post}
                        />
                    ))}

                    {loading && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <CircularProgress size="24px" />
                        </Box>
                    )}

                    {errorMessage && (
                        <Typography color="error">
                            {errorMessage}
                        </Typography>
                    )}

                    {!loading && !errorMessage && posts.length === 0 && (
                        <Typography>No posts available.</Typography>
                    )}
                </Box>
            </Card>
        </Scene>
    );
}
