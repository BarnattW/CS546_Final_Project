import express from 'express';
import routeConfig from './routes/index.js';
import exphbs from 'express-handlebars';
import applyMiddlewares from './utils/middleware.js';
import session from 'express-session';
import handlebars from 'handlebars';
import handlerBarsRegisterHelpers from './utils/handlebarsHelpers.js';

const app = express();

app.use('/public', express.static('public'));
app.use(express.json({ limit: '10mb' }	));
app.use(express.urlencoded({ extended: true }));

handlerBarsRegisterHelpers(handlebars);
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
  session({
    name: 'AuthenticationState',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false,
  })
);

applyMiddlewares(app);

routeConfig(app);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
