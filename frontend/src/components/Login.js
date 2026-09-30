// Login.js

import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    Alert,
    CircularProgress,
} from "@mui/material";
import {
    Eye,
    EyeOff,
    FileText,
    ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../api/auth";
import { loginSuccess } from "../store/auth/authSlice";

import "../styles/auth.css";
import { useDispatch } from "react-redux";

const Login = () => {
    const navigate = useNavigate();
    const dispatch= useDispatch();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && token!=="undefined") {
            navigate("/");
        }
        // eslint-disable-next-line
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });

        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.email.trim() || !form.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Connect your existing login API here.
            // const response = await loginUser(form);
            const data= await loginUser(form.email, form.password);

            // if(data.success){
              localStorage.setItem("token", data.data.token);
              dispatch(loginSuccess(data.data.user));
              navigate("/");
            // }
            // else{
            //   alert(data.error);
            // }

        } catch (error) {
            setError(
                error.message ||
                "Unable to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="auth-page">
            <Box className="auth-background">
                <Box className="auth-glow auth-glow-one" />
                <Box className="auth-glow auth-glow-two" />
            </Box>

            <Box className="auth-container">

                {/* Logo */}
                <Box className="auth-brand">
                    <Box className="auth-logo">
                        <FileText size={22} />
                    </Box>

                    <Typography className="auth-brand-name">
                        collabSpace
                    </Typography>
                </Box>

                {/* Card */}
                <Box className="auth-card">

                    <Box className="auth-header">
                        <Typography className="auth-title">
                            Welcome back
                        </Typography>

                        <Typography className="auth-subtitle">
                            Sign in to continue to your workspace
                        </Typography>
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            className="auth-alert"
                        >
                            {error}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        className="auth-form"
                    >
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            placeholder="you@example.com"
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={19} />
                                            ) : (
                                                <Eye size={19} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            className="auth-submit"
                            endIcon={
                                !loading && (
                                    <ArrowRight size={18} />
                                )
                            }
                        >
                            {loading ? (
                                <CircularProgress
                                    size={22}
                                    color="inherit"
                                />
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </Box>

                    <Typography className="auth-switch">
                        Don't have an account?{" "}
                        <Link to="/register">
                            Create one
                        </Link>
                    </Typography>

                </Box>

                <Typography className="auth-footer">
                    © {new Date().getFullYear()} collabSpace
                </Typography>
            </Box>
        </Box>
    );
};

export default Login;