# WishYoo

### Installation

For Development
```sh
$ npm install
$ make build
$ npm run dev
```

Install a local web server for developers
```sh
https://github.com/cortesi/devd
```

In anther window terminal
```sh
$ devd -l -w ./ /=http://localhost:3000 /api/=http://dev.wishyoo.com/api/ /data/=http://dev.wishyoo.com/data/ /cms/=./static/cms/
```

While development uncomment this lines from follwing files `chantr-web/components/layouts/CardHead.js` & `chantr-web/components/layouts/Head.js`

```
<link rel="stylesheet" href="/static/dist/css/bootstrap.min.css" />
<link rel="stylesheet" href="/static/dist/css/accordion-slider.min.css" />
<link rel="stylesheet" href="/static/css/font-face.css" />
<link rel="stylesheet" href="/static/css/style.css" />
<link rel="stylesheet" href="/static/dist/css/animate.min.css" />
<link rel="stylesheet" href="/static/assets/icons/icons.css" />
<link rel="stylesheet" href="/static/dist/css/font-awesome.min.css" />
<link rel="stylesheet" href="/static/css/styles.css" />
<link rel="stylesheet" href="/static/css/responsive.css" />
<link rel="stylesheet" href="/static/css/colors/orange.css" />
<link rel="stylesheet" href="/static/css/slick.css" />
<link rel="stylesheet" href="/static/css/pages.css" />
```

And comment line from as above files

```
<link rel="stylesheet" href="/static/index.min.css" />
<link rel="stylesheet" href="/static/dist/css/main.min.css?v=9" />
```

To build the development run following command
```
npm run build
```
And to run build code run following command
```sh
npm run start
```

Check linting run following command
```sh
make lint
```

For generating build files run following command
```sh
make build
```

always run following command while releasing
```sh
make generate_sitemap
```

always includes this components when creating any new page
`HandleError`, `Head`, `FooterInnerPage`

always handle error when adding any new api in `Actions.js`
for example:

```
export function getEvents() {
  return (dispatch) => {
    request.get(`/api/v3/users/events`).withCredentials().end((err, res) => {
      if (!err) {
        dispatch({ type: 'GET_EVENTS', events: res.body });
        success(res);
      } else {
        failure(res);
      }
    });
  };
}
```
###### Note:- Before pushing any code, Make sure to fix lint errors if any. To check lint errors  run following command `make lint`.
