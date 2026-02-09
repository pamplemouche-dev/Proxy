const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Veuillez ajouter une URL : ?url=https://google.com");
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'Mozilla/5.0' } // Simule un navigateur
    });

    // On renvoie les headers et le contenu au navigateur
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération de la page : " + error.message);
  }
};
