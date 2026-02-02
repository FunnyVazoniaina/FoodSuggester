import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import {
  GetApp as InstallIcon,
  Close as CloseIcon,
  Smartphone as PhoneIcon
} from '@mui/icons-material';
import { usePWA } from '../hooks/usePWA';

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [showDialog, setShowDialog] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleInstall = async () => {
    const success = await installApp();
    setShowDialog(false);
    
    if (success) {
      setShowSuccessMessage(true);
    }
  };

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  // Ne pas afficher si déjà installé
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Bouton flottant d'installation */}
      {isInstallable && (
        <Fab
          color="primary"
          aria-label="installer l'application"
          onClick={handleOpenDialog}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            bgcolor: '#FF6B35',
            '&:hover': {
              bgcolor: '#E85826'
            }
          }}
        >
          <InstallIcon />
        </Fab>
      )}

      {/* Dialog d'installation */}
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ mr: 1, color: '#FF6B35' }} />
            Installer KitchenApp
          </Box>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" paragraph>
            Installez KitchenApp sur votre appareil pour une expérience optimale :
          </Typography>
          
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              ✨ Accès rapide depuis votre écran d'accueil
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              🚀 Chargement plus rapide
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              📱 Fonctionne hors ligne
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              🔔 Notifications de nouvelles recettes
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            L'installation ne prend que quelques secondes et ne nécessite aucun téléchargement depuis un store.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Plus tard
          </Button>
          <Button
            onClick={handleInstall}
            variant="contained"
            startIcon={<InstallIcon />}
            sx={{
              bgcolor: '#FF6B35',
              '&:hover': {
                bgcolor: '#E85826'
              }
            }}
          >
            Installer maintenant
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message de succès */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={4000}
        onClose={() => setShowSuccessMessage(false)}
      >
        <Alert
          onClose={() => setShowSuccessMessage(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          KitchenApp a été installée avec succès ! 🎉
        </Alert>
      </Snackbar>
    </>
  );
};

export default PWAInstallPrompt;
