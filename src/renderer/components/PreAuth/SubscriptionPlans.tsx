// src/renderer/components/PreAuth/SubscriptionPlans.tsx

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import useAuth from '../../hooks/useAuth'; // Ensure correct import path
import './SubscriptionPlans.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

interface Feature {
  name: string;
}

interface Plan {
  name: string;
  price: string;
  features: { [key: string]: boolean };
  isPopular?: boolean;
  level: number; // Added level to match subscriptionLevel
}

const SubscriptionPlans: React.FC = () => {
  const { hasSubscription, subscriptionLevel } = useAuth(); // Destructure subscriptionLevel from useAuth
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Master list of features
  const masterFeatures: Feature[] = [
    { name: '5 Reports per Month' },
    { name: 'Unlimited Reports' },
    { name: 'Export to Multiple Formats (PDF, DOCX)' },
    { name: 'Freeform Input' },
    { name: '24/7 Priority Support' },
  ];

  // Define plans with feature inclusions and levels
  const plans: Plan[] = [
    {
      name: 'Free',
      price: '0',
      features: {
        '5 Reports per Month': true,
        'Unlimited Reports': false,
        'Export to Multiple Formats (PDF, DOCX)': false,
        'Freeform Input': false,
        '24/7 Priority Support': false,
      },
      level: 0,
    },
    {
      name: 'Plus',
      price: '10.00',
      features: {
        '5 Reports per Month': true,
        'Unlimited Reports': true,
        'Export to Multiple Formats (PDF, DOCX)': false,
        'Freeform Input': false,
        '24/7 Priority Support': false,
      },
      isPopular: true,
      level: 1,
    },
    {
      name: 'Pro',
      price: '20.00',
      features: {
        '5 Reports per Month': true,
        'Unlimited Reports': true,
        'Export to Multiple Formats (PDF, DOCX)': true,
        'Freeform Input': true,
        '24/7 Priority Support': true,
      },
      level: 2,
    },
  ];

  const stripePaymentLinkPro = 'https://buy.stripe.com/aEU4iyaDH7RPcmIbIM';
  const stripePaymentLinkPlus = 'https://buy.stripe.com/9AQbL0cLP2xvgCY7st';

  const handleSubscribeClick = (plan: Plan) => {
    if (plan.level === 0) {
      navigate('/'); // Navigate to main app
    } else if (plan.level === 1) {
      window.open(stripePaymentLinkPlus, '_blank');
    } else if (plan.level === 2) {
      window.open(stripePaymentLinkPro, '_blank');
    }
  };

  const handleBackToApp = () => {
    navigate('/'); // Navigate to main app
  };

  return (
    <Box className="subscription-plans-container">
      {/* Header with Title */}
      <Box className="subscription-header">
        <Typography variant="h4" component="h1" className="subscription-title">
          Choose Your Plan
        </Typography>
      </Box>

      {/* Subscription Plans Grid */}
      <Box className="subscription-main">
        <div className="plans-grid">
          {plans.map((plan) => {
            const isCurrentPlan = subscriptionLevel === plan.level;

            // Debugging Logs
            console.log(
              `Plan: ${plan.name}, Level: ${plan.level}, isCurrentPlan: ${isCurrentPlan}`,
            );

            return (
              <div className="plan-card-container" key={plan.name}>
                {plan.isPopular && !isCurrentPlan && (
                  <div className="popular-badge">Most Popular</div>
                )}
                {isCurrentPlan && (
                  <div className="current-badge">Current Plan</div>
                )}
                <Card
                  className={`plan-card ${
                    plan.isPopular ? 'popular' : ''
                  } ${isCurrentPlan ? 'current' : ''}`}
                >
                  <CardContent className="card-content">
                    <Typography
                      variant="h5"
                      component="div"
                      gutterBottom
                      className="plan-name"
                    >
                      {plan.name}
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      gutterBottom
                      className="plan-price"
                    >
                      ${plan.price}
                      <Typography
                        variant="subtitle1"
                        component="span"
                        className="plan-duration"
                      >
                        /month
                      </Typography>
                    </Typography>
                    <List className="plan-features">
                      {masterFeatures.map((feature) => (
                        <ListItem
                          key={feature.name}
                          disableGutters
                          className="plan-feature"
                        >
                          <ListItemIcon className="feature-icon">
                            {plan.features[feature.name] ? (
                              <CheckCircle
                                className="icon-included"
                                aria-label="Included"
                              />
                            ) : (
                              <Cancel
                                className="icon-excluded"
                                aria-label="Not Included"
                              />
                            )}
                          </ListItemIcon>
                          <ListItemText primary={feature.name} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <Box className="card-footer">
                    <Button
                      variant={
                        plan.level === 0 || isCurrentPlan
                          ? 'outlined'
                          : 'contained'
                      }
                      onClick={() => handleSubscribeClick(plan)}
                      aria-label={`${
                        isCurrentPlan ? 'Current Plan' : 'Subscribe to'
                      } the ${plan.name} plan`}
                      className={`subscribe-button ${
                        plan.level === 0 || isCurrentPlan
                          ? 'outlined'
                          : 'contained'
                      }`}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan
                        ? 'Current Plan'
                        : plan.level === 0
                          ? 'Get Started'
                          : 'Subscribe Now'}
                    </Button>
                  </Box>
                </Card>
              </div>
            );
          })}
        </div>
      </Box>
      <Button
        variant="contained"
        onClick={handleBackToApp}
        className="back-to-app-button"
        aria-label="Back to App"
      >
        Back to App
      </Button>
    </Box>
  );
};

export default SubscriptionPlans;
