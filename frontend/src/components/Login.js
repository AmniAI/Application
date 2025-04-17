import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Link, 
  Alert,
  IconButton,
  InputAdornment 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (error) {
      const resMessage =
        (error.response?.data?.detail) || error.message || error.toString();
      setLoading(false);
      setMessage(resMessage);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: 'rgb(228, 254, 221)'  // Light green background
    }}>
      {/* Left side - Image and tagline */}
      <Box sx={{ 
        flex: 1, 
        bgcolor: 'rgb(47, 52, 52)',  // Dark green
        p: 4,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundImage: 'url(/ultra.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}>
        <Typography variant="h1" color="white" sx={{ mb: 2, fontFamily: 'Arial', fontSize:'6rem'}}>
          Amniotic Fluid Analysis
        </Typography>
        <Typography variant="h4" color="white" sx={{ fontFamily: 'Arial', fontSize:'2rem'}}>
          Advanced Healthcare Monitoring
        </Typography>
      </Box>

      {/* Right side - Login form */}
      <Box sx={{ 
        flex: 1, 
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom right, rgba(228, 254, 221, 0.95), rgba(228, 254, 221, 0.9))'
      }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h3" color="rgb(47, 52, 52)" sx={{ mb: 4, fontFamily: 'Arial' }}>
            Login 
          </Typography>
          
          {message && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '10px',
                  // borderWidth: '0px',
                  '& fieldset': { 
                    borderColor: 'rgba(47, 52, 52, 0.5)',
                    borderRadius: '10px',
                    // borderWidth: '0px',
                  },
                  '&:hover fieldset': { 
                    background: 'rgba(47, 52, 52, 0.05)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgb(47, 52, 52)',
                    borderWidth: '1px',
                  }
                },
                '& .MuiInputLabel-root': { 
                  color: 'rgba(47, 52, 52, 0.8)',
                  '&.Mui-focused': {
                    color: 'rgb(47, 52, 52)'
                  }
                },
                '& input': { 
                  color: 'rgb(47, 52, 52)',
                  padding: '16px 14px'
                },
                mb: 2
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgb(47, 52, 52)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '10px',
                  // borderWidth: '0px',
                  '& fieldset': { 
                    borderColor: 'rgba(47, 52, 52, 0.5)',
                    borderRadius: '10px',
                    // borderWidth: '0px',
                  },
                  '&:hover fieldset': { 
                    background: 'rgba(47, 52, 52, 0.05)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgb(47, 52, 52)',
                    borderWidth: '1px',
                  }
                },
                '& .MuiInputLabel-root': { 
                  color: 'rgba(47, 52, 52, 0.8)',
                  '&.Mui-focused': {
                    color: 'rgb(47, 52, 52)'
                  }
                },
                '& input': { 
                  color: 'rgb(47, 52, 52)',
                  padding: '16px 14px'
                },
                mb: 2
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: 'rgb(47, 52, 52)',
                '&:hover': { bgcolor: 'rgba(47, 52, 52, 0.8)' },
                height: '48px',
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '16px'
              }}
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link 
                href="/register" 
                sx={{ 
                  color: 'rgb(47, 52, 52)',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;