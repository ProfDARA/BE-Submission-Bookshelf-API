console.log("compile berhasil");

const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  try {
    await server.start();
    console.log(`Server sedang dijalankan pada alamat ${server.info.uri}`);
  } catch (err) {
    console.error('error saat menjalankan server', err);
    process.exit(1);
  }
};

init();