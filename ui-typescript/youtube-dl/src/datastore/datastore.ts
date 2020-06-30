import path from 'path';
import { appMainPath } from '../helpers/pathHelper';

const Datastore = require('nedb')
  , db = new Datastore({ filename: path.join(appMainPath, '.myYoutube.db'), autoload: true });

export default db;