const nombreCache = 'apv-v1';
const archivos = [
    "/",
    "index.html",
    "error.html",
    "./css/bootstrap.css",
    "./css/styles.css",
    "./js/app.js",
    "./js/apv.js",
];

//Cuando se instala el service Worker
self.addEventListener('install', e => {
    console.log('Se instalo correctamente el service worker');

    e.waitUntil(
        caches.open(nombreCache)
            .then( cache => {
                console.log('Cacheando');
                cache.addAll(archivos)
            })
    )
});

//Activamos el service worker
self.addEventListener('activate', e =>{
    console.log('Se activo el service worker')

    e.waitUntil(
        caches.keys()
            .then( keys => {
                return Promise.all( 
                    keys.filter( key => key !== nombreCache)
                    .map( key => caches.delete(key))//Borra los demas caches
                )
            })
    )
});

//Evento fetch para descargar archivos estaticos
self.addEventListener('fetch', e =>{
    console.log('Fetch...', e)

    e.respondWith( 
        caches
            .match(e.request)
            .then( respuestaCache => (respuestaCache ? respuestaCache : caches.match("error.html")))
    )
})