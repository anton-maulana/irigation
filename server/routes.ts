import * as express from 'express';

import CatCtrl from './controllers/cat';
import UserCtrl from './controllers/user';
import MarkerCtrl from './controllers/marker';

export default function setRoutes(app, pusher) {
  const router = express.Router();

  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();
  const markerCtrl = new MarkerCtrl(pusher);

  // Cats
  router.route('/cats').get(catCtrl.getAll);
  router.route('/cats/count').get(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);

  // Users
  router.route('/markers').get(markerCtrl.getAll);
  router.route('/marker/count').get(markerCtrl.count);
  router.route('/marker').post(markerCtrl.insert);
  router.route('/marker/:id').get(markerCtrl.get);
  router.route('/marker/:id').put(markerCtrl.update);
  router.route('/marker/:id').delete(markerCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);
}
