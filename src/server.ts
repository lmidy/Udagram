import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { isUri } from 'valid-url';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  //    4. deletes any files on the server on finish of the response
  // RETURNS
  //validate image_url, call filterimage from utils, send file then delete from server
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url: imageURL } = req.query;
    if (!imageURL || !isUri(imageURL)) {
      return res.status(400).send({ auth: false, message: 'Oops Image URL is missing or not valid URL' });
    }
    const filteredPath = await filterImageFromURL(imageURL);
    
    res.sendFile(filteredPath, {}, () => deleteLocalFiles([filteredPath]));
  });
  
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();