// Register.js

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
import { registerUser } from "../api/auth";
import { loginSuccess } from "../store/auth/authSlice";
import { useDispatch } from "react-redux";

const Register = () => {
    const navigate = useNavigate();
    const dispatch= useDispatch();

    const [form, setForm] = useState({
        username: "",
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

        if (
            !form.username.trim() ||
            !form.email.trim() ||
            !form.password
        ) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Connect your existing register API here.
            // const response = await registerUser(form);
            const data= await registerUser(form.username, form.email, form.password);

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
                "Unable to create your account."
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

                <Box className="auth-card">

                    <Box className="auth-header">
                        <Typography className="auth-title">
                            Create your account
                        </Typography>

                        <Typography className="auth-subtitle">
                            Start collaborating with your team
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
                            label="Username"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            autoComplete="username"
                            placeholder="Your username"
                        />

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
                            autoComplete="new-password"
                            placeholder="Create a password"
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
                                "Create account"
                            )}
                        </Button>
                    </Box>

                    <Typography className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login">
                            Sign in
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

export default Register;