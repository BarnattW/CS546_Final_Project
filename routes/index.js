import customersRoutes from './customers.js';
import sellersRoutes from './sellers.js';
import reviewsRoutes from './reviews.js';
import commentsRoutes from './comments.js';
import ordersRoutes from './orders.js';
import pagesRoutes from './pages.js';
import searchRoutes from './search.js';

const routeConfig = (app) => {
  app.use('/', pagesRoutes);
  app.use('/customers', customersRoutes);
  app.use('/sellers', sellersRoutes);
  app.use('/reviews', reviewsRoutes);
  app.use('/comments', commentsRoutes);
  app.use('/orders', ordersRoutes);
  app.use('/search', searchRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route Not found' });
  });
};

export default routeConfig;
