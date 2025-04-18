import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  useTheme,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../features/auth/authSlice';
import ProductGrid from '../pages/Products/ProductGrid';
import {
  School as SchoolIcon,
  LocalOffer as DealsIcon,
  Category as CategoriesIcon,
  Phone as ContactIcon,
  Facebook,
  Twitter,
  Instagram,
  WhatsApp
} from '@mui/icons-material';

const HomePage = () => {
  const theme = useTheme();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // Sample university categories
  const universityCategories = [
    { name: 'Vitabu na Noti', icon: <SchoolIcon /> },
    { name: 'Vifaa vya Chuo', icon: <CategoriesIcon /> },
    { name: 'Mavazi ya Chuo', icon: <DealsIcon /> },
    { name: 'Teknolojia', icon: <ContactIcon /> }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Swahili Hero Section */}
      <Box sx={{
        background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/university-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        py: { xs: 8, md: 12 },
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' }
            }}
          >
            Karibu Mwanachuo Shop
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              mb: 4,
              fontSize: { xs: '1rem', md: '1.5rem' }
            }}
          >
            Nunua na Uza vitu vyako vya chuo kwa urahisi
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Nunua Sasa
            </Button>
            {!isAuthenticated && (
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                sx={{ 
                  color: 'white',
                  borderColor: 'white',
                  minWidth: 200,
                  '&:hover': { borderColor: 'white' }
                }}
                size="large"
              >
                Jiunge Sasa
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* University Categories */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
            Kategoria Zetu
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {universityCategories.map((category, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Paper elevation={3} sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    bgcolor: theme.palette.primary.light,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    color: theme.palette.primary.contrastText
                  }}>
                    {category.icon}
                  </Box>
                  <Typography variant="h6" component="h3">
                    {category.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Products */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Bidhaa Zinazopendwa
          </Typography>
          <ProductGrid />
        </Box>

        {/* How It Works */}
        <Box sx={{ my: 6, bgcolor: 'primary.light', p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', color: 'primary.contrastText', fontWeight: 600 }}>
            Jinsi Inavyofanya Kazi
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {[
              { title: 'Jiunge', desc: 'Undi akaunti yako ya mwanachuo' },
              { title: 'Tafuta', desc: 'Pata bidhaa unazohitaji' },
              { title: 'Wasiliana', desc: 'Piga simu au tuma ujumbe' },
              { title: 'Pata', desc: 'Pata bidhaa yako kwa urahisi' }
            ].map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ 
                  textAlign: 'center',
                  color: 'primary.contrastText'
                }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1">
                    {step.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Student Testimonials - Now using useMediaQuery */}
        {isDesktop && (
          <Box sx={{ my: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
              Maoni ya Wanafunzi
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              {[
                {
                  name: 'Juma Ali',
                  uni: 'UDOM',
                  comment: 'Nimepata noti kwa urahisi sana kupitia Mwanachuo Shop!'
                },
                {
                  name: 'Neema John',
                  uni: 'UDSM',
                  comment: 'Nimeuza vitabu vyangu vya mwaka jana kwa bei nzuri.'
                },
                {
                  name: 'Rajabu M.',
                  uni: 'SUA',
                  comment: 'Huduma nzuri na watu waaminifu. Nimepata vifaa vyote nilivyohitaji.'
                }
              ].map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.uni}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Call to Action */}
        <Box sx={{ 
          my: 6,
          textAlign: 'center',
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3
        }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            {isAuthenticated ? 'Una bidhaa ya kuuza?' : 'Unahitaji kuuza bidhaa zako?'}
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
            {isAuthenticated 
              ? 'Weka bidhaa yako kwa urahisi na uipate mteja haraka'
              : 'Jiunge na mfumo wetu na uanze kuuza leo!'}
          </Typography>
          <Button
            component={Link}
            to={isAuthenticated ? '/products/create' : '/register'}
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 2, minWidth: 200 }}
          >
            {isAuthenticated ? 'Weka Bidhaa' : 'Jiunge Sasa'}
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ 
        bgcolor: 'primary.dark',
        color: 'primary.contrastText',
        py: 4,
        mt: 4
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Mwanachuo Shop
              </Typography>
              <Typography variant="body2">
                Soko la wanafunzi wa vyuo vikuvu Tanzania. Nunua na uza vitu vyako vya chuo kwa urahisi.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Viungo Muhimu
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', pl: 0 }}>
                {[
                  { text: 'Mwanzo', link: '/' },
                  { text: 'Bidhaa', link: '/products' },
                  { text: 'Kuhusu Sisi', link: '/about' },
                  { text: 'Mawasiliano', link: '/contact' }
                ].map((item, index) => (
                  <li key={index}>
                    <Button 
                      component={Link} 
                      to={item.link} 
                      sx={{ 
                        color: 'inherit',
                        justifyContent: 'flex-start',
                        px: 0
                      }}
                    >
                      {item.text}
                    </Button>
                  </li>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Tufuate
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton aria-label="Facebook" sx={{ color: 'inherit' }}>
                  <Facebook />
                </IconButton>
                <IconButton aria-label="Twitter" sx={{ color: 'inherit' }}>
                  <Twitter />
                </IconButton>
                <IconButton aria-label="Instagram" sx={{ color: 'inherit' }}>
                  <Instagram />
                </IconButton>
                <IconButton aria-label="WhatsApp" sx={{ color: 'inherit' }}>
                  <WhatsApp />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Simu: +255 123 456 789
              </Typography>
              <Typography variant="body2">
                Barua pepe: info@mwanachuoshop.co.tz
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>
            © {new Date().getFullYear()} Mwanachuo Shop. Haki zote zimehifadhiwa.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;