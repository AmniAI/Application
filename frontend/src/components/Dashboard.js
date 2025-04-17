import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/authService';
// Update imports at the top
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper,
  CircularProgress,
  TextField,
  Grid,
  Alert,
  Collapse  // Add this
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Dashboard = () => {
  // Add these with other state declarations at the top
  const [predictionMode, setPredictionMode] = useState('simple');
  
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState({
    accelerations: '',
    fetal_movement: '',
    uterine_contractions: '',
    light_decelerations: '',
    severe_decelerations: '',
    prolongued_decelerations: '',
    abnormal_short_term_variability: '',
    mean_value_of_short_term_variability: '',
    percentage_of_time_with_abnormal_long_term_variability: '',
    mean_value_of_long_term_variability: '',
    histogram_width: '',
    histogram_min: '',
    histogram_max: '',
    histogram_number_of_peaks: '',
    histogram_number_of_zeroes: '',
    histogram_mode: '',
    histogram_mean: '',
    histogram_median: '',
    histogram_variance: '',
    histogram_tendency: ''
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionError, setPredictionError] = useState('');

  // Move these constants inside the component
  const mainInputs = ['accelerations', 'fetal_movement', 'uterine_contractions'];
  const advancedInputs = Object.keys(predictionData).filter(key => !mainInputs.includes(key));

  const handleInputChange = (e) => {
    setPredictionData({
      ...predictionData,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async () => {
    // Add validation
    const emptyFields = Object.entries(predictionData)
      .filter(([_, value]) => value === '')
      .map(([key, _]) => key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));

    if (emptyFields.length > 0) {
      setPredictionError(`Please fill in all fields. Missing: ${emptyFields.join(', ')}`);
      return;
    }

    try {
      // Convert all values to numbers
      const numericalData = Object.fromEntries(
        Object.entries(predictionData).map(([key, value]) => [key, parseFloat(value)])
      );

      const response = await axios.post('http://localhost:8000/api/predict', numericalData, {
        headers: {
          Authorization: `Bearer ${authService.getCurrentUser().access_token}`
        }
      });
      setPredictionResult(response.data);
      setPredictionError('');
    } catch (error) {
      console.error('Prediction error:', error.response?.data || error.message);
      setPredictionError(
        error.response?.data?.detail || 
        'Server error occurred. Please check if all values are within valid ranges.'
      );
      setPredictionResult(null);
    }
  };

  // Add this with other handlers
  const handleSimplePredict = async () => {
    const simpleData = {
      accelerations: predictionData.accelerations,
      fetal_movement: predictionData.fetal_movement,
      uterine_contractions: predictionData.uterine_contractions
    };

    try {
      const response = await axios.post('http://localhost:8000/api/predict-simple', simpleData, {
        headers: {
          Authorization: `Bearer ${authService.getCurrentUser().access_token}`
        }
      });
      setPredictionResult(response.data);
      setPredictionError('');
    } catch (error) {
      console.error('Prediction error:', error.response?.data || error.message);
      setPredictionError(
        error.response?.data?.detail || 
        'Server error occurred. Please check if all values are within valid ranges.'
      );
      setPredictionResult(null);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = authService.getCurrentUser();
      
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.get('http://localhost:8000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        });
        
        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch user details');
        setLoading(false);
        
        // If token is expired or invalid, redirect to login
        if (error.response && error.response.status === 401) {
          authService.logout();
          navigate('/login');
        }
      }
    };
    
    fetchUserDetails();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container 
      component="main" 
      maxWidth={false} // Changed from "md" to false to allow full width
      sx={{ 
        bgcolor: 'rgb(228, 254, 221)',
        minHeight: '100vh',
        py: 4,
        px: { xs: 2, sm: 4, md: 6 } // Add responsive padding
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '1800px', // Add maximum width to maintain readability
        mx: 'auto' // Center the content
      }}>
        <Typography component="h1" variant="h4" gutterBottom color="rgb(47, 52, 52)">
          Dashboard
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {userDetails && (
          <>
            <Paper elevation={3} sx={{ 
              p: 3, 
              width: '100%', 
              mb: 3,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '10px'
            }}>
              <Typography variant="h6" gutterBottom color="#2E7D32">
                User Information
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {userDetails.full_name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {userDetails.email}
              </Typography>
              <Typography variant="body1">
                <strong>Role:</strong> {userDetails.role}
              </Typography>
            </Paper>

            {userDetails.role === 'doctor' && (
              <Paper elevation={3} sx={{ 
                p: 3, 
                width: '100%', 
                mb: 3,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '10px'
              }}>
                <Typography variant="h6" gutterBottom color="#2E7D32">
                  Fetal Health Prediction
                </Typography>
                
                {/* Mode Selection Buttons */}
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant={predictionMode === 'simple' ? 'contained' : 'outlined'}
                    onClick={() => setPredictionMode('simple')}
                    sx={{ mr: 2 }}
                  >
                    Simple Mode
                  </Button>
                  <Button
                    variant={predictionMode === 'advanced' ? 'contained' : 'outlined'}
                    onClick={() => setPredictionMode('advanced')}
                  >
                    Advanced Mode
                  </Button>
                </Box>

                {/* Main Inputs */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {mainInputs.map((key) => (
                    <Grid item xs={12} sm={4} key={key}>
                      <TextField
                        fullWidth
                        required
                        label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        name={key}
                        type="number"
                        value={predictionData[key]}
                        onChange={handleInputChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'white',
                            borderRadius: '10px'
                          }
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
                
                {/* Show advanced options only in advanced mode */}
                {predictionMode === 'advanced' && (
                  <>
                    <Button
                      startIcon={<ExpandMoreIcon 
                        sx={{ 
                          transform: showAdvancedOptions ? 'rotate(180deg)' : 'rotate(0)',
                          transition: 'transform 0.3s'
                        }} 
                      />}
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                      sx={{ mb: 2 }}
                    >
                      {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
                    </Button>
                    
                    <Collapse in={showAdvancedOptions}>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        {advancedInputs.map((key) => (
                          <Grid item xs={12} sm={6} key={key}>
                            <TextField
                              fullWidth
                              required
                              label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              name={key}
                              type="number"
                              value={predictionData[key]}
                              onChange={handleInputChange}
                              helperText="Required for prediction"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  bgcolor: 'white',
                                  borderRadius: '10px'
                                }
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Collapse>
                  </>
                )}

                <Button
                  variant="contained"
                  onClick={predictionMode === 'simple' ? handleSimplePredict : handlePredict}
                  sx={{
                    mt: 3,
                    bgcolor: 'rgb(47, 52, 52)',
                    '&:hover': { bgcolor: 'rgba(47, 52, 52, 0.8)' },
                    borderRadius: '10px'
                  }}
                >
                  Predict
                </Button>
                
                {/* Remove the duplicate advanced options section and keep only the prediction results */}
                {predictionResult && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" color="#2E7D32">
                      Prediction Result
                    </Typography>
                    <Typography>
                      Status: {predictionResult.prediction}
                    </Typography>
                    <Typography>
                      Confidence: {predictionResult.confidence.toFixed(2)}%
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      Probabilities:
                    </Typography>
                    {Object.entries(predictionResult.probabilities).map(([key, value]) => (
                      <Typography key={key}>
                        {key}: {value.toFixed(2)}%
                      </Typography>
                    ))}
                  </Box>
                )}
                {predictionError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {predictionError}
                  </Alert>
                )}
              </Paper>
            )}
          </>
        )}
        
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            bgcolor: 'rgb(47, 52, 52)',
            '&:hover': { bgcolor: 'rgba(47, 52, 52, 0.8)' },
            borderRadius: '10px'
          }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;