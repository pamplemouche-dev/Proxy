const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
  let target = req.query.url;

  if (!target) {
    return res.status(400).send("Erreur : Ajoutez ?url=https://site.com à la fin de l'URL.");
  }

  // Auto-correction de l'URL
  if (!target.startsWith('http')) {
    target = 'https://' + target;
  }

  // Configuration du proxy
  const proxy = createProxyMiddleware({
    target: target,
    changeOrigin: true,
    followRedirects: true,
    pathRewrite: (path, req) => {
      // Nettoie l'URL pour ne pas envoyer "/api" au site cible
      return '';
    },
    onProxyReq: (proxyReq, req, res) => {
      // On fait croire au site qu'on est un vrai navigateur
      proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
    },
    onProxyRes: (proxyRes, req, res) => {
      // Autorise le chargement des ressources (CORS)
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    },
    onError: (err, req, res) => {
      res.status(500).send("Erreur de connexion au site cible.");
    }
  });

  return proxy(req, res);
};
