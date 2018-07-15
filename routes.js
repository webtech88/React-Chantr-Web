const nextRoutes = require('next-routes');

module.exports = nextRoutes();
const routes = module.exports;

routes.add('card', '/card/:id');
routes.add('signature', '/card/:id/signature');
routes.add('profile', '/profile/:id');
routes.add('notification', '/notification/:type');
routes.add('reset_password', '/account/resetpw_confirm/:id');
routes.add('account_activate', '/account/activate/:id');
routes.add('youtuber', '/youtuber/:step');
routes.add('youtuber_channels', '/youtuber_channels/:step');
routes.add('usecases', '/usecases/:case');
routes.add('explore', '/what_is_wishyoo');
routes.add('featured_cards', '/public_cards');
routes.add('delete_signature', '/signatures/:id/delete')
routes.add('delete_block_signature', '/signatures/:id/delete/block')
