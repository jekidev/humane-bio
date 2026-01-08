# HumaneBio Project TODO

## Frontend - Public Pages
- [x] Age verification modal on entry
- [x] Homepage with animated HUD elements and hero section
- [x] Navigation menu (top nav with Home, Products, Blog, About, Member Login)
- [x] Product catalog page (Nootropics section, Peptide section)
- [x] Product detail page with scientific papers/research links
- [x] Blog listing page
- [ ] Blog post detail page
- [x] About page
- [x] Contact page (Mail, Discord, Telegram, WhatsApp)

## Frontend - Member Portal
- [x] Member login/registration
- [x] Member dashboard
- [x] View order history
- [x] View pending orders
- [x] View discounts/rewards

## Frontend - Shopping
- [x] Product cart
- [ ] Checkout page
- [ ] Stripe payment integration

## Frontend - Chat Assistant
- [x] Chat widget in bottom-right corner
- [x] Initial greeting asking about building perfect stack
- [ ] LLM-powered product recommendations
- [x] Newsletter signup prompt in chat
- [x] Chat history management

## Backend - Database Schema
- [ ] Products table (Nootropics & Peptides)
- [ ] Product details (description, image, scientific links)
- [ ] Orders table
- [ ] Order items table
- [ ] Users table (already exists)
- [ ] Chat history table
- [ ] Newsletter subscribers table
- [ ] Admin settings table (LLM API, contact info, etc.)

## Backend - API Routes
- [ ] Product listing and filtering
- [ ] Product details with scientific data
- [ ] Order creation and management
- [ ] Chat message handling with LLM integration
- [ ] Newsletter subscription
- [ ] User profile and order history

## Admin Panel
- [x] Dashboard overview
- [x] Product management (upload images, edit descriptions, manage scientific links)
- [ ] Background image management
- [x] Order management (view paid orders with shipping info)
- [x] Chat settings (LLM API configuration, system prompt)
- [x] Chat history viewing
- [x] Contact information management (Mail, Discord, Telegram, WhatsApp)
- [ ] File upload system (S3 integration or Google Drive/Dropbox)
- [ ] Newsletter subscriber management
- [x] Admin API routes with role-based access control
- [x] Comprehensive admin tests (27 tests passing)

## Design & Styling
- [x] HUD-inspired animated elements throughout site
- [x] Molecular structure graphics (transparent, 20% opacity)
- [x] Professional color scheme with transparency
- [x] Responsive design
- [x] Animated backgrounds using provided videos
- [x] Smooth transitions and micro-interactions
- [x] Animated video backgrounds on hero section
- [x] HUD widget components with animations
- [x] Animated molecular structure overlays
- [x] Animated data visualization widgets
- [x] Animated corner brackets and scan lines
- [x] Floating particle animations
- [x] Animated progress bars and gauges
- [ ] Animated radar/compass elements

## Integrations
- [ ] Stripe payment processing
- [ ] LLM API integration (configurable in admin)
- [ ] S3 file storage
- [ ] Google Drive/Dropbox integration (optional)

## Testing & Deployment
- [ ] Unit tests for critical functions
- [ ] E2E testing for checkout flow
- [ ] Performance optimization
- [ ] Security review (payment, auth, data)
- [ ] Final deployment

## Product Data
- [ ] Bromantan (Nootropic)
- [ ] Agmantine Sulfate (Nootropic)
- [ ] Phenyl Piracetam (Nootropic)
- [ ] 9-me-bc (Nootropic)
- [ ] Modafinil (Nootropic)
- [ ] BPC 156 (Peptide)
- [ ] TB500 (Peptide)
- [ ] Glutathion (Peptide)
- [ ] Semax/Selank (Peptide)


## Stripe Payment Integration
- [x] Add Stripe feature to project
- [x] Configure Stripe API keys in environment
- [x] Create cart management system
- [x] Build shopping cart page
- [x] Create checkout page with Stripe Elements
- [x] Implement payment intent creation
- [ ] Handle payment success/failure
- [ ] Create order confirmation page
- [ ] Send order confirmation emails
- [ ] Implement webhook handling for payment events
- [ ] Test Stripe integration with test cards
- [x] Cart and checkout API routes (39 tests passing)
- [x] Cart and checkout UI pages


## Product Image Upload & Pricing
- [x] S3 image upload endpoint
- [x] Image upload UI component with preview
- [x] Integrate image upload into admin panel
- [x] Add pricing editor to admin panel
- [x] Test image upload and pricing updates (7 new tests passing)


## Review & Rating System
- [x] Database schema for reviews and ratings
- [x] Backend API routes for submitting reviews
- [x] Backend API routes for retrieving reviews
- [x] Review UI component with star ratings
- [x] Review list with filtering and sorting
- [x] Admin panel review moderation
- [x] Average rating calculation and display
- [x] Review validation and spam prevention
- [x] User verification for reviews (purchased customers only)
- [x] Review tests (17+ tests)
