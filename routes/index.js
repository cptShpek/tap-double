import users from './users';
import events from './events';
import referrals from './referrals';
import guests from './guests';

export default (app, io) => {
  // Mount routers
  app.get('/api/v1/', (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome to the DappDouble API v1' });
  });
  // app.use("/api/v1/auth", auth);
  app.use('/api/v1/users', users);
  app.use('/api/v1/events', events(io));
  app.use('/api/v1/referrals', referrals);
  app.use('/api/v1/guests', guests);
};
